# SkillXIntell

**Holistic Academic and Professional Skill Intelligence System for Emerging Sectors**

A comprehensive digital platform that tracks, analyzes, and provides insights on academic performance, skills, and career readiness across three critical sectors: Healthcare Informatics, Agricultural Technology, and Urban/Smart City Systems.

## Project Overview

SkillXIntell helps learners, educators, and recruiters understand real-world readiness by combining:
- Skill tracking (per sector)
- Evidence (projects + certifications)
- Assessments and analytics
- Career-path recommendations (AI-assisted)

The platform is built as a Next.js frontend + Express API backend using Prisma for persistence.

## 🎯 Project Overview

**SkillXIntell** enables data-driven self-awareness and informed decision-making for learners, educators, and institutions, with focused alignment to skill needs in healthcare digitalization, agricultural modernization, and urban transformation.


## MVPs / Key Features

- **Skill Tracker**: Create/update skills with sector + proficiency and see progress
- **Certifications**: Store certifications, verify and track them per sector
- **Projects**: Add projects with outcomes, skills used, and visibility
- **Recommended Career Paths**: Suggested roles/paths based on profile + skills
- **Assessment**: Quick assessments to score readiness and identify gaps
- **Skill Gap Analysis** - Identify and bridge competency gaps

- **Analytics & Insights**: Dashboards for skill gaps, readiness, and growth
- **Sector Performance Comparison**: Compare readiness/skill profiles across sectors
- **AI-Powered Recommendations**: Personalized learning steps and next actions
- **Responsive Design** - Works on all devices

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Charts:** Recharts
- **State Management:** React Hooks
- **Authentication (current):** JWT (stored in browser)
- **Optional:** Supabase client (used for storage / future auth integration)

### Backend
- **Runtime:** Node.js (see root `package.json` engines)
- **Framework:** Express.js
- **Language:** TypeScript
- **Database (local dev):** SQLite via Prisma (`DATABASE_URL="file:./dev.db"`)
- **ORM:** Prisma
- **Authentication:** JWT
- **File uploads:** Multer + Supabase Storage (avatars)

### Infrastructure
- **Deployment:** Vercel
- **Containerization:** Docker
- **Database Hosting:** Supabase
- **Version Control:** Git

## 🚀 Quick Start (Local Run)

For detailed, step-by-step instructions, see **[Run Locally Guide](./docs/local_setup.md)**.

## Setup & Run Locally (Copy/Paste)

Prereqs:
- Node.js installed
- Git installed

1) Install dependencies (from repo root)
```bash
npm install
```

2) Configure environment variables

Backend:
```bash
cd backend
copy .env.example .env
```

Frontend:
```bash
cd ..\frontend
copy ENV_TEMPLATE.txt .env.local
```

3) Setup database (SQLite by default)
```bash
cd ..\backend
npx prisma generate
npx prisma db push
```

4) (Optional) Seed demo users
```bash
npm run seed
```

5) Run both backend + frontend (from repo root)
```bash
cd ..
npm run dev
```

Open:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📁 Project Structure

```
skillxintell/
├── frontend/          # Next.js frontend application
├── backend/           # Express.js backend API
├── shared/            # Shared types and constants
├── docs/              # Documentation
├── docker-compose.yml # Docker configuration
└── package.json       # Root package configuration
```

## 🎨 Design System

- **Primary Colors:**
  - Healthcare: Blue (#0080FF)
  - Agriculture: Green (#4CAF50)
  - Urban: Purple (#9C27B0)
- **Theme:** Light mode primary with dark mode support
- **Style:** Minimalist and professional

## 📖 Documentation

- [Implementation Plan](./docs/implementation_plan.md)
- [Deployment Guide](./docs/deployment_guide.md)
- [Quick Start Guide](./docs/quick_start.md)
- [API Documentation](./docs/API.md)

## 🐳 Docker

Run with Docker:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🚢 Deployment

Deploy to Vercel:

```bash
# Deploy frontend
cd frontend
vercel --prod

# Deploy backend
cd backend
vercel --prod
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 🤝 Contributing

This is a hackathon project. Contributions, issues, and feature requests are welcome!

## 📝 License

MIT License - see LICENSE file for details

---

## Environment Variable Examples

Backend (backend/.env)
```dotenv
DATABASE_URL="file:./dev.db"
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

JWT_SECRET=replace_me
JWT_EXPIRES_IN=7d

SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_KEY=YOUR_SERVICE_ROLE_KEY
SUPABASE_AVATAR_BUCKET=avatars
```

Frontend (frontend/.env.local)
```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Test Login Credentials

After running `cd backend && npm run seed`:
- `test@skillxintell.com` / `Test@123`
- `student@skillxintell.com` / `Student@123`
- `educator@skillxintell.com` / `Educator@123`
- `Employee@skillxintell.com` / `Employee@123`

## Basic Error Handling / Common Fixes

- **“Invalid credentials”**: run the seed (`cd backend && npm run seed`) or register a new account
- **Prisma “table does not exist”**: run `cd backend && npx prisma db push`
- **Port already in use (EADDRINUSE)**: stop the other process using port 5000/3000, then restart `npm run dev`
- **Avatar upload “Bucket not found”**:
   - Create a Supabase Storage bucket named `avatars`, or set `SUPABASE_AVATAR_BUCKET` to an existing bucket
   - Ensure backend is using `SUPABASE_SERVICE_KEY` (service role) for storage operations

**Built for better education and career outcomes**
              