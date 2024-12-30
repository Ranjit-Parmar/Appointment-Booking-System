import Doctor from '../models/doctorSchema.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import { CustomError } from '../utils/customErrorClass.js';

// Update doctor availability
export const setAvailability = asyncErrorHandler(async (req, res, next) => {
 
    const { doctorId, available } = req.body;

    console.log(available);
    
    // Check if the doctor exists
    const doctor = await Doctor.findOne({doctorId});
    if (!doctor) {
      return next(new CustomError('Doctor not found', 404));
    }

    // Update doctor availability
    doctor.available = available;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: 'Availability updated successfully',
    });
  
});


// Create a new doctor profile
export const createDoctorProfile = asyncErrorHandler(async (req, res, next) => {

    const { name, specialization, address, phone, consultationFee, doctorId } = req.body;

    // Validate input
    if (!name || !specialization || !address || !phone || !consultationFee) {
      return next(new CustomError('All fields are required.', 400));
    }

    // Create and save doctor profile
    const doctor = new Doctor({ name, specialization, address, phone, consultationFee, doctorId });
    const savedDoctor = await doctor.save();

    res.status(201).json({
      success: true,
      message: 'Doctor profile created successfully.',
      doctor: savedDoctor,
    });

});



// Update a doctor profile
export const updateDoctorProfile = asyncErrorHandler(async (req, res, next) => {

  
  const { name, specialization, address, phone, consultationFee, doctorId} = req.body;
  
  // Validate input
  if (!name || !specialization || !address || !phone || !consultationFee) {
    return next(new CustomError('All fields are required.', 400));
  }

  // Create and save doctor profile
  const doctor = await Doctor.findOneAndUpdate({doctorId}, { name, specialization, address, phone, consultationFee }, {new:true});
  
  res.status(201).json({
    success: true,
    message: 'Doctor profile updated successfully.',
    doctor
  });

});
// Get all doctors
export const getAllDoctors = asyncErrorHandler(async (req, res, next) => {
  
  let filter = {};
  
  if(req.query.sort){
    filter.specialization = req.query.sort;
  }
  
    const doctors = await Doctor.find(filter).select('name specialization address doctorId');

    if (!doctors.length) {
      return next(new CustomError('No doctors found.', 404));
    }
    res.status(200).json({
      success: true,
      doctors,
    });
 
});

// Get a doctor by ID
export const getDoctorById = asyncErrorHandler(async (req, res, next) => {

    const doctorId = req.params.id;
    
    const doctor = await Doctor.findOne({doctorId}).populate({
      path: 'bookedAppointments',  
      select: 'time',
    });

    if (!doctor) {
      return next(new CustomError('Doctor not found.', 404));
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  
});


// Get all doctor's specialization
export const getDoctorSpecialization = asyncErrorHandler(async (req, res, next) => {
    
    const specialization = await Doctor.find().select('specialization');

    if (!specialization) {
      return next(new CustomError('specialization not found.', 404));
    }

    res.status(200).json({
      success: true,
      specialization,
    });
  
});
