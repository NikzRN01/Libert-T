# SkillXIntell

**Holistic Academic and Professional Skill Intelligence System for Emerging Sectors**

A comprehensive digital platform that tracks, analyzes, and provides insights on academic performance, skills, and career readiness across three critical sectors: Healthcare Informatics, Agricultural Technology, and Urban/Smart City Systems.

## 🎯 Project Overview

**SkillXIntell** enables data-driven self-awareness and informed decision-making for learners, educators, and institutions, with focused alignment to skill needs in healthcare digitalization, agricultural modernization, and urban transformation.

### Key Features

- 📊 **Multi-Sector Skill Tracking** - Healthcare, Agriculture, Urban Development
- 🎓 **Academic Performance Analysis** - Comprehensive learning journey tracking
- 💼 **Career Readiness Assessment** - Industry alignment scoring
- 🤖 **AI-Powered Recommendations** - Personalized learning paths
- 📈 **Skill Gap Analysis** - Identify and bridge competency gaps
- 🏆 **Certification Management** - Track credentials across sectors
- 📱 **Responsive Design** - Works on all devices

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Charts:** Recharts
- **State Management:** React Hooks
- **Authentication:** Supabase Auth

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Authentication:** JWT + Supabase Auth

### Infrastructure
- **Deployment:** Vercel
- **Containerization:** Docker
- **Database Hosting:** Supabase
- **Version Control:** Git

## 🚀 Quick Start (Local Run)

For detailed, step-by-step instructions, see **[Run Locally Guide](./docs/local_setup.md)**.

### Brief Instructions:
1. **Clone & Install**
   ```bash
   git clone https://github.com/yourusername/skillxintell.git
   cd skillxintell
   npm install
   ```

2. **Configure Environment**
   - Backend: Copy `.env.example` to `backend/.env` (Use Supabase Pooler Port 6543!)
   - Frontend: Copy `.env.example` to `frontend/.env.local`

3. **Setup Database**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

4. **Run**
   ```bash
   # From root
   npm run dev
   ```
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

## 👥 Team

SkillXIntell Development Team

## 🏆 Hackathon

Built for the Holistic Academic and Professional Skill Intelligence System hackathon challenge.

---

**Built with ❤️ for better education and career outcomes**
              