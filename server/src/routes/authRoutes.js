import express from 'express';
import { registerUser, loginUser, loadUser, logOutUser } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/loadUser", authMiddleware, loadUser);
router.get("/logout", authMiddleware, logOutUser);

export default router;
