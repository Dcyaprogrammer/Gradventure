# Gradventure Backend Implementation Technical Specification

**Date**: 2026-03-29
**Project**: Gradventure - Gamified Study Abroad Preparation Platform
**Focus**: Backend Database Setup & User Authentication System

---

## 1. PostgreSQL Database Configuration & Initialization

### 1.1 Database Installation & Setup

**Requirements:**
- Install PostgreSQL 16.x on macOS development environment
- Configure database instance to run on non-conflicting port (5433) to avoid conflicts with system PostgreSQL
- Set up authentication method to `trust` for local development
- Initialize database cluster with UTF-8 encoding

**Implementation Approach:**
- Use Homebrew package manager for PostgreSQL installation
- Modify `postgresql.conf` to set custom port
- Configure `pg_hba.conf` for local trust-based authentication
- Create dedicated database `gradventure` for the application

**Technical Details:**
```bash
# Installation
brew install postgresql@16

# Port Configuration
# Edit /opt/homebrew/var/postgresql@16/postgresql.conf
port = 5433

# Service Management
brew services start|stop|restart postgresql@16
```

### 1.2 Database Schema Design

**Core Tables Structure:**

**Users Table**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**User Progress Table**
```sql
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1,
  experience_points INTEGER DEFAULT 0,
  completed_lessons INTEGER[] DEFAULT '{}',
  badges TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Lessons Table**
```sql
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  difficulty INTEGER DEFAULT 1,
  content JSONB,
  experience_reward INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Questions Table**
```sql
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT
);
```

**Requirements:**
- Use PostgreSQL's `jsonb` for flexible content storage
- Implement foreign key constraints with CASCADE delete
- Use array types for `completed_lessons` and `badges`
- Set appropriate defaults for gamification elements (level, XP)
- Include automatic timestamp management

### 1.3 Database Connection Layer

**Technology Stack:**
- Runtime: Bun
- Database Client: `postgres` (npm package)
- Connection Pooling: Singleton pattern

**Implementation Requirements:**
```typescript
// src/db/db.ts
export const DB_CONFIG = {
  host: 'localhost',
  port: 5433,
  database: 'gradventure',
  user: process.env.DB_USER || 'dopamine',
};

// Connection singleton with query helper
export async function query<T>(sql: string, params?: any[]): Promise<T>
```

**Features:**
- Lazy connection initialization
- Type-safe query interface
- Automatic error handling and logging
- Schema initialization with idempotent table creation

---

## 2. User Authentication System Implementation

### 2.1 XJTLU Email Domain Validation

**Business Requirements:**
- Restrict registration to XJTLU community members only
- Accept two email domains:
  - `@student.xjtlu.edu.cn` (student accounts)
  - `@xjtlu.edu.cn` (faculty/staff accounts)
- Automatically extract student ID from student email addresses

**Technical Implementation:**

```typescript
// Email Validation Logic
const XJTLU_EMAIL_DOMAINS = [
  'student.xjtlu.edu.cn',
  'xjtlu.edu.cn'
];

function isValidXJTLUEmail(email: string): boolean {
  const domain = email.split('@')[1];
  return XJTLU_EMAIL_DOMAINS.includes(domain);
}

function extractStudentId(email: string): string | null {
  if (!email.endsWith('@student.xjtlu.edu.cn')) return null;
  return email.split('@')[0];
}
```

**Validation Rules:**
- Strict domain whitelist enforcement
- Case-sensitive domain matching
- Format validation using regex
- Automatic student ID extraction for gamification

### 2.2 Password Security Implementation

**Password Requirements:**
- Minimum length: 8 characters
- Must contain at least one uppercase letter (A-Z)
- Must contain at least one lowercase letter (a-z)
- Must contain at least one number (0-9)

**Implementation:**
```typescript
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
```

**Security Best Practices:**
- Use bcrypt with salt rounds = 10
- Never store plain text passwords
- Implement constant-time comparison for password verification
- Hash password before database storage

### 2.3 JWT Token Authentication

