import { Router } from 'express';
import { 
  getCurrentUser, 
  updateProfile, 
  getUsers, 
  getUserById,
  createUser
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
router.post('/', requireAdmin, createUser);

export default router;
