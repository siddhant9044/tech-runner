import { Router } from 'express';
import { leaderboardController, playerRankController } from '../controllers/leaderboardController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
const router = Router();
router.get('/', leaderboardController);
router.get('/player/:playerId', requireAuth, playerRankController);
export default router;
