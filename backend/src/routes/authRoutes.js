import { Router } from 'express';
import { login, me } from '../controllers/authController.js';
import { forgotPassword, resetPassword } from '../controllers/passwordRecoveryController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authenticateToken, me);

export default router;
