# Richard Backend API

A robust, scalable Express.js backend API built with TypeScript, featuring JWT authentication, role-based access control, email services, rate limiting, and comprehensive user management.

## 🚀 Tech Stack

### **Core Technologies**
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 15+
- **ORM**: Prisma 5.x
- **Authentication**: JWT (JSON Web Tokens)

### **Key Libraries & Dependencies**

#### **Core Framework**
```json
{
  "express": "^4.18.2",
  "typescript": "^5.2.2",
  "@types/express": "^4.17.17",
  "@types/node": "^20.6.0"
}
```

#### **Database & ORM**
```json
{
  "prisma": "^5.4.2",
  "@prisma/client": "^5.4.2",
  "pg": "^8.11.3",
  "@types/pg": "^8.10.2"
}
```

#### **Authentication & Security**
```json
{
  "jsonwebtoken": "^9.0.2",
  "@types/jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "@types/bcryptjs": "^2.4.2",
  "express-rate-limit": "^6.10.0"
}
```

#### **Email Services**
```json
{
  "axios": "^1.5.0",
  "nodemailer": "^6.9.4",
  "@types/nodemailer": "^6.4.9"
}
```

#### **Validation & Middleware**
```json
{
  "joi": "^17.9.2",
  "cors": "^2.8.5",
  "@types/cors": "^2.8.13",
  "helmet": "^7.0.0",
  "morgan": "^1.10.0",
  "@types/morgan": "^1.9.4"
}
```

#### **Development Tools**
```json
{
  "nodemon": "^3.0.1",
  "ts-node": "^10.9.1",
  "concurrently": "^8.2.0",
  "dotenv": "^16.3.1"
}
```

## 📋 Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Role-Based Access Control** - Admin and User roles
- ✅ **Email Services** - Brevo API integration for transactional emails
- ✅ **Rate Limiting** - Configurable rate limits for different endpoints
- ✅ **User Management** - Complete CRUD operations with pagination
- ✅ **Profile Management** - Update profile with base64 image storage
- ✅ **Password Reset** - Secure password reset with email verification
- ✅ **Deep Link Support** - Flutter app integration
- ✅ **Input Validation** - Comprehensive request validation
- ✅ **Error Handling** - Centralized error handling
- ✅ **Security Headers** - Helmet.js security middleware
- ✅ **Request Logging** - Morgan HTTP request logger

## 🛠️ Setup & Installation

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL 15+
- npm or yarn

### **1. Clone & Install**
   ```bash
git clone https://github.com/RichardTandean/richard-backend.git
cd richard-backend
   npm install
   ```

### **2. Environment Configuration**
```bash
# Copy environment template
cp env.example .env

# Update .env with your configuration
# See Environment Variables section below
```

### **3. Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
# Push schema to database (development)
   npm run db:push
   
# Or run migrations (production)
   npm run db:migrate
   ```

### **4. Start Development Server**
   ```bash
   npm run dev
   ```

Server will start at `http://localhost:3001`

## 🔧 Environment Variables

See `env.example` for complete configuration options. Key variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/richard_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server Configuration
PORT=3001
NODE_ENV="development"

# Email Service (Brevo API)
BREVO_API_KEY="xkeysib-your-actual-api-key-here"
FROM_EMAIL="noreply@yourdomain.com"
FROM_NAME="Richard App"

# CORS Configuration
CORS_ORIGIN="http://localhost:3000,http://192.168.0.154:3000,http://192.168.0.154:3001"

# Rate Limiting
LOGIN_RATE_LIMIT_MAX=5       # 1 login per minute
REGISTER_RATE_LIMIT_MAX=3    # 1 registration per 3 minutes
RESET_RATE_LIMIT_MAX=5       # 1 reset per 2 minutes

# Frontend Integration
FRONTEND_URL="richardapp://reset-password"
```

## 📚 API Documentation

### **Base URL**
```
Development: http://localhost:3001/api
Production: https://your-domain.com/api
```

### **Authentication Endpoints**

#### **1. Register User**
```http
POST /api/auth/register
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!",
  "role": "user"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "cmg2dknev0000rq2r9biklrds",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "avatarUrl": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### **2. Login User**
