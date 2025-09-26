import { Router } from 'express';
import { 
  register, 
  login, 
  refreshToken, 
  forgotPassword, 
  resetPassword, 
  logout 
} from '@/controllers/authController';
import { authRateLimit } from '@/middleware/rateLimiter';
import { authenticate } from '@/middleware/auth';

const router = Router();

// Apply rate limiting to auth routes
router.use(authRateLimit);

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);
router.post('/refresh', refreshToken);

// Protected routes
router.post('/logout', authenticate, logout);

export default router;
