import express from 'express';
import { addToWallet } from '../controllers/walletController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/add', authMiddleware, addToWallet);

export default router;



