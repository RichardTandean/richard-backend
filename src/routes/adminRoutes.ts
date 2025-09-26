import { Router } from 'express';
import { runCleanup } from '@/controllers/adminController';
import { authenticate, requireAdmin } from '@/middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Admin-only routes
router.post('/cleanup', runCleanup);

export default router;
