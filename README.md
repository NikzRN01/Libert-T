# SkillXIntell

**Holistic Academic and Professional Skill Intelligence System for Emerging Sectors**

A comprehensive digital platform that tracks, analyzes, and provides insights on academic performance, skills, and career readiness across three critical sectors: **Healthcare Informatics**, **Agricultural Technology**, and **Urban/Smart City Systems**.

## 🎯 Mission

SkillXIntell enables data-driven self-awareness and informed decision-making for learners, educators, and institutions, with focused alignment to skill needs in healthcare digitalization, agricultural modernization, and urban transformation.

---

## ✨ Key Features

### Core Functionality
- **🎯 Skill Tracker**: Create/update skills with sector-specific proficiency levels and track progress
- **📜 Certifications Management**: Store, verify, and track certifications across all sectors
- **💼 Projects Portfolio**: Add projects with outcomes, skills used, and visibility controls
- **📊 Analytics & Insights**: Cross-sector dashboards for skill gaps, readiness metrics, and growth tracking
- **🤖 AI-Powered Recommendations**: Personalized learning paths and next actions based on profile analysis
- **🔄 Sector Comparison**: Compare readiness and skill profiles across Healthcare, Agriculture, and Urban sectors
- **📈 Assessment System**: Quick assessments to score readiness and identify competency gaps
- **🛠️ Skill Gap Analysis**: Identify and bridge critical skill deficiencies

### Advanced Features
- **🧠 AI Chatbot**: Conversational guidance using Gemini API for career path recommendations
- **👥 Mentor Network**: Connect with mentors in your sector of interest
- **✅ Skill Verification**: Request and manage peer verification of claimed skills
- **🎓 Multi-Sector Dashboards**: Dedicated dashboards for Healthcare, Agriculture, and Urban sectors
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🌙 Dark Mode Support**: Complete dark mode theme for comfortable viewing
- **👤 User Profiles**: Customizable profiles with avatar upload, bio, social links, and sector preferences

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom gradients
- **UI Components:** Shadcn UI, custom components
- **Charts & Visualization:** Recharts with Legend support
- **State Management:** React Hooks (useState, useCallback, useEffect, useMemo)
- **Authentication:** JWT (stored in localStorage)
- **File Storage:** Supabase Storage integration for avatar uploads
- **HTTP Client:** Fetch API with custom request interceptors
- **Icons:** Lucide React icons library

### Backend
- **Runtime:** Node.js (Latest LTS)
- **Framework:** Express.js
- **Language:** TypeScript
- **Database (Development):** SQLite via Prisma (`DATABASE_URL="file:./dev.db"`)
- **Database (Production):** PostgreSQL (Supabase)
- **ORM:** Prisma with automatic migrations
- **Authentication:** JWT with Bearer token validation
- **File Uploads:** Multer middleware for multipart form data
- **File Storage:** Supabase Storage for persistent file management
- **AI Integration:** OpenRouter API (gpt-4o-mini), Google Gemini API
- **Environment:** dotenv for configuration management

### Services & APIs
- **AI Recommendations:** OpenRouter API integration for skill recommendations
- **Chatbot AI:** Google Gemini API for conversational guidance
- **Udemy Integration:** Course recommendation service
- **Email/Notifications:** Ready for nodemailer integration

### Infrastructure & DevOps
- **Containerization:** Docker with Docker Compose
- **Deployment:** Vercel (frontend & backend)
- **Database Hosting:** Supabase (PostgreSQL + Storage)
- **Version Control:** Git + GitHub
- **Package Manager:** npm with workspaces (monorepo)
- **Linting:** ESLint with TypeScript parser
- **Development Tools:** Nodemon for auto-reload, Prisma CLI for migrations

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js** 18+ (check with `node --version`)
- **npm** 8+ (check with `npm --version`)
- **Git** installed
- **Supabase account** (for storage and optional database)

### 1️⃣ Clone & Install

```bash
# Clone repository
git clone https://github.com/NikzRN01/SkillXIntell.git
cd SkillXIntell

# Install all dependencies (from root)
npm install
```

### 2️⃣ Configure Environment Variables

**Backend (backend/.env)**
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```dotenv
# Database
DATABASE_URL="file:./dev.db"

# Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# JWT
JWT_SECRET=your_secret_key_here_min_32_chars
JWT_EXPIRES_IN=7d

# Supabase (get from Supabase dashboard)
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_KEY=YOUR_SERVICE_ROLE_KEY
SUPABASE_AVATAR_BUCKET=avatars

# AI Services
OPENROUTER_API_KEY=your_openrouter_key
GEMINI_API_KEY=your_gemini_api_key
```

**Frontend (frontend/.env.local)**
```bash
cp frontend/ENV_TEMPLATE.txt frontend/.env.local
```

