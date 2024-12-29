import Appointment from '../models/appoinmentSchema.js';
import Doctor from '../models/doctorSchema.js';
import User from '../models/userSchema.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import calculateDiscount from '../utils/calculateDiscount.js';
import createTransaction from '../utils/createTransaction.js';
import { CustomError } from '../utils/customErrorClass.js';
import deductFromWallet from '../utils/deductFromWallet.js';

// Create an appointment
export const createAppointment = asyncErrorHandler(async (req, res, next) => {

    const { doctorId, patientId, date, time, notes, consultationFee } = req.body;

    // Check if the doctor exists
    const doctor = await Doctor.findOne({doctorId});
    if (!doctor) {
      const error = new CustomError('Doctor not found', 404);
      return next(error);
    }

    // Check if the patient exists
    const patient = await User.findById(patientId);
    if (!patient) {
      const error = new CustomError('Patient not found', 404);
      return next(error);
    }

    // Check if the appointment date is in the past
    const currentDate = new Date();
    if (new Date(date) < currentDate) {
      const error = new CustomError('Appointment date cannot be in the past');
      error.status = 400;  // Bad request
      return next(error);  // Pass the error to the global error handler
    }


    // Check if the doctor is available
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: 'scheduled',
    });

    if (existingAppointment) {
      const error = new CustomError('Doctor is not available at this time', 400);
      return next(error);
    }

    // Deduct wallet balance
  const walletResult = await deductFromWallet({
    patientId,
    amount: consultationFee,
  });

  if (!walletResult.sufficient_balance) {
    return next(new CustomError(walletResult.message, 400));
  }
    // Calculate the discount
    const discountPercentage = 20; // Example: 20% discount for first-time consultations
    const { discountedFee, discountApplied, discount_message } = await calculateDiscount(
      doctorId,
      patientId,
      consultationFee,
      discountPercentage
    );  

    

    // Create the appointment
    const appointment = await Appointment.create({
      doctorId,
      patientId,
      date,
      time,
      notes,
      consultationFee: discountedFee,
    });

    await Doctor.findOneAndUpdate(
      {doctorId}, // Correctly pass doctorId as the first argument
      { $push: { bookedAppointments: appointment._id } }, // Push the appointment ID into the bookedAppointments array
      { new: true } // Optionally return the updated doctor document
    );
  
      // Prepare the data to simulate the req.body for createTransaction
      const transactionData = {
        patientId,
        doctorId,
        transactionAmount: discountedFee,
        transactionType: 'debit', 
      };
  
      // Call createTransaction controller
      const transactionResponse = await createTransaction(transactionData);

      if(!transactionResponse.success){
        const error = new CustomError(transactionResponse.message, 400);
        return next(error);
      }

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment,
      discount: {
        discountApplied,
        discount_message,
      },
      transaction: {
        message : transactionResponse.message,
        transaction : transactionResponse.report
      },
    });
});


// Get appointments for a patient by ID
export const getPatientAppointments = asyncErrorHandler(async (req, res, next) => {
  
    const { id } = req.params;

    // Get appointments
    const appointments = await Appointment.find({patientId: id})
      .populate('doctorId', 'name specialization')
      .populate('patientId', 'name email')
      .sort({ date: 1, time: 1 });

    res.status(200).json({ 
        success: true,
        appointments 
    });
});

// Get appointments for a doctor by ID
export const getDoctorAppointments = asyncErrorHandler(async (req, res, next) => {
  
    const { id } = req.params;

    const appointments = await Doctor.find({ doctorId: id })
  .populate({
    path: 'bookedAppointments',
    populate: {
      path: 'patientId', // Populate the patientId field
      model: 'User', // The model name for the Patient collection
    },
  });

res.status(200).json({
  success: true,
  length : appointments.length,
  appointments,
});

});

// Update appointment status
export const updateAppointmentStatus = asyncErrorHandler(async (req, res, next) => {

  
  const { appointmentId } = req.params;
  const { status } = req.body;

    if (!['scheduled', 'completed'].includes(status)) {
        const error = new CustomError('Invalid status', 400);
        return next(error);
    }

    const appointment = await Appointment.findByIdAndUpdate(appointmentId,{status},{new:true});
    if (!appointment) {
        const error = new CustomError('Appointment not found', 404);
        return next(error);
    }

    res.status(200).json({ 
        success: true,
        message: 'Appointment status updated', 
        appointment 
    });
});

// Delete an appointment
export const deleteAppointment = asyncErrorHandler(async (req, res, next) => {
  
    const { appointmentId } = req.params;

    const appointment = await Appointment.findByIdAndDelete(appointmentId);
    if (!appointment) {
        const error = new CustomError('Appointment not found', 404);
        return next(error);
    }
    
    res.status(200).json({ 
        success: true,
        message: 'Appointment deleted successfully' 
    });
});
