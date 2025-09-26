import { Request, Response, NextFunction } from 'express';
import { CleanupService } from '@/utils/cleanup';
import { AuthRequest } from '@/middleware/auth';

export const runCleanup = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
      return;
    }

    await CleanupService.runCleanup();
    
    res.json({
      success: true,
      message: 'Cleanup completed successfully'
    });
  } catch (error) {
    next(error);
  }
};
