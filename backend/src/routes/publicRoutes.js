import { Router } from 'express';
import {
  getRanking,
  getPointsCatalog,
  getPublicContentByCategory,
} from '../controllers/publicController.js';

const router = Router();

router.get('/ranking', getRanking);
router.get('/points-catalog', getPointsCatalog);
router.get('/content/:category', getPublicContentByCategory);

export default router;
