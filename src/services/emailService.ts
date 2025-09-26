import nodemailer from 'nodemailer';
import { CustomError } from '@/utils/errorHandler';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // For development, we'll use a test account
    // In production, configure with real SMTP settings
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
        pass: process.env.SMTP_PASS || 'ethereal.pass'
      }
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    try {
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@richardapp.com',
        to: email,
        subject: 'Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>Hello,</p>
            <p>You have requested to reset your password. Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Password reset email sent:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new CustomError('Failed to send password reset email', 500);
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@richardapp.com',
        to: email,
        subject: 'Welcome to Richard App!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to Richard App!</h2>
            <p>Hello ${name},</p>
            <p>Thank you for registering with Richard App. Your account has been successfully created!</p>
            <p>You can now log in and start using our services.</p>
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Welcome email sent:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't throw error for welcome email as it's not critical
    }
  }
}
