import { Router } from 'express';
import { 
  register, 
  login, 
  refreshToken, 
  forgotPassword, 
  resetPassword, 
  logout 
} from '@/controllers/authController';
import { 
  loginRateLimit, 
  registerRateLimit, 
  resetPasswordRateLimit, 
  authRateLimit 
} from '@/middleware/rateLimiter';
import { authenticate } from '@/middleware/auth';

const router = Router();

// Public routes with specific rate limits
router.post('/register', registerRateLimit, register);
router.post('/login', loginRateLimit, login);
router.post('/forgot', resetPasswordRateLimit, forgotPassword);
router.post('/reset', resetPasswordRateLimit, resetPassword);

// Other auth routes with general rate limit
router.post('/refresh', authRateLimit, refreshToken);

// Protected routes
router.post('/logout', authRateLimit, authenticate, logout);

export default router;