**Token Configuration:**
- Algorithm: HS256
- Secret: Environment variable (fallback to development default)
- Expiration: 7 days
- Token payload includes: `userId`, `email`, `username`

**Implementation Details:**
```typescript
export function generateToken(payload: {
  userId: number;
  email: string;
  username: string;
}): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
```

**Token Management:**
- Store token in `localStorage` on client
- Send token in `Authorization: Bearer <token>` header
- Implement automatic token refresh mechanism
- Handle token expiration gracefully

### 2.4 Authentication API Endpoints

**POST /api/auth/register**
- **Purpose**: Register new user account
- **Validation**:
  - Username: 3-20 characters, alphanumeric + underscore/hyphen
  - Email: Must be valid XJTLU domain
  - Password: Meet strength requirements
- **Business Logic**:
  - Check for existing email/username
  - Hash password before storage
  - Extract student ID if applicable
  - Create user progress record
  - Generate JWT token
- **Response** (201):
  ```json
  {
    "success": true,
    "data": {
      "user": { id, username, email, studentId?, createdAt },
      "token": "jwt_token_string"
    }
  }
  ```

**POST /api/auth/login**
- **Purpose**: Authenticate existing user
- **Validation**: Email and password required
- **Business Logic**:
  - Fetch user by email
  - Verify password hash
  - Generate JWT token
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "user": { id, username, email, studentId? },
      "token": "jwt_token_string"
    }
  }
  ```

**GET /api/auth/me** (Protected)
- **Purpose**: Get current authenticated user
- **Authentication**: Requires valid JWT token
- **Business Logic**:
  - Verify token from Authorization header
  - Fetch user data
  - Fetch user progress
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "user": { id, username, email, studentId?, createdAt },
      "progress": { level, experience_points, completed_lessons[], badges[] }
    }
  }
  ```

**PUT /api/auth/password** (Protected)
- **Purpose**: Change user password
- **Authentication**: Requires valid JWT token
- **Validation**:
  - Current password must match
  - New password must meet strength requirements
- **Response** (200):
  ```json
  {
    "success": true,
    "message": "Password changed successfully"
  }
  ```

### 2.5 Authentication Middleware

**Implementation Requirements:**
- Extract token from `Authorization` header
- Verify token validity and expiration
- Check user existence in database
- Attach user information to request object
- Return appropriate error responses (401/403)

**Error Handling:**
- 401 Unauthorized: Invalid or missing token
- 403 Forbidden: Insufficient permissions
- 404 Not Found: User not found

### 2.6 Environment Configuration

**Environment Variables:**
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5433
DB_NAME=gradventure
DB_USER=dopamine
DB_PASSWORD=

# JWT Secret (MUST change in production)
JWT_SECRET=gradventure-secret-key-change-in-production-min-32-chars

