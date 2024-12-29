import mongoose from 'mongoose';

const doctorFinancialReportSchema = new mongoose.Schema(
  {
    doctorId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Doctor', 
      required: true 
    },
    transactions: [
      {
        patientId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'User', 
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
    totalEarnings: { 
      type: Number, 
      default: 0 
    }
  },
  { timestamps: true }
);

const DoctorFinancialReport = mongoose.model('DoctorFinancialReport', doctorFinancialReportSchema);

export default DoctorFinancialReport;
