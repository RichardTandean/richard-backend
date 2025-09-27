import bcrypt from 'bcryptjs';
import { prisma } from '@/models';
import { generateTokens, verifyRefreshToken } from '@/utils/jwt';
import { CustomError } from '@/utils/errorHandler';
import { BrevoEmailService } from './brevoEmailService';
import { 
  RegisterRequest, 
  LoginRequest, 
  ForgotPasswordRequest, 
  ResetPasswordRequest,
  LoginResponse,
  User 
} from '@/types';

export class AuthService {
  private emailService: BrevoEmailService;

  constructor() {
    this.emailService = new BrevoEmailService();
  }
  async register(data: RegisterRequest): Promise<LoginResponse> {
    const { name, email, password, role } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new CustomError('User with this email already exists', 409);
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role
      }
    });

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as 'admin' | 'user'
    });

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;

    // Send welcome email (non-blocking)
    this.emailService.sendWelcomeEmail(email, name).catch(error => {
      console.error('Failed to send welcome email:', error);
    });

    return {
      ...tokens,
      user: userWithoutPassword as Omit<User, 'passwordHash'>
    };
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const { email, password } = data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new CustomError('Invalid email or password', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new CustomError('Invalid email or password', 401);
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as 'admin' | 'user'
    });

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      ...tokens,
      user: userWithoutPassword as Omit<User, 'passwordHash'>
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      
      // Verify user still exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user) {
        throw new CustomError('User not found', 404);
      }

      // Generate new access token
      const { generateAccessToken } = await import('@/utils/jwt');
      const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role as 'admin' | 'user'
      });

      return { accessToken };
    } catch (error) {
      throw new CustomError('Invalid refresh token', 401);
    }
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string; token?: string }> {
    const { email } = data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return { message: 'If the email exists, a password reset link has been sent' };
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);

    // Set expiration to 1 hour
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Store reset token
    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt
      }
    });

    // Send password reset email
    try {
      await this.emailService.sendPasswordResetEmail(email, resetToken);
      return { 
        message: 'If the email exists, a password reset link has been sent'
      };
    } catch (error) {
      // If email fails, still return success for security
      // But log the error for debugging
      console.error('Failed to send password reset email:', error);
      return { 
        message: 'If the email exists, a password reset link has been sent',
        token: resetToken // Fallback for development
      };
    }
  }

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const { token, newPassword } = data;

    // Find reset token
    const resetTokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!resetTokenRecord) {
      throw new CustomError('Invalid reset token', 400);
    }

    // Check if token is expired
    if (resetTokenRecord.expiresAt < new Date()) {
      throw new CustomError('Reset token has expired', 400);
    }

    // Check if token is already used
    if (resetTokenRecord.usedAt) {
      throw new CustomError('Reset token has already been used', 400);
    }

    // Hash new password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update user password and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetTokenRecord.userId },
        data: { passwordHash }
      }),
      prisma.passwordResetToken.update({
        where: { id: resetTokenRecord.id },
        data: { usedAt: new Date() }
      })
    ]);

    return { message: 'Password reset successfully' };
  }

  async logout(userId: string): Promise<{ message: string }> {
    // In a more sophisticated implementation, you might:
    // - Store refresh tokens in a blacklist
    // - Use Redis to invalidate tokens
    // For now, we'll just return success
    return { message: 'Logged out successfully' };
  }
}