```http
POST /api/auth/login
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "cmg2dknev0000rq2r9biklrds",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "avatarUrl": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### **3. Refresh Token**
```http
POST /api/auth/refresh
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### **4. Forgot Password**
```http
POST /api/auth/forgot
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "If the email exists, a password reset link has been sent"
}
```

#### **5. Reset Password**
```http
POST /api/auth/reset
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "NewSecurePassword123!",
  "confirmPassword": "NewSecurePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

#### **6. Logout**
```http
POST /api/auth/logout
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### **User Profile Endpoints**

#### **1. Get Current User**
```http
GET /api/users/me
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "cmg2dknev0000rq2r9biklrds",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatarUrl": "iVBORw0KGgoAAAANSUhEUgAAA2AAAANgCAIAAADF8Jzz...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### **2. Update Profile**
```http
PUT /api/users/me
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Body:**
```json
{
  "name": "John Updated Doe",
  "avatarBase64": "iVBORw0KGgoAAAANSUhEUgAAA2AAAANgCAIAAADF8Jzz..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "cmg2dknev0000rq2r9biklrds",
    "name": "John Updated Doe",
    "email": "john@example.com",
    "role": "user",
    "avatarUrl": "iVBORw0KGgoAAAANSUhEUgAAA2AAAANgCAIAAADF8Jzz...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### **Admin User Management Endpoints**

#### **1. Get Users (Paginated)**
```http
GET /api/users?page=1&limit=10&search=john&role=user&sortBy=name&sortOrder=asc
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 50)
- `search` (string): Search by name or email
- `role` (string): Filter by role ("admin" | "user")
- `sortBy` (string): Sort field ("name" | "email" | "createdAt")
- `sortOrder` (string): Sort direction ("asc" | "desc")

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "cmg2dknev0000rq2r9biklrds",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "avatarUrl": "iVBORw0KGgoAAAANSUhEUgAAA2AAAANgCAIAAADF8Jzz...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### **2. Get User by ID**
```http
GET /api/users/:id
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "cmg2dknev0000rq2r9biklrds",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatarUrl": "iVBORw0KGgoAAAANSUhEUgAAA2AAAANgCAIAAADF8Jzz...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 📊 Error Responses

### **Standard Error Format**
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "details": {
    "field": "Specific error details"
  }
}
```

### **Common HTTP Status Codes**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

### **Example Error Responses**

#### **Validation Error (400)**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "VALIDATION_ERROR",
  "details": {
    "email": "Email is required",
    "password": "Password must be at least 8 characters"
  }
}
```

#### **Unauthorized (401)**
```json
{
  "success": false,
  "message": "Authentication required",
  "error": "UNAUTHORIZED"
}
```

#### **Forbidden (403)**
```json
{
  "success": false,
  "message": "Admin access required",
  "error": "FORBIDDEN"
}
```

#### **Rate Limit Exceeded (429)**
```json
{
  "success": false,
  "message": "Too many requests, please try again later",
  "error": "RATE_LIMIT_EXCEEDED",
  "details": {
    "retryAfter": "60 seconds"
  }
}
```

## 🔒 Security Features

### **Authentication & Authorization**
- JWT-based authentication with access and refresh tokens
- Role-based access control (Admin/User)
- Password hashing with bcrypt
- Secure token expiration and refresh

### **Rate Limiting**
- **General API**: 100 requests per 15 minutes
- **Login**: 5 attempts per 15 minutes
- **Registration**: 3 attempts per 15 minutes
- **Password Reset**: 5 attempts per 15 minutes

### **Security Headers**
- Helmet.js for security headers
- CORS configuration
- Input validation with Joi
- SQL injection protection via Prisma

### **Email Security**
- Secure password reset tokens
- Email verification for account creation
- Brevo API for reliable email delivery

## 🚀 Deployment

### **Production Build**
```bash
npm run build
npm start
```

### **Environment Variables for Production**
```env
NODE_ENV="production"
PORT=3001
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
BREVO_API_KEY="your-production-brevo-key"
CORS_ORIGIN="https://your-domain.com"
```

### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start           # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database (development)
npm run db:migrate   # Run database migrations (production)
npm run db:studio    # Open Prisma Studio

# Utilities
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Email: richard244tandean@gmail.com

---

**Built with ❤️ by Richard Tandean**