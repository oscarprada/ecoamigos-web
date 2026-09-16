import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import { evidence, content, published } from '../controllers/fileController.js';
const router=Router();
router.get('/public/content/:id',published);
router.get('/content/:id',authenticateToken,authorizeRoles('admin'),content);
router.get('/evidence/:id',authenticateToken,evidence);
export default router;
