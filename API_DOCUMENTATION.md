# 📚 Richard Backend API Documentation

## 🚀 Base URL
```
http://localhost:3000
```

## 🔐 Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## 📋 API Endpoints

### 🔓 Public Endpoints

#### 1. Health Check
```http
GET /health
```
**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### 2. Register User
```http
POST /api/auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // or "admin"
}
```
**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
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

#### 3. Login
```http
POST /api/auth/login
```
**Body:**
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
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
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

#### 4. Forgot Password
```http
POST /api/auth/forgot
```
**Body:**
```json
{
  "email": "john@example.com"
}
```
**Response:**
```json
{
  "success": true,
  "message": "If the email exists, a password reset link has been sent"
}
```

#### 5. Reset Password
```http
POST /api/auth/reset
```
**Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "newpassword123"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

#### 6. Refresh Token
```http
POST /api/auth/refresh
```
**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 🔒 Protected Endpoints (Require Authentication)

#### 7. Logout
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```
**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### 8. Get Current User
```http
GET /api/users/me
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
    "avatarUrl": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 9. Update Profile
```http
PUT /api/users/me
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```
**Body:**
```
name: "Updated Name"
avatar: <file> (optional)
```
**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user_id",
    "name": "Updated Name",
    "email": "john@example.com",
    "role": "user",
    "avatarUrl": "/uploads/avatar-1234567890.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 👑 Admin-Only Endpoints (Require Admin Role)

#### 10. Get All Users
```http
GET /api/users?q=search&page=1&limit=10
Authorization: Bearer <admin_access_token>
```
**Query Parameters:**
- `q` (optional): Search term for name or email
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

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
      "avatarUrl": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

#### 11. Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <admin_access_token>
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
    "avatarUrl": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 12. Cleanup Expired Tokens
```http
POST /api/admin/cleanup
Authorization: Bearer <admin_access_token>
```
**Response:**
```json
{
  "success": true,
  "message": "Cleanup completed successfully"
}
```

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## 🧪 Testing

### Run API Tests
```bash
# Start the server
npm run dev

# In another terminal, run tests
npm run test:api
```

### Manual Testing with cURL

#### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "user"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Get Current User
```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Get All Users (Admin)
```bash
curl -X GET "http://localhost:3000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/richard_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# Server
PORT=3000
NODE_ENV="development"

# Email
SMTP_HOST="smtp-relay.brevo.com"
SMTP_PORT="587"
SMTP_USER="your_email@example.com"
SMTP_PASS="your_smtp_key"
FROM_EMAIL="noreply@yourdomain.com"
FRONTEND_URL="http://localhost:3000"
```

## 📊 Rate Limiting

- **Auth endpoints**: 5 requests per 15 minutes per IP
- **General endpoints**: 100 requests per 15 minutes per IP

## 🛡️ Security Features

- JWT access tokens (15 minutes expiry)
- JWT refresh tokens (7 days expiry)
- Password hashing with bcrypt (12 rounds)
- Role-based access control
- Rate limiting
- CORS protection
- Input validation with Zod
- File upload validation
- Automatic token cleanup