Edit `frontend/.env.local`:
```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3️⃣ Setup Database

```bash
# Generate Prisma Client
cd backend
npx prisma generate

# Create and sync database schema
npx prisma db push

# (Optional) Seed demo data
npm run seed

cd ..
```

### 4️⃣ Start Development Servers

```bash
# From repository root
npm run dev
```

This starts:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

### Test Login Credentials (after seeding)
- **Email:** `test@skillxintell.com` / **Password:** `Test@123`
- **Email:** `student@skillxintell.com` / **Password:** `Student@123`
- **Email:** `educator@skillxintell.com` / **Password:** `Educator@123`
- **Email:** `employee@skillxintell.com` / **Password:** `Employee@123`

### Individual Development

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend (different terminal)
cd frontend
npm run dev
```

##  Project Structure

```
SkillXIntell/
├── frontend/                          # Next.js frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/            # User dashboard layouts
│   │   │   │   ├── agriculture/      # Agriculture sector dashboard
│   │   │   │   ├── analytics/        # Cross-sector analytics dashboard
│   │   │   │   ├── certifications/   # Certifications management
│   │   │   │   ├── chatbot/          # AI chatbot interface
│   │   │   │   ├── healthcare/       # Healthcare sector dashboard
│   │   │   │   ├── profile/          # User profile management
│   │   │   │   ├── projects/         # Projects portfolio
│   │   │   │   ├── skills/           # Skills management
│   │   │   │   ├── urban/            # Urban sector dashboard
│   │   │   │   └── verification/     # Skill verification system
│   │   │   ├── (auth)/               # Authentication pages (login, register)
│   │   │   ├── layout.tsx            # Root layout
│   │   │   ├── page.tsx              # Homepage
│   │   │   └── globals.css           # Global styles
│   │   ├── components/               # Reusable React components
│   │   │   ├── ui/                   # UI primitives
│   │   │   ├── layout/               # Layout components
│   │   │   └── *.tsx                 # Custom components
│   │   └── lib/                      # Utilities and helpers
│   │       ├── api.ts                # API client setup
│   │       ├── auth.ts               # Authentication utilities
│   │       ├── supabase.ts           # Supabase client
│   │       ├── constants.ts          # App constants
│   │       └── utils.ts              # Helper functions
│   ├── public/                       # Static assets
│   ├── next.config.ts               # Next.js configuration
│   └── tsconfig.json                # TypeScript config
│
├── backend/                          # Express.js backend API
│   ├── src/
│   │   ├── config/                  # Configuration modules
│   │   │   ├── database.ts          # Database connection setup
│   │   │   ├── env.ts               # Environment variable validation
│   │   │   └── supabase.ts          # Supabase client setup
│   │   ├── controllers/             # Route handlers (business logic)
│   │   │   ├── auth.controller.ts              # Auth endpoints
│   │   │   ├── user.controller.ts              # User profile endpoints
│   │   │   ├── skill.controller.ts             # Skill CRUD endpoints
│   │   │   ├── agriculture.controller.ts       # Agriculture sector endpoints
│   │   │   ├── healthcare.controller.ts        # Healthcare sector endpoints
│   │   │   ├── urban.controller.ts             # Urban sector endpoints
│   │   │   ├── analytics.controller.ts         # Analytics & recommendations
│   │   │   ├── chat.controller.ts              # Chatbot endpoints
│   │   │   ├── mentor.controller.ts            # Mentor system endpoints
│   │   │   └── verification.controller.ts      # Skill verification endpoints
│   │   ├── services/                # Business logic & external APIs
│   │   │   ├── auth.service.ts                 # JWT & authentication logic
│   │   │   ├── user.service.ts                 # User management
│   │   │   ├── skill.service.ts                # Skill operations
│   │   │   ├── ai-recommendation.service.ts    # OpenRouter API integration
│   │   │   ├── mentor.service.ts               # Mentor networking logic
│   │   │   ├── verification.service.ts         # Skill verification logic
│   │   │   ├── udemy.service.ts                # Course recommendations
│   │   ├── middleware/              # Express middleware
│   │   │   ├── auth.middleware.ts   # JWT verification
│   │   │   └── upload.middleware.ts # File upload handling
│   │   ├── routes/                  # API route definitions
│   │   ├── scripts/                 # Database scripts
│   │   │   ├── seed.ts              # Demo data seeding
│   │   │   └── test-db.ts           # Database testing
│   │   ├── server.ts               # Express app setup
│   │   └── express.d.ts            # TypeScript types for Express
│   ├── prisma/
│   │   ├── schema.prisma           # Prisma ORM schema
│   │   └── seed.ts                 # Seeding logic
│   └── tsconfig.json               # TypeScript config
│
├── docker-compose.yml              # Multi-container setup
├── package.json                    # Root package config (workspaces)
├── README.md                       # This file
└── docs/                           # Documentation (if available)
```

