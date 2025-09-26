# Email Setup Guide for Production

This guide shows how to configure different SMTP providers for the Richard Backend API.

## 🚀 Quick Setup (Recommended: SendGrid)

### 1. Create SendGrid Account
1. Go to [SendGrid.com](https://sendgrid.com)
2. Sign up for free account
3. Verify your email
4. Go to Settings → API Keys
5. Create API Key with "Full Access" permissions

### 2. Configure Environment Variables
```env
# SendGrid Configuration
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your_sendgrid_api_key_here"
FROM_EMAIL="noreply@yourdomain.com"
FRONTEND_URL="https://yourdomain.com"
```

### 3. Domain Authentication (Optional but Recommended)
1. Go to Settings → Sender Authentication
2. Add your domain
3. Add DNS records to your domain
4. Verify domain

---

## 📧 Alternative Providers

### Amazon SES Setup

#### 1. Create AWS Account
1. Go to [AWS Console](https://console.aws.amazon.com)
2. Navigate to SES (Simple Email Service)
3. Verify your email address
4. Request production access if needed

#### 2. Create SMTP Credentials
1. Go to SES → SMTP Settings
2. Create SMTP credentials
3. Note down the username and password

#### 3. Environment Variables
```env
# Amazon SES Configuration
SMTP_HOST="email-smtp.us-east-1.amazonaws.com"
SMTP_PORT="587"
SMTP_USER="your_ses_smtp_username"
SMTP_PASS="your_ses_smtp_password"
FROM_EMAIL="noreply@yourdomain.com"
FRONTEND_URL="https://yourdomain.com"
```

### Mailgun Setup

#### 1. Create Mailgun Account
1. Go to [Mailgun.com](https://mailgun.com)
2. Sign up for free account
3. Verify your email
4. Go to Domains → Add Domain

#### 2. Get SMTP Credentials
1. Go to Domains → Your Domain → SMTP
2. Note down the SMTP credentials

#### 3. Environment Variables
```env
# Mailgun Configuration
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_USER="postmaster@yourdomain.mailgun.org"
SMTP_PASS="your_mailgun_password"
FROM_EMAIL="noreply@yourdomain.com"
FRONTEND_URL="https://yourdomain.com"
```

### Brevo (Sendinblue) Setup

#### 1. Create Brevo Account
1. Go to [Brevo.com](https://brevo.com)
2. Sign up for free account
3. Verify your email
4. Go to SMTP & API → SMTP

#### 2. Get SMTP Credentials
1. Note down the SMTP server details
2. Use your login credentials

#### 3. Environment Variables
```env
# Brevo Configuration
SMTP_HOST="smtp-relay.brevo.com"
SMTP_PORT="587"
SMTP_USER="your_brevo_email"
SMTP_PASS="your_brevo_smtp_key"
FROM_EMAIL="noreply@yourdomain.com"
FRONTEND_URL="https://yourdomain.com"
```

---

## 🔧 Testing Your Email Setup

### 1. Test with Development Server
```bash
# Start the development server
npm run dev

# Test forgot password endpoint
curl -X POST http://localhost:3000/api/auth/forgot \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### 2. Check Email Delivery
- Check your email inbox
- For SendGrid: Check Activity Feed
- For SES: Check Sending Statistics
- For Mailgun: Check Logs
- For Brevo: Check Email Logs

### 3. Monitor Email Health
- Check bounce rates
- Monitor spam complaints
- Track delivery rates
- Set up alerts for failures

---

## 🛡️ Security Best Practices

### 1. Environment Variables
- Never commit `.env` files to version control
- Use different credentials for development/production
- Rotate API keys regularly

### 2. Domain Authentication
- Always authenticate your sending domain
- Use SPF, DKIM, and DMARC records
- Monitor your domain reputation

### 3. Rate Limiting
- Implement rate limiting on email endpoints
- Monitor for abuse
- Set up alerts for unusual activity

---

## 📊 Provider Comparison

| Provider | Free Tier | Paid Starting | Best For | Deliverability |
|----------|-----------|---------------|----------|----------------|
| SendGrid | 100/day | $19.95/month | Most apps | ⭐⭐⭐⭐⭐ |
| Amazon SES | 3,000/month | $0.10/1K | High volume | ⭐⭐⭐⭐ |
| Mailgun | 5,000/month | $35/month | Developers | ⭐⭐⭐⭐ |
| Brevo | 300/day | $25/month | Small projects | ⭐⭐⭐⭐ |

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Authentication Failed
- Check SMTP credentials
- Verify API key permissions
- Ensure account is not suspended

#### 2. Emails Not Delivered
- Check spam folder
- Verify domain authentication
- Check bounce rates
- Review email content

#### 3. Rate Limiting
- Check provider limits
- Implement proper rate limiting
- Monitor usage patterns

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV="development"
```

This will show detailed SMTP logs in the console.

---

## 📞 Support

- **SendGrid**: [Support Center](https://support.sendgrid.com)
- **Amazon SES**: [AWS Support](https://aws.amazon.com/support)
- **Mailgun**: [Support](https://help.mailgun.com)
- **Brevo**: [Support Center](https://help.brevo.com)
