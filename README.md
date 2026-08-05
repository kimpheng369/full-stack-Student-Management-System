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

---

## Deployment Options

### Vercel + Neon (PostgreSQL)

1. Set up a PostgreSQL database on [Neon](https://neon.tech).
2. Update the `datasource` provider in `prisma/schema.prisma` from `sqlite` to `postgresql`.
3. Import the project into Vercel and configure environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
4. Set build command:
   ```bash
   npx prisma generate && npx prisma db push && next build
   ```

### Cloudflare Pages

1. Environment variables to configure in Cloudflare Pages:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
2. Deploy using Wrangler:
   ```bash
   npx wrangler pages deploy .next
   ```

### Local Public Sharing with Cloudflare Tunnel

To share your local dev server publicly without port forwarding:
```bash
cloudflared tunnel --url http://localhost:3000
```

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
