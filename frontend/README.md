# Gradventure Frontend

React + Vite + TypeScript + TailwindCSS frontend for Gradventure project.

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

## 🛠️ Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS 4.x
- **Routing**: React Router v7
- **State Management**: @tanstack/react-query
- **HTTP Client**: Axios
- **Animations**: Framer Motion

## 📁 Project Structure

```
frontend/
├── src/
│   ├── assets/         # Static assets
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles (TailwindCSS)
├── .env                # Environment variables
├── tailwind.config.js  # TailwindCSS configuration
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies
```

## 🎨 TailwindCSS Configuration

### Custom Colors
- `primary-*`: Primary blue colors (50-900)
- `accent-*`: Accent gold/orange colors (50-900)

### Custom Components
```tsx
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
<input className="input-field" />
<div className="card">Card Content</div>
```

### Built-in Animations
- `animate-fade-in`
- `animate-slide-up`
- `animate-slide-down`
- `animate-bounce-slow`

## 🔧 Environment Variables

Create `.env` file:
```env
VITE_API_URL=http://localhost:3000
```

## 📝 Available Scripts

```bash
bun run dev       # Start development server (http://localhost:5173)
bun run build     # Build for production
bun run preview   # Preview production build
bun run lint      # Run ESLint
```

## 🎯 Backend Integration

The backend API is available at:
- Development: `http://localhost:3000`
- Health check: `http://localhost:3000/health`

### API Endpoints

See backend documentation for available endpoints:
- `AUTH_SETUP.md` - Authentication API
- `src/auth/README.md` - Detailed API docs

## 📚 Development Notes

### Dark Mode
Dark mode is automatically supported based on system preference.

### API Proxy
During development, Vite proxies `/api` requests to the backend server.

### TypeScript
Full TypeScript support with strict mode enabled.

## 🚀 Deployment

Build for production:
```bash
bun run build
```

The `dist/` folder can be deployed to any static hosting service.

---

**Ready for development! 🚀**
