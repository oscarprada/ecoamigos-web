import { Router } from 'express';
import multer from 'multer';
import path from 'path';

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

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/content');
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.use(authenticateToken, authorizeRoles('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', listUsers);
router.post('/users', createUser);

router.get('/content', listContent);
router.post('/content', upload.single('file'), createContent);

router.get('/teams', listTeams);
router.post('/teams', createTeam);

router.get('/periods', listPeriods);
router.post('/periods', createPeriod);

router.get('/prizes', listPrizes);
router.post('/prizes', createPrize);

export default router;


