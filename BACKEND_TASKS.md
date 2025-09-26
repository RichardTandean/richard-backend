# Richard Backend — Task Plan (Express + TypeScript)

## Overview
- **Framework**: Express.js (TypeScript)
- **Auth**: JWT Access + Refresh tokens
- **Password Reset**: Token email link (simplified: return token in response for demo or console)
- **Storage**: PostgreSQL (via Prisma) or SQLite for quick demo (choose env-driven)
- **Uploads**: Multer for avatar upload; optional Sharp for crop/resize
- **Security**: Helmet, CORS, rate limiting, validation (Zod)

## Entities
- User: { id, name, email, passwordHash, role, avatarUrl, createdAt, updatedAt }
- PasswordResetToken: { id, userId, token, expiresAt, usedAt }

## Roles
- `admin`: Can access user list, user details, manage other admins
- `user`: Can only access own profile, edit own profile

## Endpoints
- POST `/auth/register` { name, email, password, role } -> { accessToken, refreshToken, user }
- POST `/auth/login` { email, password } -> { accessToken, refreshToken, user }
- POST `/auth/refresh` { refreshToken }
- POST `/auth/forgot` { email } -> send reset token (demo: return token)
- POST `/auth/reset` { token, newPassword }
- POST `/auth/logout` (invalidate refresh token)
- GET `/me` (auth) -> current user
- PUT `/me` (auth, multipart) -> update name, avatar
- GET `/users` (auth: admin only, query: `q`, `page`, `limit`)
- GET `/users/:id` (auth: admin only)

## Data Model (Prisma suggestion)
```
model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String
  role         String   @default("user") // "admin" or "user"
  avatarUrl    String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  resetTokens  PasswordResetToken[]
}

model PasswordResetToken {
  id        String   @id @default(cuid())
  token     String   @unique
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())
}
```

## Tech Stack
- express, cors, helmet, morgan
- zod (validation)
- bcryptjs (hash)
- jsonwebtoken
- multer (uploads), sharp (optional)
- prisma, @prisma/client (DB)
- ts-node-dev / nodemon + tsconfig-paths
- pino or morgan for logging
- dotenv
- postgresSQL

## Task Breakdown

### 1) Scaffolding
- Initialize TypeScript Express project
- Setup ESLint + Prettier
- tsconfig paths, scripts for dev/build
- Setup Prisma with SQLite (simple) or Postgres (env)

### 2) Auth
- Register: input validation, hash password, unique email, role validation
- Login: verify password, issue access + refresh tokens with role
- Refresh: issue new access token with role
- Logout: blacklist/rotate refresh tokens (simple: store refresh token in DB)
- Role middleware: check JWT token for admin role on protected routes

### 3) Password Reset
- Forgot: create reset token, store with expiry, email sending (mock)
- Reset: verify token and expiry, mark used, set new password

### 4) User APIs
- `GET /me`: return current user
- `PUT /me`: multipart (name, avatar), upload using Multer, save file path; optional crop server-side with Sharp
- `GET /users`: pagination, search by name or email (admin only)
- `GET /users/:id`: by id (admin only)

### 5) Middleware & Utils
- Auth middleware for bearer JWT
- Admin role middleware for protected routes
- Error handler with ZodError mapping
- Multer storage engine, static files for avatars
- Rate limit on auth routes

### 6) Acceptance Criteria
- All endpoints align with contracts and return proper status codes
- Passwords never returned; errors are safe and informative
- Role-based access: admin-only routes properly protected
- Pagination returns meta: page, limit, total, hasNext
- Avatar upload works and files are accessible
- CORS configured; security headers present

### 7) Milestones
- M1: Project scaffold + Prisma models + register/login
- M2: Password reset + refresh/logout
- M3: User endpoints + avatar upload + pagination
- M4: Hardening, logging, docs
