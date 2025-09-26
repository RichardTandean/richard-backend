import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'user'], {
    message: 'Role must be either admin or user'
  })
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format')
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters')
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional()
});

export const userListQuerySchema = z.object({
  q: z.string().optional(),
  page: z.string().transform(Number).pipe(z.number().min(1)).default(1),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default(10)
});

export const paramsSchema = z.object({
  id: z.string().min(1, 'ID is required')
});
