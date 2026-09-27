import { Router } from 'express';
import { statsController } from '../controllers/statsController.js';

const router = Router();

router.get('/dashboard', (req, res) => statsController.getDashboardStats(req, res));

export default router;
