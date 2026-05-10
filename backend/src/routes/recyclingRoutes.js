import { Router } from 'express';

import {
  createRecord,
  listMyRecords,
  listPendingRecords,
  listReviewedRecords,
  reviewRecord,
} from '../controllers/recyclingController.js';

import {
  authenticateToken,
  authorizeRoles,
} from '../middleware/authMiddleware.js';

import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.use(authenticateToken);

router.post(
  '/',
  authorizeRoles('leader', 'admin'),
  upload.single('evidence'),
  createRecord
);

router.get(
  '/mine',
  authorizeRoles('leader', 'admin'),
  listMyRecords
);

router.get(
  '/pending',
  authorizeRoles('admin'),
  listPendingRecords
);

router.get(
  '/reviewed',
  authorizeRoles('admin'),
  listReviewedRecords
);

router.patch(
  '/:id/review',
  authorizeRoles('admin'),
  reviewRecord
);

export default router;