## 🎨 Design System

### Sector Color Scheme
- **Healthcare:** Blue (#0080FF) - Representing medical care and innovation
- **Agriculture:** Green (#4CAF50) - Representing growth and sustainability
- **Urban:** Purple/Orange (#9C27B0 / #FF6B35) - Representing modernization and transformation

### Design Principles
- **Theme:** Light mode primary with full dark mode support
- **Style:** Modern, minimalist, and professional
- **Accessibility:** WCAG 2.1 AA compliant with proper contrast ratios
- **Responsiveness:** Mobile-first approach with breakpoints for all devices
- **Typography:** Clear hierarchy with system fonts for performance
- **Spacing:** Consistent 4px grid system using Tailwind

## 📡 API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile details
- `PATCH /api/users/basic-info` - Update name/email
- `PATCH /api/users/avatar` - Upload avatar
- `GET /api/users/:id` - Get user by ID

### Skills
- `GET /api/skills` - List user skills
- `POST /api/skills` - Create new skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill
- `GET /api/skills/sector/:sector` - Get skills by sector

### Certifications
- `GET /api/certifications` - List certifications
- `POST /api/certifications` - Add certification
- `PUT /api/certifications/:id` - Update certification
- `DELETE /api/certifications/:id` - Remove certification

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Sector-Specific Dashboards
- `GET /api/healthcare` - Healthcare dashboard data
- `GET /api/agriculture` - Agriculture dashboard data
- `GET /api/urban` - Urban dashboard data

### Analytics & Recommendations
- `GET /api/analytics` - Cross-sector analytics data
- `GET /api/analytics/:sector` - Sector-specific analytics
- `POST /api/recommendations` - Get AI recommendations
- `GET /api/recommendations/:sector` - Sector recommendations

### Chat & AI
- `POST /api/chat` - Send message to chatbot
- `GET /api/chat/history` - Get chat history

### Mentor Network
- `GET /api/mentors` - Find mentors
- `POST /api/mentor-requests` - Send mentor request
- `GET /api/mentor-requests` - Get mentor requests
- `PATCH /api/mentor-requests/:id` - Accept/reject request

### Skill Verification
- `POST /api/verification-requests` - Request skill verification
- `GET /api/verification-requests` - Get verification requests
- `PATCH /api/verification-requests/:id` - Verify/reject skill claim
- `GET /api/verified-skills` - Get verified skills



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

---

## 🚢 Production Deployment

Deploy to Vercel:

```bash
# Deploy frontend
cd frontend
vercel --prod

# Deploy backend
cd backend
vercel --prod
```

This will deploy both frontend and backend to Vercel.

### Environment Setup
- Set environment variables in Vercel project settings
- Connect Supabase PostgreSQL for production database
- Configure appropriate CORS origins
- Enable production JWT secrets

---

## 📚 Available Scripts

```bash
# From repository root
npm run dev              # Start both frontend & backend in dev mode
npm run build           # Build frontend and backend
npm run lint            # Run ESLint on frontend

# Frontend only
cd frontend
npm run dev             # Start Next.js dev server
npm run build           # Build Next.js production bundle
npm run lint            # Lint frontend code
npm run type-check      # TypeScript type checking

# Backend only
cd backend
npm run dev             # Start Express with nodemon
npm run build           # Build TypeScript
npm run seed            # Seed demo data to database
npm run test-db         # Test database connection
```

---

## ❌ Troubleshooting

### Port Already in Use
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Database Errors
```bash
# Reset Prisma and database
cd backend
npx prisma db push --force-reset
npm run seed
```

### Prisma Not Generated
```bash
cd backend
npx prisma generate
```

### Avatar Upload Fails
1. Create Supabase Storage bucket named `avatars`
2. Verify `SUPABASE_SERVICE_KEY` in backend `.env`
3. Check bucket permissions in Supabase dashboard

### Authentication Issues
- Ensure `JWT_SECRET` is set in backend `.env`
- Clear browser localStorage and login again
- Check token expiration time with `JWT_EXPIRES_IN`
- Run seed: `cd backend && npm run seed`

### API Connection Failed
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Verify backend is running on correct port (default 5000)
- Check CORS_ORIGIN in backend `.env` matches frontend URL
- Check browser console for detailed error messages

### Build Failures
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear TypeScript cache: `find . -name "tsconfig.tsbuildinfo" -delete`
- Check Node version: `node --version` (should be 18+)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

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

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details

---

## 📞 Support & Contact

- **Project Lead:** NikzRN01
- **Repository:** [GitHub - SkillXIntell](https://github.com/NikzRN01/SkillXIntell)
- **Issues:** Use GitHub Issues for bug reports and feature requests

---


**Built for better education and career outcomes in emerging sectors** 🚀
              