import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/utils/jwt';
import { CustomError } from '@/utils/errorHandler';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: 'admin' | 'user';
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError('Access token required', 401);
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);
    
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    next(new CustomError('Invalid or expired token', 401));
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new CustomError('Authentication required', 401));
  }
  
  if (req.user.role !== 'admin') {
    return next(new CustomError('Admin access required', 403));
  }
  
  next();
};
