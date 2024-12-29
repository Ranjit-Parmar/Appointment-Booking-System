import express from 'express';
import {
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getDoctorAppointments,
  getPatientAppointments,
} from '../controllers/appointmentController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import authorizeMiddleware from '../middleware/authorizedMiddleware.js';

const router = express.Router();

// Create a new appointment
router.post('/book-appointment', authMiddleware, createAppointment);

// Get appointments for a doctor by ID
router.get('/doctor-appointments/:id', authMiddleware, authorizeMiddleware,  getDoctorAppointments);

// Get appointments for a patient by ID
router.get('/patient-appointments/:id', authMiddleware, getPatientAppointments);

// Update appointment status
router.put('/:appointmentId', authMiddleware, authorizeMiddleware, updateAppointmentStatus);

// Delete an appointment
router.delete('/:appointmentId', authMiddleware, authorizeMiddleware, deleteAppointment);

export default router;
