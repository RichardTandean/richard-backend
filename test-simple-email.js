const axios = require('axios');
require('dotenv').config();

async function testSimpleEmail() {
  const apiKey = process.env.BREVO_API_KEY;
  const apiUrl = process.env.BREVO_API_URL;

  const emailData = {
    sender: {
      email: '97ecea001@smtp-brevo.com',
      name: 'Richard App',
    },
    to: [
      {
        email: 'richard123tandean@yahoo.com',
        name: 'Richard',
      },
    ],
    subject: 'Simple Test Email',
    htmlContent: '<h1>Test Email</h1><p>This is a simple test email.</p>',
    textContent: 'Test Email\n\nThis is a simple test email.',
  };

  try {
    console.log('🚀 Sending simple test email...');
    
    const response = await axios.post(apiUrl, emailData, {
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
    });

    console.log('✅ Simple email sent!');
    console.log('📧 Message ID:', response.data.messageId);
    console.log('⏰ Sent at:', new Date().toLocaleString());
    console.log('📬 Check your inbox, spam, and promotions folders');
    
  } catch (error) {
    if (error.response) {
      console.error('❌ Error:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('❌ Network Error:', error.message);
    }
  }
}

testSimpleEmail();
