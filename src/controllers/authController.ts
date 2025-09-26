import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/authService';
import { 
  registerSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema 
} from '@/utils/validation';
import { AuthRequest } from '@/middleware/auth';

const authService = new AuthService();

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate input
    const validatedData = registerSchema.parse(req.body);
    
    // Register user
    const result = await authService.register(validatedData);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);
    
    // Login user
    const result = await authService.login(validatedData);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
      return;
    }
    
    // Refresh access token
    const result = await authService.refreshToken(refreshToken);
    
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate input
    const validatedData = forgotPasswordSchema.parse(req.body);
    
    // Send reset email
    const result = await authService.forgotPassword(validatedData);
    
    res.json({
      success: true,
      message: result.message,
      ...(result.token && { token: result.token }) // Only for demo
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate input
    const validatedData = resetPasswordSchema.parse(req.body);
    
    // Reset password
    const result = await authService.resetPassword(validatedData);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }
    
    // Logout user
    const result = await authService.logout(req.user.userId);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};
