import mongoose from 'mongoose';

const doctorSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: Number, required: true },
    consultationFee: { type: Number, required: true },
    available: [
      {
        time: {
          type: String,
        }
      },
    ],
    doctorId: {
      type : mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    bookedAppointments: [
      {
        type: mongoose.Schema.Types.ObjectId, // Store appointment IDs directly
        ref: 'Appointment'
      }
    ]
  },
  { timestamps: true }
);

// Indexes for faster querying
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ "availability.time": 1 });

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
