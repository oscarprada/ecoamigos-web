import { Router } from 'express';

const router = Router();
// Liveness only: no authentication, database connection, secrets or internal details.
router.get('/', (_req, res) => res.status(200).json({ status: 'ok' }));
export default router;
