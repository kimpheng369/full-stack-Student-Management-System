import { Role, AttendanceStatus } from '@prisma/client';

export type UserRole = Role;

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  studentId?: string | null;
  teacherId?: string | null;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalDepartments: number;
  totalClasses: number;
  totalSubjects: number;
  attendancePercentage: number;
  recentStudents: Array<{
    id: string;
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
    department: { name: string };
    class: { className: string };
    createdAt: Date | string;
  }>;
  recentActivities: Array<{
    id: string;
    title: string;
    description: string;
    timestamp: string;
    type: 'attendance' | 'grade' | 'student' | 'teacher';
  }>;
  attendanceByStatus: Array<{
    name: string;
    count: number;
    fill: string;
  }>;
  departmentDistribution: Array<{
    name: string;
    students: number;
    teachers: number;
  }>;
  gradeDistribution: Array<{
    grade: string;
    count: number;
  }>;
}

export interface SearchResult {
  type: 'student' | 'teacher' | 'subject' | 'department';
  id: string;
  title: string;
  subtitle: string;
  href: string;
}
