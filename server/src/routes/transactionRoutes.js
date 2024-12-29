import express from 'express';
import { generateDoctorFinancialReport, generatePatientFinancialReport } from '../controllers/transactionController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import authorizeMiddleware from '../middleware/authorizedMiddleware.js';
const router = express.Router();

// Route to get all transactions for a patient 
router.get('/patientreport/:patientId', authMiddleware, generatePatientFinancialReport);

// Route to get all transactions for a doctor
router.get('/doctorReport/:doctorId', authMiddleware, authorizeMiddleware, generateDoctorFinancialReport);

export default router;
