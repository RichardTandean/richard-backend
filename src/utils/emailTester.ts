import { EmailService } from '@/services/emailService';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export class EmailTester {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async testPasswordResetEmail(email: string): Promise<void> {
    console.log('🧪 Testing password reset email...');
    console.log(`📧 Sending to: ${email}`);
    
    try {
      const testToken = 'test-token-' + Date.now();
      await this.emailService.sendPasswordResetEmail(email, testToken);
      console.log('✅ Password reset email sent successfully!');
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
    }
  }

  async testWelcomeEmail(email: string, name: string): Promise<void> {
    console.log('🧪 Testing welcome email...');
    console.log(`📧 Sending to: ${email}`);
    
    try {
      await this.emailService.sendWelcomeEmail(email, name);
      console.log('✅ Welcome email sent successfully!');
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
    }
  }

  async testAllEmails(email: string, name: string): Promise<void> {
    console.log('🚀 Starting email tests...');
    console.log('='.repeat(50));
    
    await this.testPasswordResetEmail(email);
    console.log('');
    await this.testWelcomeEmail(email, name);
    
    console.log('='.repeat(50));
    console.log('✅ Email tests completed!');
  }
}

// CLI usage
if (require.main === module) {
  const tester = new EmailTester();
  const email = process.argv[2] || 'test@example.com';
  const name = process.argv[3] || 'Test User';
  
  console.log('📧 Email Configuration Test');
  console.log('='.repeat(50));
  console.log(`SMTP Host: ${process.env.SMTP_HOST || 'smtp.ethereal.email'}`);
  console.log(`SMTP Port: ${process.env.SMTP_PORT || '587'}`);
  console.log(`From Email: ${process.env.FROM_EMAIL || 'noreply@richardapp.com'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log('='.repeat(50));
  
  tester.testAllEmails(email, name).catch(console.error);
}
