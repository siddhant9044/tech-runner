import { Router } from 'express';
import { getScoresController, submitScoreController } from '../controllers/scoreController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
const router = Router(); router.use(requireAuth); router.post('/level', submitScoreController); router.get('/:sessionId', getScoresController); export default router;
