import { Router } from 'express';

import {
  getRanking,
  getPointsCatalog,
  getPublicContentByCategory,
  getPublicStats,
} from '../controllers/publicController.js';

const router = Router();

router.get('/ranking', getRanking);

router.get('/stats', getPublicStats);

router.get('/points-catalog', getPointsCatalog);

router.get(
  '/content/:category',
  getPublicContentByCategory
);

export default router;

