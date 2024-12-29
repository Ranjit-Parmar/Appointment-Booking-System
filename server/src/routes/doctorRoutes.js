import express from 'express';
import { createDoctorProfile, getAllDoctors, getDoctorById, getDoctorSpecialization, setAvailability } from '../controllers/doctorController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import authorizeMiddleware from '../middleware/authorizedMiddleware.js';

const router = express.Router();

router.post('/setProfile', authMiddleware, authorizeMiddleware, createDoctorProfile); // Create doctor profile
router.get('/getAllDoctors', authMiddleware, getAllDoctors); // Get all doctors
router.get('/getSpecialization', authMiddleware, getDoctorSpecialization); // Get all doctor's specialization
router.get('/:id', authMiddleware, getDoctorById); // Get doctor by ID
router.patch('/availability', authMiddleware, authorizeMiddleware, setAvailability); // Update availability

export default router;
