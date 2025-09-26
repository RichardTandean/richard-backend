# 🚀 Quick Free Email Setup (5 minutes)

## Step 1: Create Free Brevo Account

1. **Go to**: https://www.brevo.com
2. **Click**: "Sign up free" 
3. **Verify** your email address
4. **Login** to your account

## Step 2: Get SMTP Credentials

1. **Go to**: SMTP & API → SMTP
2. **Copy** your SMTP credentials:
   - Server: `smtp-relay.brevo.com`
   - Port: `587`
   - Login: `your_email@example.com`
   - Password: `your_smtp_key`

## Step 3: Run Setup Script

```bash
npm run setup:email
```

Follow the prompts to enter your credentials.

## Step 4: Test Email

```bash
npm run test:email your-email@example.com
```

Check your email inbox!

## Step 5: Start Server

```bash
npm run dev
```

## 🎉 You're Done!

**Free Tier Limits:**
- ✅ 300 emails per day
- ✅ No credit card required
- ✅ Perfect for testing
- ✅ Professional email templates

## 🔧 Manual Setup (Alternative)

If you prefer manual setup, create a `.env` file:

```env
# Email (Free Brevo Setup)
SMTP_HOST="smtp-relay.brevo.com"
SMTP_PORT="587"
SMTP_USER="your_brevo_email@example.com"
SMTP_PASS="your_brevo_smtp_key"
FROM_EMAIL="noreply@yourdomain.com"
FRONTEND_URL="http://localhost:3000"
```

## 🧪 Test Your Setup

1. **Start server**: `npm run dev`
2. **Test forgot password**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/forgot \
     -H "Content-Type: application/json" \
     -d '{"email": "your-email@example.com"}'
   ```
3. **Check your email** for the reset link!

## 🆘 Troubleshooting

**Email not received?**
- Check spam folder
- Verify SMTP credentials
- Check Brevo dashboard for delivery status

**Setup issues?**
- Make sure `.env` file is in the root directory
- Verify all environment variables are set
- Check console for error messages

## 📞 Need Help?

- **Brevo Support**: https://help.brevo.com
- **Documentation**: `docs/EMAIL_SETUP.md`
- **Test Script**: `npm run test:email`
