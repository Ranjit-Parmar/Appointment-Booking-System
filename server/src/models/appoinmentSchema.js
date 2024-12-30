import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Doctor', 
      required: true 
    },
    patientId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    date: { 
      type: Date, 
      required: true, 
    },  
    time: { 
      type: String, 
      required: true, 
      validate: {
        validator: (value) => /^[0-9]{1,2}:[0-9]{2}\s?(AM|PM)$/i.test(value), // Time format like "10:00 AM"
        message: 'Time must be in the format HH:mm AM/PM',
      }
    },
    status: { 
      type: String, 
      enum: ['scheduled', 'completed'], 
      default: 'scheduled' 
    },
    consultationFee: { 
      type: Number,
      required: true, 
    }
  },
  { 
    timestamps: true, 
    // Adding indexes on commonly queried fields to improve performance
    indexes: [
      { fields: { doctorId: 1, date: 1, time: 1 }, unique: true }
    ] 
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
