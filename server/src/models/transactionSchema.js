import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    transactionAmount: { type: Number, required: true },
    transactionType: { type: String, enum: ['credit', 'debit'], required: true },
    transactionDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
