import PatientFinancialReport from "../models/patientFinancialReportSchema.js";
import DoctorFinancialReport from "../models/doctorFinancialReportSchema.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import mongoose from "mongoose";
import Discount from "../models/discountSchema.js";

// Generate financial reports for a patient
export const generatePatientFinancialReport = asyncErrorHandler(async (req, res, next) => {
  const { filter } = req.query;  // Optional filter parameter (e.g., 'monthly', 'yearly')
  const patientId = req.params.patientId; // Get patient ID from params

  // Get the current date
  const currentDate = new Date();
  let startDate, endDate;

  // Handle filter if provided (monthly or yearly)
  if (filter === 'monthly') {
    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  } else if (filter === 'yearly') {
    startDate = new Date(currentDate.getFullYear(), 0, 1);
    endDate = new Date(currentDate.getFullYear() + 1, 0, 1);
  }

  // Fetch discounts applied to the patient
  const discounts = await Discount.aggregate([
    {
      $match: {
        usedByPatientIds: new mongoose.Types.ObjectId(patientId), // Match the patientId
      }
    },
    {
      $group: {
        _id: "$usedByPatientIds",
        totalDiscount: { $sum: "$discountAmount" } // Sum of the discounts used by this patient
      }
    }
  ]);

  const totalDiscount = discounts.length > 0 ? discounts[0].totalDiscount : 0;

  // Build the aggregation pipeline
  const pipeline = [
    {
      $match: {
        patientId: new mongoose.Types.ObjectId(patientId), // Match by patient ID
        ...(startDate && endDate ? { "transactions.transactionDate": { $gte: startDate, $lt: endDate } } : {}) // Optional date filter
      },
    },
    { $unwind: "$transactions" },
    {
      $group: {
        _id: "$patientId", // Group by patient ID
        totalSpent: { $sum: "$transactions.transactionAmount" },  // Total spent
        totalCredit: {
          $sum: {
            $cond: [
              { $eq: ["$transactions.transactionType", "credit"] }, 
              "$transactions.transactionAmount",  // Sum of credit transactions
              0,
            ],
          },
        },
        totalDebit: {
          $sum: {
            $cond: [
              { $eq: ["$transactions.transactionType", "debit"] }, 
              "$transactions.transactionAmount",  // Sum of debit transactions
              0,
            ],
          },
        },
        transactionCount: { $sum: 1 },  // Total number of transactions
        transactionDetails: {
          $push: {
            transactionType: "$transactions.transactionType",
            transactionAmount: "$transactions.transactionAmount",
            transactionDate: "$transactions.transactionDate",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        patientId: "$_id",
        totalSpent: 1,
        totalCredit: 1,
        totalDebit: 1,
        transactionCount: 1,
        transactionDetails: 1,  // Include detailed transaction information
      },
    },
  ];

  // Execute the aggregation pipeline
  const report = await PatientFinancialReport.aggregate(pipeline);

  // If no transactions are found, return a message with an empty report
  if (report.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No transactions found for the selected period",
      report: [],  // Empty report array
    });
  }

  // Sending the generated report as a response
  res.status(200).json({
    success: true,
    discounts: totalDiscount,
    report: report[0],  // Return the first document from the aggregation result
  });
});

// Generate financial reports for a doctor
export const generateDoctorFinancialReport = asyncErrorHandler(async (req, res, next) => {
  const { filter } = req.query; // 'monthly' or 'yearly' passed from frontend
  const doctorId = req.params.doctorId; // Get doctor ID from params

  // Get the current date
  const currentDate = new Date();
  let startDate, endDate;

  // Initialize date range variables based on filter
  if (filter === 'monthly') {
    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  } else if (filter === 'yearly') {
    startDate = new Date(currentDate.getFullYear(), 0, 1);
    endDate = new Date(currentDate.getFullYear() + 1, 0, 1);
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid filter. Use 'monthly' or 'yearly'."
    });
  }

  // Fetch the total discount applied to the doctor during the period
  const discounts = await Discount.aggregate([
    {
      $match: {
        doctorId: new mongoose.Types.ObjectId(doctorId), // Match doctor by ID
        createdAt: { $gte: startDate, $lt: endDate } // Filter discounts by the selected period
      }
    },
    {
      $group: {
        _id: "$doctorId",
        totalDiscount: { $sum: "$discountAmount" } // Sum the discount amounts
      }
    }
  ]);

  const totalDiscount = discounts.length > 0 ? discounts[0].totalDiscount : 0;

  // Generate the financial report based on the filter
  const report = await DoctorFinancialReport.aggregate([
    {
      $match: {
        doctorId: new mongoose.Types.ObjectId(doctorId), // Match doctor by ID
        "transactions.transactionDate": { 
          $gte: startDate, 
          $lt: endDate 
        }, // Filter transactions by date range
      },
    },
    { $unwind: "$transactions" }, // Unwind the transactions array
    {
      $group: {
        _id: "$transactions.patientId",  // Group by patient ID
        totalEarnings: {
          $sum: {
            $cond: [
              { $eq: ["$transactions.transactionType", "credit"] },
              "$transactions.transactionAmount",
              0,
            ],
          },
        },
        totalTransactions: { $sum: 1 }, // Total number of transactions for each patient
        transactionDetails: {
          $push: {
            patientId: "$transactions.patientId", // Include patientId in the details
            transactionType: "$transactions.transactionType",
            transactionAmount: "$transactions.transactionAmount",
            transactionDate: "$transactions.transactionDate",
          },
        },
      },
    },
    {
      $project: {
        _id: 0, // Exclude the _id field
        patientId: "$_id",  // Include patientId from the group
        totalEarnings: 1,  // Total earnings (sum of credit transactions)
        totalTransactions: 1,  // Total number of transactions
        transactionDetails: 1,  // Include the details of each transaction (credit/debit)
      },
    },
  ]);

  // If no transactions found, return an empty report with a success message
  if (report.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No transactions found for the selected period",
      report: [], // Empty report array
    });
  }

  // Sending the generated report as a response
  res.status(200).json({
    success: true,
    discounts: totalDiscount,
    report: report, // Send the generated report
  });
});
