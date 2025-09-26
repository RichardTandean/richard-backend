import { Request, Response, NextFunction } from 'express';
import { UserService } from '@/services/userService';
import { userListQuerySchema, paramsSchema } from '@/utils/validation';
import { AuthRequest } from '@/middleware/auth';
import { uploadSingle } from '@/middleware/upload';
import path from 'path';

const userService = new UserService();

export const getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await userService.getCurrentUser(req.user!.userId);
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { name } = req.body;
    let avatarUrl: string | undefined;

    // Handle file upload if present
    if (req.file) {
      avatarUrl = `/uploads/${req.file.filename}`;
    }

    const user = await userService.updateProfile(req.user!.userId, { name, avatarUrl });
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Validate query parameters
    const validatedQuery = userListQuerySchema.parse(req.query);
    
    const result = await userService.getUsers(validatedQuery);
    
    res.json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Validate params
    const { id } = paramsSchema.parse(req.params);
    
    const user = await userService.getUserById(id);
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Middleware for handling file uploads
export const uploadAvatar = uploadSingle;
