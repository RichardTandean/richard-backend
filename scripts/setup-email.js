#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Free Email Setup for Richard Backend');
console.log('=====================================');
console.log('');
console.log('We\'ll set up Brevo (Sendinblue) - FREE tier:');
console.log('✅ 300 emails per day');
console.log('✅ No credit card required');
console.log('✅ Perfect for testing');
console.log('');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupEmail() {
  try {
    console.log('📧 Step 1: Create Brevo Account');
    console.log('1. Go to: https://www.brevo.com');
    console.log('2. Click "Sign up free"');
    console.log('3. Verify your email address');
    console.log('4. Go to SMTP & API → SMTP');
    console.log('');
    
    const email = await askQuestion('Enter your Brevo email: ');
    const smtpKey = await askQuestion('Enter your Brevo SMTP key: ');
    const fromEmail = await askQuestion('Enter your sender email (e.g., noreply@yourdomain.com): ');
    const frontendUrl = await askQuestion('Enter your frontend URL (e.g., http://localhost:3000): ');

    // Create .env file
    const envContent = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/richard_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here-change-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV="development"

# Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880

# CORS
CORS_ORIGIN="http://localhost:3000"

# Email (Free Brevo/Sendinblue Setup)
SMTP_HOST="smtp-relay.brevo.com"
SMTP_PORT="587"
SMTP_USER="${email}"
SMTP_PASS="${smtpKey}"
FROM_EMAIL="${fromEmail}"
FRONTEND_URL="${frontendUrl}"
`;

    fs.writeFileSync('.env', envContent);
    
    console.log('');
    console.log('✅ .env file created successfully!');
    console.log('');
    console.log('🧪 Next steps:');
    console.log('1. Run: npm run test:email your-email@example.com');
    console.log('2. Check your email inbox');
    console.log('3. Start your server: npm run dev');
    console.log('');
    console.log('📚 For more help, check: docs/EMAIL_SETUP.md');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

setupEmail();
