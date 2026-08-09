import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AttendanceStatus } from '@prisma/client';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = (session.user as any).role;
    const studentId = (session.user as any).studentId;
    const teacherId = (session.user as any).teacherId;

    // Counts
    const [
      totalStudents,
      totalTeachers,
      totalDepartments,
      totalClasses,
      totalSubjects,
      attendanceRecords,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.department.count(),
      prisma.class.count(),
      prisma.subject.count(),
      prisma.attendance.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

    // Attendance percentage
    let totalAtt = 0;
    let presentAtt = 0;
    attendanceRecords.forEach((item) => {
      totalAtt += item._count.status;
      if (item.status === AttendanceStatus.PRESENT || item.status === AttendanceStatus.EXCUSED) {
        presentAtt += item._count.status;
      }
    });
    const attendancePercentage = totalAtt > 0 ? Number(((presentAtt / totalAtt) * 100).toFixed(1)) : 95.0;

    // Recent Students
    const recentStudents = await prisma.student.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        department: { select: { name: true } },
        class: { select: { className: true } },
      },
    });

    // Attendance breakdown chart data
    const statusColorMap: Record<string, string> = {
      PRESENT: '#10b981', // green
      ABSENT: '#ef4444',  // red
      LATE: '#f59e0b',    // amber
      EXCUSED: '#3b82f6', // blue
    };

    const attendanceByStatus = attendanceRecords.map((item) => ({
      name: item.status,
      count: item._count.status,
      fill: statusColorMap[item.status] || '#6b7280',
    }));

    // Department distribution chart data
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: { students: true, teachers: true },
        },
      },
    });

    const departmentDistribution = departments.map((d) => ({
      name: d.code || d.name,
      students: d._count.students,
      teachers: d._count.teachers,
    }));

    // Grade distribution chart data
    const gradeGroups = await prisma.grade.groupBy({
      by: ['letterGrade'],
      _count: { letterGrade: true },
    });

    const gradeDistribution = gradeGroups.map((g) => ({
      grade: g.letterGrade,
      count: g._count.letterGrade,
    }));

    // Recent Activities
    const recentGrades = await prisma.grade.findMany({
      take: 3,
      orderBy: { updatedAt: 'desc' },
      include: {
        student: { select: { firstName: true, lastName: true } },
        subject: { select: { subjectName: true } },
      },
    });

    const recentActivities = recentGrades.map((g) => ({
      id: g.id,
      title: `Grade Updated`,
      description: `${g.student.firstName} ${g.student.lastName} scored ${g.total}% (${g.letterGrade}) in ${g.subject.subjectName}`,
      timestamp: g.updatedAt.toISOString(),
      type: 'grade' as const,
    }));

    return NextResponse.json({
      totalStudents,
      totalTeachers,
      totalDepartments,
      totalClasses,
      totalSubjects,
      attendancePercentage,
      recentStudents,
      recentActivities,
      attendanceByStatus,
      departmentDistribution,
      gradeDistribution,
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
