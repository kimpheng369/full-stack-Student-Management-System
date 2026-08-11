# Student Management System

A full-stack web application built with Next.js 15, TypeScript, Prisma ORM, Tailwind CSS, and NextAuth. Designed for managing students, teachers, courses, attendance, and grades with role-based access control.

---

## Features

### Role-Based Access
- **Admin**: Overview dashboard with key metrics, full CRUD operations for students and teachers, department/class/subject management, attendance tracking, grade matrix, and export tools.
- **Teacher**: View assigned courses, manage class rosters, take daily attendance, and enter grades with automatic GPA calculation.
- **Student**: View personal profile, enrolled subjects, attendance records, and grade matrix.

### Core Modules
- **Dashboard**: Real-time stats, attendance breakdown charts, department distribution, and recent activity logs.
- **Student & Teacher Management**: Searchable directory, filter by department/class, pagination, and slide-over details drawer.
- **Attendance**: Daily attendance sheet with status tags (Present, Absent, Late, Excused).
- **Grades**: Weighted scoring system (Assignments 20%, Quizzes 20%, Midterm 30%, Final Exam 30%) with automatic letter grade and GPA computation.
- **Reports & Export**: Export student rosters, attendance logs, and grade matrices to PDF or Excel.

---

## Test Accounts

| Role | Email | Password | Name |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@school.edu` | `admin123` | Dr. Sovannara Chea |
| **Teacher** | `teacher1@school.edu` | `teacher123` | Dr. Sokha Chan |
| **Student** | `student1@school.edu` | `student123` | Sarith Mony |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

1. Clone or open the repository:
   ```bash
   cd student-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Ensure your `.env` file contains:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   AUTH_SECRET="your-secret-key-here"
   ```

4. Push the Prisma schema and run the seed script:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running with Docker & Docker Compose

1. **Quick Start with Docker Compose**:
   ```bash
   docker-compose up -d --build
   ```
   This will spin up:
   - Next.js application container on `http://localhost:3000`
   - PostgreSQL 16 database container on port `5432`

2. **Run Database Migrations & Seed Data inside Docker**:
   ```bash
   # Push schema to the containerized database
   docker-compose exec web npx prisma db push

   # Seed database with demo accounts & data
   docker-compose exec web npx prisma db seed
   ```

3. **Building single Docker Image**:
   ```bash
   docker build -t student-management-system .
   docker run -p 3000:3000 --env-file .env student-management-system
   ```

---

## Deployment Options

### Deploying with Vercel & Neon (PostgreSQL)

1. **Set up PostgreSQL Database on Neon**:
   - Create a project on [Neon Tech](https://neon.tech).
   - Copy your PostgreSQL connection string (`DATABASE_URL`), ensuring `?sslmode=require` is appended.

2. **Push Schema & Seed Database to Neon**:
   - Update your local `.env` file with your Neon `DATABASE_URL`.
   - Push database tables to Neon:
     ```bash
     npx prisma db push
     ```
   - (Optional) Seed initial data (Admin, Teachers, Students):
     ```bash
     npx prisma db seed
     ```

3. **Deploy to Vercel**:
   - Push your project to GitHub / GitLab / Bitbucket.
   - Import the repository in [Vercel](https://vercel.com).
   - Configure Environment Variables in Vercel project settings:
     - `DATABASE_URL` = `postgresql://...` (your Neon connection string)
     - `NEXTAUTH_SECRET` = `your-secret-key` (generate with `openssl rand -base64 32`)
     - `NEXTAUTH_URL` = `https://your-app-name.vercel.app`
     - `AUTH_SECRET` = `your-secret-key`
   - Vercel automatically runs `prisma generate && next build` via the `postinstall` script in `package.json`.

---

## Project Structure

```
student-management-system/
├── app/
│   ├── (dashboard)/
│   │   ├── admin/           # Admin dashboard
│   │   ├── teacher/         # Teacher dashboard
│   │   ├── student/         # Student profile & dashboard
│   │   ├── students/        # Student directory & CRUD
│   │   ├── teachers/        # Teacher directory & CRUD
│   │   ├── academics/       # Departments, classes, & subjects
│   │   ├── attendance/      # Attendance marking sheet
│   │   ├── grades/          # Grade entry matrix
│   │   └── reports/         # PDF & Excel report exports
│   ├── api/                 # API routes
│   ├── login/               # Sign-in page
│   ├── globals.css          # Global styles & Tailwind config
│   └── layout.tsx           # App layout & providers
├── components/
│   ├── charts/              # Recharts components
│   ├── modals/              # Form & delete dialogs
│   ├── navbar.tsx           # Top navigation bar
│   ├── sidebar.tsx          # Navigation sidebar
│   ├── stat-card.tsx        # Dashboard metric cards
│   └── theme-provider.tsx   # Light/dark mode provider
├── lib/
│   ├── auth.ts              # NextAuth configuration
│   ├── prisma.ts            # Prisma client instance
│   └── utils.ts             # Helpers & grade calculator
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed data script
└── types/                   # TypeScript definitions
```
