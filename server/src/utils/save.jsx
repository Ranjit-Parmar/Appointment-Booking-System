import PatientFinancialReport from "../models/patientFinancialReportSchema.js";
import DoctorFinancialReport from "../models/doctorFinancialReportSchema.js"
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import mongoose from "mongoose";
import Discount from "../models/discountSchema.js";


export const generatePatientFinancialReport = asyncErrorHandler(async (req, res, next) => {
  const patientId = req.params.patientId;

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

  // Generate the patient financial report
  const report = await PatientFinancialReport.aggregate([
    {
      $match: {
        patientId: new mongoose.Types.ObjectId(patientId),
      }
    },
    { $unwind: "$transactions" },
    {
      $group: {
        _id: "$patientId",
        totalSpent: { $sum: "$transactions.transactionAmount" },
        totalDebit: {
          $sum: {
            $cond: [
              { $eq: ["$transactions.transactionType", "debit"] },
              "$transactions.transactionAmount",
              0,
            ],
          },
        },
        transactionCount: { $sum: 1 },
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
        totalDebit: 1,
        transactionCount: 1,
        transactionDetails: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    discounts,
    report: report[0],
  });
});




export const generateDoctorFinancialReport = asyncErrorHandler(async (req, res, next) => {
  const { filter } = req.query;
  const doctorId = req.params.doctorId;
  
  // Get the current date
  const currentDate = new Date();

  // Initialize date range variables based on filter
  let startDate, endDate;

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

  // Fetch discounts for the doctor
  const discounts = await Discount.aggregate([
    {
      $match: {
        doctorId: new mongoose.Types.ObjectId(doctorId), // Match the doctorId
        createdAt: { $gte: startDate, $lt: endDate } // Filter by date range
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


  const report = await DoctorFinancialReport.aggregate([
    {
      $match: {
        doctorId: new mongoose.Types.ObjectId(doctorId),
        "transactions.transactionDate": { $gte: startDate, $lt: endDate }
      }
    },
    { $unwind: "$transactions" },
    {
      $group: {
        _id: null,
        totalEarnings: {
          $sum: {
            $cond: [
              { $eq: ["$transactions.transactionType", "credit"] },
              "$transactions.transactionAmount",
              0,
            ],
          },
        },
        totalTransactions: { $sum: 1 },
        totalAppointments: { $addToSet: "$transactions.patientId" },
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
        totalEarnings: 1,
        totalTransactions: 1,
        totalAppointments: { $size: "$totalAppointments" },
        transactionDetails: 1,
      },
    },
  ]);
  

  if (report.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No transactions found for the selected period",
      report: {},
    });
  }

  res.status(200).json({
    success: true,
    discounts,
    report: report[0],
  });
});
