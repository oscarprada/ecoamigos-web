import { Router } from 'express';
import { contentUpload as upload } from '../middleware/uploadMiddleware.js';

import {
  createContent,
  createPeriod,
  createTeam,
  createUser,
  deleteContent,
  getDashboard,
  listContent,
  listPeriods,
  listTeams,
  listUsers,
  updateContent,
  updateUser,
  updateTeam,
} from '../controllers/adminController.js';

import { exportRecyclingReport } from '../controllers/exportController.js';

import {
  authenticateToken,
  authorizeRoles,
} from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken, authorizeRoles('admin'));

router.get('/dashboard', getDashboard);

router.get('/users', listUsers);
router.post('/users', createUser);
router.patch('/users/:id', updateUser);

router.get('/content', listContent);
router.post('/content', upload.single('file'), createContent);
router.put('/content/:id', upload.single('file'), updateContent);
router.delete('/content/:id', deleteContent);

router.get('/teams', listTeams);
router.post('/teams', createTeam);
router.patch('/teams/:id', updateTeam);

router.get('/periods', listPeriods);
router.post('/periods', createPeriod);

/* ========= EXPORTACIÓN ========= */

router.get('/export/excel', exportRecyclingReport);

export default router;
