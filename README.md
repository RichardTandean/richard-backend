# Richard Backend API

A robust, scalable backend API built with Node.js, Express, TypeScript, and Prisma. This API provides authentication, user management, and admin functionality for the Richard Astronacci Flutter application.

## 🚀 Features

- **Authentication System** - JWT-based auth with refresh tokens
- **User Management** - CRUD operations with role-based access control
- **Admin Panel** - Admin-only user creation and management
- **Email Service** - Brevo API integration for transactional emails
- **Rate Limiting** - Configurable rate limits for API protection
- **Image Handling** - Base64 image storage for user avatars
- **Password Reset** - Secure password reset with email verification
- **Deep Linking** - Support for mobile app deep links
- **Database Migrations** - Prisma-based database management
- **CORS Support** - Cross-origin resource sharing for mobile apps

## 🛠️ Tech Stack

### Core Technologies
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Database ORM and migrations

### Database
- **PostgreSQL** - Primary database (Neon)
- **Prisma Client** - Type-safe database access

### Authentication & Security
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-rate-limit** - API rate limiting
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

### Email Service
- **Brevo API** - Transactional email service
- **Nodemailer** - Email sending (fallback)

### Development Tools
- **ts-node-dev** - Development server with hot reload
- **tsc-alias** - TypeScript path alias resolution
- **morgan** - HTTP request logging

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Brevo API key (for email service)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/RichardTandean/richard-backend.git
   cd richard-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@host:port/database"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_REFRESH_SECRET="your-refresh-secret-key"
   JWT_EXPIRES_IN="15m"
   JWT_REFRESH_EXPIRES_IN="7d"
   
   # Email Service (Brevo)
   BREVO_API_KEY="your-brevo-api-key"
   FROM_EMAIL="noreply@yourdomain.com"
   
   # CORS
   CORS_ORIGIN="*"
   
   # Frontend URL
   FRONTEND_URL="richardapp://reset-password"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # (Optional) Generate mock users
   npm run generate:mock-users
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm run build
   npm start
   ```

## 🚀 Deployment

### Railway Deployment

1. **Connect to Railway**
   - Link your GitHub repository
   - Set environment variables in Railway dashboard

2. **Required Environment Variables**
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret
   JWT_REFRESH_SECRET=your-refresh-secret
   BREVO_API_KEY=your-brevo-key
   FROM_EMAIL=noreply@yourdomain.com
   CORS_ORIGIN=*
   FRONTEND_URL=richardapp://reset-password
   ```

3. **Deploy**
   - Railway automatically builds and deploys on push to main
   - Uses `start:prod` script for production deployment

## 📚 API Documentation

### Base URL
```
Production: https://richard-backend.up.railway.app
Development: http://localhost:3000
```

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "avatarUrl": null,
      "createdAt": "2025-01-01T00:00:00.000Z"
    },
    "tokens": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token"
    }
  }
}
```

#### POST /api/auth/login
Authenticate user and get tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "avatarUrl": "base64_image_data"
    },
    "tokens": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token"
    }
  }
}
```

#### POST /api/auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "refresh_token"
}
```

#### POST /api/auth/forgot-password
Send password reset email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

#### POST /api/auth/reset-password
Reset password using reset token.

**Request Body:**
```json
{
  "token": "reset_token",
  "password": "new_password123"
}
```

### User Management Endpoints

#### GET /api/users/me
Get current user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatarUrl": "base64_image_data",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/users/me
Update current user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "avatarBase64": "data:image/jpeg;base64,..."
}
```

#### GET /api/users
Get paginated list of users (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 8)
- `q` (string): Search query
- `role` (string): Filter by role (admin/user)
- `sortBy` (string): Sort field (default: createdAt)
- `sortOrder` (string): Sort direction (asc/desc, default: desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "avatarUrl": "base64_image_data",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 8,
    "total": 25,
    "totalPages": 4,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### POST /api/users
Create new user (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "user",
  "avatarBase64": "data:image/jpeg;base64,..."
}
```

#### GET /api/users/:id
Get user by ID (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

### Health Check

#### GET /health
Check API health status.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

## 🔒 Security Features

### Rate Limiting
- **Login**: 20 attempts per minute
- **Registration**: 10 attempts per 3 minutes
- **Password Reset**: 10 attempts per 2 minutes
- **Auth Operations**: 100 requests per 15 minutes
- **General Requests**: 1000 requests per 15 minutes

### Authentication
- JWT access tokens (15 minutes expiry)
- Refresh tokens (7 days expiry)
- Secure password hashing with bcryptjs
- Role-based access control (Admin/User)

### Security Headers
- Helmet.js for security headers
- CORS configuration
- Trust proxy for Railway deployment

## 📊 Database Schema

### User Model
```prisma
model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String
  role         String   @default("user")
  avatarUrl    String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  resetTokens  PasswordResetToken[]
}
```

### PasswordResetToken Model
```prisma
model PasswordResetToken {
  id        String   @id @default(cuid())
  token     String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())
}
```

## 🛠️ Development

### Available Scripts
```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run start:prod       # Start with database migrations

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations
npm run db:migrate:deploy # Deploy migrations (production)
npm run db:studio        # Open Prisma Studio

# Utilities
npm run generate:mock-users # Generate 30 mock users
npm run test:api         # Test API endpoints
```

### Project Structure
```
src/
├── controllers/         # Route controllers
├── middleware/          # Custom middleware
├── models/             # Prisma models
├── routes/             # API routes
├── services/           # Business logic
├── utils/              # Utility functions
├── app.ts              # Express app configuration
└── server.ts           # Server entry point
```

## 🚀 Performance

### Optimizations
- Database connection pooling
- Efficient pagination with caching
- Image compression for avatars
- Rate limiting to prevent abuse
- CORS optimization for mobile apps

### Monitoring
- Morgan HTTP logging
- Error tracking and handling
- Health check endpoint
- Railway deployment monitoring

## 📱 Mobile App Integration

### Deep Linking
- Password reset links: `richardapp://reset-password?token=...`
- Configured in Android and iOS apps

### CORS Configuration
- Configured for mobile app access
- Supports both development and production URLs

### Image Handling
- Base64 image storage for avatars
- Automatic image compression
- Fallback to user initials

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection**
   - Check DATABASE_URL in .env
   - Ensure database is accessible
   - Run migrations: `npm run db:migrate`

2. **Email Service**
   - Verify BREVO_API_KEY is correct
   - Check FROM_EMAIL is valid
   - Test with: `npm run test:email`

3. **Rate Limiting**
   - Check rate limit headers in response
   - Adjust limits in rateLimiter.ts if needed

4. **CORS Issues**
   - Verify CORS_ORIGIN setting
   - Check mobile app URL configuration

### Debug Commands
```bash
# Test database connection
npm run db:studio

# Test email service
npm run test:email

# Test API endpoints
npm run test:api

# Check logs
npm run dev  # Development logs
```

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ for the Richard Astronacci project**