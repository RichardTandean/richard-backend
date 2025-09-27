const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    // Send test email
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: 'richard123tandean@gmail.com', // Your email
      subject: 'Test Email from Richard App',
      html: `
        <h2>Welcome to Richard App!</h2>
        <p>This is a test email to verify email functionality.</p>
        <p>If you receive this, your email setup is working correctly! 🎉</p>
      `,
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Email failed:', error.message);
  }
}

testEmail();