# Server Configuration
PORT=3000
NODE_ENV=development
```

**Security Considerations:**
- Never commit `.env` file with real secrets
- Use strong, random JWT secret in production (32+ characters)
- Rotate JWT secret periodically
- Use different database credentials for production

---

## 3. API Server Architecture

### 3.1 Server Configuration

**Technology Stack:**
- Runtime: Bun with native HTTP server
- CORS: Enabled for all origins (development)
- Hot Module Replacement: Enabled for development
- Port: 3000

**Implementation:**
```typescript
Bun.serve({
  port: 3000,
  async fetch(req) {
    // Route handling
    // Authentication middleware
    // CORS headers
    // Error handling
  },
  development: {
    hmr: true,
  },
});
```

### 3.2 Route Organization

**Route Structure:**
```
/api/auth/*          - Authentication endpoints
/api/lessons/*       - Learning content
/api/users/:id/*     - User-specific data
/health              - Health check endpoint
/                    - API documentation
```

**Middleware Pipeline:**
1. CORS headers injection
2. OPTIONS preflight handling
3. Token verification (for protected routes)
4. Request validation
5. Response formatting

### 3.3 Error Handling Strategy

**Standardized Error Response Format:**
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description (optional)"
}
```

**HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 409: Conflict (duplicate resource)
- 500: Internal Server Error

---

## 4. Testing & Validation

### 4.1 Database Testing

**Verification Commands:**
```bash
# Check table creation
psql -p 5433 -d gradventure -c "\dt"

# Verify schema
psql -p 5433 -d gradventure -c "\d users"

# Test data
psql -p 5433 -d gradventure -c "SELECT * FROM lessons;"
```

### 4.2 API Endpoint Testing

**Registration Test:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "teststudent",
    "email": "test001@student.xjtlu.edu.cn",
    "password": "Password123"
  }'
```

**Expected Validation Tests:**
- Non-XJTLU email rejection
- Weak password rejection
- Duplicate email rejection
- Successful registration with token generation

**Login Test:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test001@student.xjtlu.edu.cn",
    "password": "Password123"
  }'
```

**Protected Route Test:**
```bash
# Without token (should fail)
curl http://localhost:3000/api/auth/me

# With token (should succeed)
TOKEN=<jwt_token>
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 4.3 Security Testing

**Test Scenarios:**
1. SQL injection prevention
2. XSS protection through input validation
3. Password strength enforcement
4. Token expiration handling
5. Rate limiting preparation (future)

---

## 5. Documentation Requirements

**Required Documentation:**
1. **Database Schema** (`src/db/README.md`)
   - Table structures
   - Relationships
   - Query examples
   - Platform-specific setup instructions

2. **Authentication Guide** (`AUTH_SETUP.md`)
   - Quick start guide
   - API endpoint documentation
   - Security best practices
   - Troubleshooting section

3. **API Documentation** (`src/auth/README.md`)
   - Detailed endpoint specifications
   - Request/response examples
   - Error codes
   - Frontend integration examples

4. **Environment Setup** (`.env.example`)
   - Required environment variables
   - Default values
   - Security notes

---

## 6. Technology Stack Summary

**Backend:**
- Runtime: Bun
- Database: PostgreSQL 16
- Password Hashing: bcryptjs (salt rounds: 10)
- JWT: jsonwebtoken
- HTTP Client: postgres npm package

**Development Tools:**
- Package Manager: Bun
- Version Control: Git
- Platform: macOS (with Homebrew)

**Security Measures:**
- Input validation on all endpoints
- Password strength requirements
- Bcrypt password hashing
- JWT token authentication
- XJTLU email domain whitelist
- CORS configuration
- SQL injection prevention (parameterized queries)

---

## 7. Deliverables

**Code Artifacts:**
- [x] Database initialization script (`src/db/init.ts`)
- [x] Database connection module (`src/db/db.ts`)
- [x] Authentication utilities (`src/utils/auth.ts`)
- [x] Authentication middleware (`src/middleware/auth.ts`)
- [x] Authentication API routes (`src/api/auth.ts`)
- [x] Main server file (`src/server.ts`)
- [x] Environment configuration (`.env.example`)

**Documentation:**
- [x] Database setup guide (`src/db/README.md`)
- [x] Authentication system guide (`AUTH_SETUP.md`)
- [x] API documentation (`src/auth/README.md`)
- [x] Project README updates (`README.md`)

**Testing & Validation:**
- [x] Database initialization successful
- [x] API server starts correctly
- [x] User registration works with XJTLU email validation
- [x] User login generates valid JWT token
- [x] Protected routes require authentication
- [x] Password validation enforces strength requirements
- [x] Student ID extraction from email works correctly

---

## 8. Future Enhancements

**Recommended Next Steps:**
1. Implement password reset functionality with email verification
2. Add rate limiting for login attempts
3. Implement refresh token mechanism
4. Add email verification for registration
5. Create user roles (admin, student, faculty)
6. Add two-factor authentication
7. Implement audit logging
8. Add API request logging and monitoring

**Performance Optimizations:**
1. Add database connection pooling
2. Implement Redis caching for frequent queries
3. Add database indexes for performance
4. Implement pagination for list endpoints
5. Add request rate limiting middleware

---

**Status**: ✅ Complete
**All core authentication and database features implemented and tested.**
