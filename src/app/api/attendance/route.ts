import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/backend/lib/auth';
import { prisma } from '@/backend/lib/prisma';
import { AttendanceStatus, Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');
    const classId = searchParams.get('classId');
    const studentId = searchParams.get('studentId');
    const dateStr = searchParams.get('date');

    const where: any = {};
    if (subjectId) where.subjectId = subjectId;
    if (studentId) where.studentId = studentId;

    if (dateStr) {
      const date = new Date(dateStr);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.date = { gte: startOfDay, lte: endOfDay };
    }

    if (classId) {
      where.student = { classId };
    }

    const attendances = await prisma.attendance.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        student: { select: { id: true, studentId: true, firstName: true, lastName: true, classId: true } },
        subject: { select: { id: true, subjectName: true, code: true } },
      },
    });

    return NextResponse.json(attendances);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session?.user || (role !== Role.ADMIN && role !== Role.TEACHER)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { records, subjectId, date } = body;

    if (!Array.isArray(records) || !subjectId || !date) {
      return NextResponse.json({ error: 'Missing required parameters: records, subjectId, date' }, { status: 400 });
    }

    const targetDate = new Date(date);
    targetDate.setHours(9, 0, 0, 0);

    const upsertPromises = records.map(async (record: { studentId: string; status: AttendanceStatus }) => {
      return prisma.attendance.upsert({
        where: {
          studentId_subjectId_date: {
            studentId: record.studentId,
            subjectId,
            date: targetDate,
          },
        },
        update: {
          status: record.status,
        },
        create: {
          studentId: record.studentId,
          subjectId,
          date: targetDate,
          status: record.status,
        },
      });
    });

    const results = await Promise.all(upsertPromises);

    return NextResponse.json({
      message: `Successfully marked attendance for ${results.length} students`,
      count: results.length,
    });
  } catch (error: any) {
    console.error('Error saving attendance:', error);
    return NextResponse.json({ error: error.message || 'Failed to save attendance' }, { status: 500 });
  }
}
