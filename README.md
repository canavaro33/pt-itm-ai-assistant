# PT ITM Corporate AI Chatbot Portal

> **PT Indo Tambangraya Megah** — Premium Corporate AI Wellness & Knowledge Portal

A full-stack web application featuring a luxury glassmorphic UI with an integrated AI chatbot that answers employee questions based on the company's knowledge base.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Tech Stack](https://img.shields.io/badge/Express.js-4-green?style=flat-square&logo=express)
![Tech Stack](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)
![Tech Stack](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)
![Tech Stack](https://img.shields.io/badge/Three.js-r171-black?style=flat-square&logo=three.js)

---

## ✨ Features

- **Premium Glassmorphic UI** — Dark luxury theme with glassmorphic cards, smooth animations, and responsive design
- **Interactive 3D Object** — Three.js icosahedron with drag-to-rotate interaction and inertia damping
- **AI Chatbot** — Full-screen chat overlay with real-time AI responses based on company knowledge base
- **Dual LLM Support** — Supports both Anthropic (Claude) and OpenAI (GPT-4o) via environment variable toggle
- **Corporate Knowledge Base** — PostgreSQL-backed knowledge base with safety, wellness, and corporate data

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Frontend   | Next.js 14, TypeScript, Tailwind CSS, Three.js |
| Backend    | Express.js, TypeScript            |
| Database   | PostgreSQL + Prisma ORM           |
| AI         | Anthropic Claude / OpenAI GPT-4o  |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17+ 
- **PostgreSQL** running on localhost:5432
- **AI API Key** (Anthropic or OpenAI)

### 1. Clone & Install

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL and AI_API_KEY
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Setup Database

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database
npm run seed
```

### 3. Configure Environment

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ptitm"
AI_PROVIDER="anthropic"         # or "openai"
AI_API_KEY="your-api-key-here"
PORT=4000
```

### 4. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend  
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
pt-itm-portal/
├── frontend/                    # Next.js 14 App
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   ├── components/         # React components
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ThreeScene.tsx  # 3D interactive object
│   │   │   ├── BottomBar.tsx
│   │   │   ├── ChatWidget.tsx  # Chat trigger button
│   │   │   ├── ChatOverlay.tsx # Full-screen chat modal
│   │   │   └── TypingIndicator.tsx
│   │   └── lib/
│   │       └── api.ts          # API client
│   └── ...config files
│
├── backend/                     # Express.js API
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.ts             # Seed data (12 entries)
│   ├── src/
│   │   ├── index.ts            # Server entry
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Auth & logger
│   │   ├── services/           # LLM & knowledge search
│   │   └── lib/                # Prisma client
│   └── ...config files
│
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint       | Description                    |
| ------ | -------------- | ------------------------------ |
| POST   | `/api/chat`    | Send a message to the AI       |
| GET    | `/api/health`  | Server health check            |

### POST /api/chat

```json
// Request
{
  "message": "Apa itu APD?",
  "employee_id": "ITM-0012"
}

// Response
{
  "reply": "APD atau Alat Pelindung Diri adalah..."
}
```

---

## 🎨 Design System

| Token       | Value                        |
| ----------- | ---------------------------- |
| Background  | `#0d0d0d` / `#111111`       |
| Accent      | `#c8623a` (terracotta)       |
| Text        | `#ffffff` / `#f5f0e8` (cream)|
| Glass       | `bg-white/5 backdrop-blur-md`|
| Font Body   | Inter                        |
| Font Display| Outfit                       |

---

## 📝 License

This project is for internal/demo use by PT Indo Tambangraya Megah.
