# Gradventure

An interactive, gamified journey documenting the HCI (Human-Computer Interaction) design process. Gradventure is designed as a web-based card/board game where users progress through different stages of product development.

## � Tech Stack (Current Progress)

### Frontend (Client)
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4 (Neo-brutalism theme)
- **State Management:** Zustand
- **Data Fetching:** React Query (TanStack Query v5), Axios
- **Animations:** Framer Motion

### Backend (Server - *Pending Implementation*)
- **Runtime:** Bun
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken) & bcryptjs

### Shared (Game Logic)
- Custom game engine types and configurations (`src/game/` & `src/types/`)

## 🚀 Development Status

1. **Static Documentation (`docs/`)**: ✅ Completed
   - Contains the Astro-based static site detailing the design journey (Crazy Eights, CJM, etc.).
2. **Frontend Architecture (`src/client/`)**: 🚧 Initialized
   - Vite + React + Tailwind v4 environment is set up and integrated.
   - Core game logic types (`cards`, `characters`, `backgrounds`) have been drafted by the team in `src/game/`.
3. **Backend Architecture (`src/server/`)**: ❌ Not Started
   - Prisma schema is currently empty.
   - Server entry points (`src/server/index.ts`, `src/db/init.ts`) defined in `package.json` are not yet created.

## 💻 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (Recommended) or Node.js

### Running the Frontend
```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

*(Note: Backend setup instructions will be updated once the server API is implemented).*
