#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function updateEmail() {
  try {
    console.log('🔧 Update Brevo SMTP Credentials');
    console.log('================================');
    console.log('');
    console.log('Current settings:');
    console.log('SMTP Host: smtp-relay.brevo.com');
    console.log('SMTP Port: 587');
    console.log('SMTP User: richard123tandean@gmail.com');
    console.log('');
    console.log('Please get your SMTP key from:');
    console.log('https://app.brevo.com → Settings → SMTP & API → SMTP');
    console.log('');
    
    const smtpKey = await askQuestion('Enter your NEW Brevo SMTP key: ');

    // Read current .env file
    let envContent = fs.readFileSync('.env', 'utf8');
    
    // Update SMTP_PASS
    envContent = envContent.replace(
      /SMTP_PASS=".*"/,
      `SMTP_PASS="${smtpKey}"`
    );

    // Write updated .env file
    fs.writeFileSync('.env', envContent);
    
    console.log('');
    console.log('✅ .env file updated successfully!');
    console.log('');
    console.log('🧪 Test your email now:');
    console.log('npm run test:email your-email@example.com');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

updateEmail();
