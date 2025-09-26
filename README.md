# Richard Backend API

Express TypeScript backend with Prisma, JWT authentication, and role-based access control.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   - Copy `env.example` to `.env`
   - Update database URL and JWT secrets

3. **Database Setup:**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database (for development)
   npm run db:push
   
   # Or run migrations (for production)
   npm run db:migrate
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/richard_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"
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
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot` - Forgot password
- `POST /api/auth/reset` - Reset password
- `POST /api/auth/logout` - Logout user

### Profile
- `GET /api/me` - Get current user
- `PUT /api/me` - Update profile

### Users (Admin Only)
- `GET /api/users` - List users with pagination
- `GET /api/users/:id` - Get user by ID

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
