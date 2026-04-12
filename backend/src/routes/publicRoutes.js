import { Router } from 'express';
import { getPublicHome, getPublicRanking } from '../controllers/publicController.js';

const router = Router();
router.get('/home', getPublicHome);
router.get('/ranking', getPublicRanking);

export default router;
