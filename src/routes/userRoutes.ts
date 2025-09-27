import { Router } from 'express';
import { 
  getCurrentUser, 
  updateProfile, 
  getUsers, 
  getUserById
} from '@/controllers/userController';
import { authenticate, requireAdmin } from '@/middleware/auth';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Profile routes (accessible to all authenticated users)
router.get('/me', getCurrentUser);
router.put('/me', updateProfile);

// Admin-only routes
router.get('/', requireAdmin, getUsers);
router.get('/:id', requireAdmin, getUserById);

export default router;
