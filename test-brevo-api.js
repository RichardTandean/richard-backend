const axios = require('axios');
require('dotenv').config();

async function testBrevoAPI() {
  const apiKey = process.env.BREVO_API_KEY;
  const apiUrl = process.env.BREVO_API_URL;
  const fromEmail = process.env.FROM_EMAIL;
  const fromName = process.env.FROM_NAME;

  if (!apiKey || apiKey === 'YOUR_API_KEY') {
    console.error('❌ Please set BREVO_API_KEY in your .env file');
    console.log('Get your API key from: https://app.brevo.com/settings/keys/api');
    return;
  }

  const emailData = {
    sender: {
      email: fromEmail,
      name: fromName,
    },
    to: [
      {
        email: 'richard244tandean@gmail.com', // Your email
        name: 'Richard Tandean',
      },
    ],
    subject: '🚀 Test Email from Brevo API',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Brevo API Test</h1>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #333;">Hello Richard!</h2>
          
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            This is a test email sent using the <strong>Brevo API</strong> instead of SMTP!
          </p>
          
          <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #155724; margin: 0;">
              ✅ <strong>Success!</strong> Your Brevo API integration is working perfectly!
            </p>
          </div>
          
          <h3 style="color: #333;">Benefits of using Brevo API:</h3>
          <ul style="color: #666; line-height: 1.8;">
            <li>🚀 Faster delivery</li>
            <li>📊 Better tracking and analytics</li>
            <li>🎯 More reliable than SMTP</li>
            <li>📈 Higher deliverability rates</li>
            <li>🔧 Easier to manage</li>
          </ul>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          This is a test email from Richard App backend.
        </p>
      </div>
    `,
    textContent: `
Brevo API Test

Hello Richard!

This is a test email sent using the Brevo API instead of SMTP!

✅ Success! Your Brevo API integration is working perfectly!

Benefits of using Brevo API:
🚀 Faster delivery
📊 Better tracking and analytics
🎯 More reliable than SMTP
📈 Higher deliverability rates
🔧 Easier to manage

---
This is a test email from Richard App backend.
    `,
    tags: ['test', 'brevo-api'],
  };

  try {
    console.log('🚀 Sending test email via Brevo API...');
    
    const response = await axios.post(apiUrl, emailData, {
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
    });

    console.log('✅ Email sent successfully via Brevo API!');
    console.log('📧 Message ID:', response.data.messageId);
    console.log('🎯 Check your email inbox!');
    
  } catch (error) {
    if (error.response) {
      console.error('❌ Brevo API Error:');
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('❌ Network Error:', error.message);
    }
  }
}

testBrevoAPI();
