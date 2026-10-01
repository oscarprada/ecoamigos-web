import { Router } from 'express';
import { authRateLimit } from '../middleware/authRateLimit.js';
import { login, me, logout } from '../controllers/authController.js';
import { forgotPassword, resetPassword } from '../controllers/passwordRecoveryController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/login', authRateLimit('LOGIN'), login);
router.post('/logout', logout);
router.post('/forgot-password', authRateLimit('FORGOT'), forgotPassword);
router.post('/reset-password', authRateLimit('RESET'), resetPassword);
router.get('/me', authenticateToken, me);

export default router;
