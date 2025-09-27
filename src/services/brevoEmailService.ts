import axios from 'axios';
import { CustomError } from '@/utils/errorHandler';

interface BrevoEmailData {
  sender: {
    email: string;
    name: string;
  };
  to: Array<{
    email: string;
    name: string;
  }>;
  subject: string;
  htmlContent: string;
  textContent?: string;
  tags?: string[];
}

export class BrevoEmailService {
  private apiKey: string;
  private apiUrl: string;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.apiKey = process.env.BREVO_API_KEY || '';
    this.apiUrl = process.env.BREVO_API_URL || 'https://api.brevo.com/v3/smtp/email';
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@richardapp.com';
    this.fromName = process.env.FROM_NAME || 'Richard App';

    if (!this.apiKey) {
      throw new Error('BREVO_API_KEY is required');
    }
  }

  private async sendEmail(emailData: BrevoEmailData): Promise<void> {
    try {
      const response = await axios.post(this.apiUrl, emailData, {
        headers: {
          'accept': 'application/json',
          'api-key': this.apiKey,
          'content-type': 'application/json',
        },
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('Email sent successfully:', response.data);
      }
    } catch (error: any) {
      console.error('Error sending email:', error.response?.data || error.message);
      throw new CustomError('Failed to send email', 500);
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Richard App!</h1>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}! 👋</h2>
          
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            Thank you for registering with Richard App. Your account has been successfully created!
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">What's next?</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>✅ Your account is ready to use</li>
              <li>🔐 Your password is securely stored</li>
              <li>📱 You can now log in to the app</li>
              <li>🎯 Start exploring all the features</li>
            </ul>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            If you have any questions or need assistance, please don't hesitate to contact our support team.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #007bff; color: white; padding: 15px 30px; border-radius: 25px; display: inline-block; text-decoration: none;">
              🚀 Get Started
            </div>
          </div>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          This is an automated message from Richard App. Please do not reply to this email.
        </p>
      </div>
    `;

    const textContent = `
Welcome to Richard App!

Hello ${name}!

Thank you for registering with Richard App. Your account has been successfully created!

What's next?
✅ Your account is ready to use
🔐 Your password is securely stored  
📱 You can now log in to the app
🎯 Start exploring all the features

If you have any questions or need assistance, please don't hesitate to contact our support team.

Get Started: Open the Richard App on your device

---
This is an automated message from Richard App. Please do not reply to this email.
    `;

    await this.sendEmail({
      sender: {
        email: this.fromEmail,
        name: this.fromName,
      },
      to: [
        {
          email: email,
          name: name,
        },
      ],
      subject: '🎉 Welcome to Richard App!',
      htmlContent,
      textContent,
      tags: ['welcome', 'registration'],
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}?token=${resetToken}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 40px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset Request</h1>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello! 🔐</h2>
          
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            You have requested to reset your password for your Richard App account. Click the button below to reset your password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              🔑 Reset Password
            </a>
          </div>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6; font-size: 14px;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          <p style="word-break: break-all; color: #007bff; background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px;">
            ${resetUrl}
          </p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #495057; margin: 0; font-size: 14px;">
              <strong>🔒 Security Note:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
            </p>
          </div>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          This is an automated message from Richard App. Please do not reply to this email.
        </p>
      </div>
    `;

    const textContent = `
Password Reset Request

Hello!

You have requested to reset your password for your Richard App account.

Reset your password: ${resetUrl}

⚠️ Important: This link will expire in 1 hour for security reasons.

🔒 Security Note: If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

---
This is an automated message from Richard App. Please do not reply to this email.
    `;

    await this.sendEmail({
      sender: {
        email: this.fromEmail,
        name: this.fromName,
      },
      to: [
        {
          email: email,
          name: 'User',
        },
      ],
      subject: '🔐 Reset Your Richard App Password',
      htmlContent,
      textContent,
      tags: ['password-reset', 'security'],
    });
  }
}
