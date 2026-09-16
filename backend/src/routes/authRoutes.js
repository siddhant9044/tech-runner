import { Router } from 'express';
import { registerController, loginController, meController } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimitMiddleware.js';
const router = Router();
router.post('/register', authLimiter, registerController);
router.post('/login', authLimiter, loginController);
router.get('/me', requireAuth, meController);
export default router;
