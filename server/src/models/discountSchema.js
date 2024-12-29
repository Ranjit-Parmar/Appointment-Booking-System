import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    discountAmount: { type: Number, required: true },
    usedByPatientIds: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Discount =  mongoose.model('Discount', discountSchema);

export default Discount
