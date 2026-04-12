import { Router } from 'express';
import { getRanking, getPointsCatalog } from '../controllers/publicController.js';

const router = Router();

router.get('/ranking', getRanking);
router.get('/points-catalog', getPointsCatalog);

export default router;


