# ApplicationWeb

**Gradventure** - A gamified study abroad application preparation platform.

Human-Computer Interaction Course Project

## 🎯 About Gradventure

Gradventure is an engaging web application that gamifies the study abroad preparation process for students. By combining educational content with game mechanics, we aim to make learning about international education accessible and fun.

## 📁 Project Structure

```
ApplicationWeb/
├── docs/                 # GitHub Pages - Process Portfolio (Astro Project)
│   ├── src/              # Portfolio source code
│   ├── public/           # Static assets
│   └── astro.config.mjs  # Astro configuration
│
├── src/                  # Main webapp source (to be created)
├── package.json          # Main project dependencies
└── README.md             # This file
```

## 🎯 About This Repo

This repository contains:
1. **Process Portfolio** (`docs/`) - Documenting the iterative design process for HCI course
2. **Web Application** (to be developed) - Your main course project

## 🚀 GitHub Pages Setup

The portfolio is built with Astro and deployed via GitHub Actions:

1. Go to Repository Settings → Pages
2. Source: **GitHub Actions** (was "Deploy from a branch")
3. The `Deploy Astro site to Pages` workflow will automatically build and deploy.

**Live Portfolio**: [https://dcyaprogrammer.github.io/ApplicationWeb/](https://dcyaprogrammer.github.io/ApplicationWeb/)

## 📝 Portfolio Documentation

See [docs/PORTFOLIO_README.md](docs/PORTFOLIO_README.md) for detailed portfolio documentation.

## 🛠 Tech Stack

### Backend
- **Runtime**: Bun
- **Database**: PostgreSQL 16
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **API**: RESTful

### Frontend (To be developed)
- Framework to be determined

### Infrastructure
- **Database**: PostgreSQL (port 5433)
- **CI/CD**: GitHub Actions (for portfolio)

---

## 🚀 Quick Start

### Backend Setup

1. **Install PostgreSQL**
   - See [BACKEND_SETUP.md](BACKEND_SETUP.md) for platform-specific instructions

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Initialize Database**
   ```bash
   bun run db:init
   ```

4. **Start Server**
   ```bash
   bun run api:dev
   ```

   Server will run at `http://localhost:3000`

### Authentication System

The backend includes a complete authentication system with XJTLU email verification.

- **Documentation**: [AUTH_SETUP.md](AUTH_SETUP.md)
- **API Docs**: [src/auth/README.md](src/auth/README.md)

#### Features
- ✅ XJTLU email authentication (`@student.xjtlu.edu.cn` / `@xjtlu.edu.cn`)
- ✅ Secure password hashing (bcrypt)
- ✅ JWT token authentication
- ✅ User registration & login
- ✅ Protected API routes

#### Quick Test

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "testuser@student.xjtlu.edu.cn",
    "password": "Password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@student.xjtlu.edu.cn",
    "password": "Password123"
  }'
```

### Available Scripts

```bash
bun run db:init       # Initialize database
bun run server        # Start production server
bun run api:dev       # Start development server (with hot reload)
bun run dev           # Start development server
```

---

## 📁 Project Structure

```
ApplicationWeb/
├── docs/                 # GitHub Pages - Process Portfolio
│   ├── src/              # Portfolio source code
│   ├── public/           # Static assets
│   └── astro.config.mjs  # Astro configuration
│
├── src/                  # Backend application
│   ├── api/              # API routes
│   │   ├── auth.ts       # Authentication endpoints
│   │   └── example.ts    # Example API routes
│   ├── db/               # Database layer
│   │   ├── db.ts         # Database connection
│   │   ├── init.ts       # Initialization script
│   │   └── README.md     # Database documentation
│   ├── middleware/       # Express middleware
│   │   └── auth.ts       # Authentication middleware
│   ├── utils/            # Utility functions
│   │   └── auth.ts       # Auth utilities
│   ├── auth/             # Auth documentation
│   │   └── README.md     # Authentication guide
│   └── server.ts         # Main server file
│
├── .env.example          # Environment variables template
├── BACKEND_SETUP.md      # Backend setup guide
├── AUTH_SETUP.md         # Authentication system guide
├── package.json          # Project dependencies
└── README.md             # This file
```

---

## 📚 Documentation

- [BACKEND_SETUP.md](BACKEND_SETUP.md) - Backend database setup
- [AUTH_SETUP.md](AUTH_SETUP.md) - Authentication system guide
- [src/auth/README.md](src/auth/README.md) - Detailed authentication API docs
- [src/db/README.md](src/db/README.md) - Database documentation

---

## 🎯 About This Repo

This repository contains:
1. **Process Portfolio** (`docs/`) - Documenting the iterative design process for HCI course
2. **Web Application Backend** (`src/`) - Gradventure backend API with authentication

---

**Course**: Human-Computer Interaction
**Semester**: Spring 2025
