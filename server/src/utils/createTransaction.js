import DoctorFinancialReport from "../models/doctorFinancialReportSchema.js";
import PatientFinancialReport from "../models/patientFinancialReportSchema.js";


// Create a new transaction (credit or debit)
 const createTransaction = async ({ patientId, doctorId, transactionAmount, transactionType }) => {


    // Ensure the transaction type is either 'credit' or 'debit'
    if (!["credit", "debit"].includes(transactionType)) {

      return {
        success: false,
        message: "Invalid transaction type",
      };
    }

    // add the transaction to the patient's and doctor's financial report
    await Promise.all([
      PatientFinancialReport.create({
        patientId,
        transactions: [
          {
            doctorId,
            transactionAmount,
            transactionType: "debit",
          },
        ],
        totalSpent: transactionAmount,
      }),
      DoctorFinancialReport.create({
        doctorId,
        transactions: [
          {
            patientId,
            transactionAmount,
            transactionType: "credit",
            totalEarnings: transactionAmount,
          },
        ],
        totalEarnings: transactionAmount,
      }),
    ]);

    return {
      success: true,
      message: "Transaction successful",
    };
 
};


export default createTransaction;