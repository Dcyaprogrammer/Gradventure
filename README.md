# Gradventure

An interactive, gamified journey documenting the HCI (Human-Computer Interaction) design process. Gradventure is designed as a web-based card/board game where users progress through different stages of product development.

## � Live Links

- **🎮 Play the Game (Main App):** [https://gradventure-yijl.vercel.app](https://gradventure-yijl.vercel.app)
- **📖 HCI Design Portfolio (Docs):** [https://dcyaprogrammer.github.io/Gradventure/](https://dcyaprogrammer.github.io/Gradventure/)

## �🛠 Tech Stack (Current Progress)

### Frontend (Client)
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4 (Neo-brutalism theme)
- **State Management:** Zustand
- **Data Fetching:** React Query (TanStack Query v5), Axios
- **Animations:** Framer Motion

### Backend & Database (BaaS)
- **Platform:** Supabase
- **Authentication:** Supabase Auth (Email/Password, Anonymous play)
- **Database:** PostgreSQL (via Supabase)

### Shared (Game Logic)
- Custom game engine types and configurations (`src/game/` & `src/types/`)

## 🚀 Development Status

1. **Static Documentation (`docs/`)**: ✅ Completed
   - Contains the Astro-based static site detailing the design journey (Crazy Eights, CJM, etc.).
2. **Frontend Architecture (`src/client/`)**: 🚧 In Progress
   - Vite + React + Tailwind v4 environment is set up and integrated.
   - Core game logic types (`cards`, `characters`, `backgrounds`) have been drafted by the team in `src/game/`.
   - **Home Page**: Completed the "Survive to Graduation" Neo-brutalism glitch UI theme (warning tapes, system failure aesthetics).
   - **Authentication**: Completed custom Neo-brutalism `AuthModal` integrated with Supabase Auth and Zustand for state management.
3. **Backend Architecture**: 🚧 Transitioned to Supabase
   - Replaced initial custom Node/JWT/bcrypt plans with Supabase for faster iteration and robust Auth/DB capabilities.

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
