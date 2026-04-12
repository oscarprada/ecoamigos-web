import { Router } from 'express';
import {
  createContent,
  createPeriod,
  createPrize,
  createTeam,
  createUser,
  getDashboard,
  listContent,
  listPeriods,
  listPrizes,
  listTeams,
  listUsers,
} from '../controllers/adminController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();
router.use(authenticateToken, authorizeRoles('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', listUsers);
router.post('/users', createUser);
router.get('/content', listContent);
router.post('/content', createContent);
router.get('/teams', listTeams);
router.post('/teams', createTeam);
router.get('/periods', listPeriods);
router.post('/periods', createPeriod);
router.get('/prizes', listPrizes);
router.post('/prizes', createPrize);

export default router;
