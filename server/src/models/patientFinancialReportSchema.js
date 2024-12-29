import mongoose from 'mongoose';

const patientFinancialReportSchema = new mongoose.Schema(
  {
    patientId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    transactions: [
      {
        doctorId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Doctor', 
          required: true 
        },
        transactionAmount: { 
          type: Number, 
          required: true 
        },
        transactionType: { 
          type: String, 
          enum: ['credit', 'debit'], 
          required: true 
        },
        transactionDate: { 
          type: Date, 
          default: Date.now 
        },
        description: { 
          type: String 
        },
      }
    ],
    totalSpent: { 
      type: Number, 
      default: 0 
    }
  },
  { timestamps: true }
);

const PatientFinancialReport = mongoose.model('PatientFinancialReport', patientFinancialReportSchema);

export default PatientFinancialReport;
