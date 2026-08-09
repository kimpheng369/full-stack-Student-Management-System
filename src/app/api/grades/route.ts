import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/backend/lib/auth';
import { prisma } from '@/backend/lib/prisma';
import { calculateGrade } from '@/backend/lib/utils';
import { Role } from '@prisma/client';

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

    const where: any = {};
    if (subjectId) where.subjectId = subjectId;
    if (studentId) where.studentId = studentId;
    if (classId) where.student = { classId };

    const grades = await prisma.grade.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        student: {
          select: {
            id: true,
            studentId: true,
            firstName: true,
            lastName: true,
            class: { select: { className: true } },
          },
        },
        subject: {
          select: {
            id: true,
            subjectName: true,
            code: true,
            teacher: { select: { name: true } },
          },
        },
      },
    });

    return NextResponse.json(grades);
  } catch (error) {
    console.error('Error fetching grades:', error);
    return NextResponse.json({ error: 'Failed to fetch grades' }, { status: 500 });
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
    const { studentId, subjectId, assignment, quiz, midterm, finalExam } = body;

    if (!studentId || !subjectId) {
      return NextResponse.json({ error: 'studentId and subjectId are required' }, { status: 400 });
    }

    const assignScore = parseFloat(assignment || 0);
    const quizScore = parseFloat(quiz || 0);
    const midtermScore = parseFloat(midterm || 0);
    const finalScore = parseFloat(finalExam || 0);

    const { total, letterGrade, gpa } = calculateGrade(assignScore, quizScore, midtermScore, finalScore);

    const gradeRecord = await prisma.grade.upsert({
      where: {
        studentId_subjectId: {
          studentId,
          subjectId,
        },
      },
      update: {
        assignment: assignScore,
        quiz: quizScore,
        midterm: midtermScore,
        finalExam: finalScore,
        total,
        letterGrade,
        gpa,
      },
      create: {
        studentId,
        subjectId,
        assignment: assignScore,
        quiz: quizScore,
        midterm: midtermScore,
        finalExam: finalScore,
        total,
        letterGrade,
        gpa,
      },
      include: {
        student: { select: { firstName: true, lastName: true } },
        subject: { select: { subjectName: true } },
      },
    });

    return NextResponse.json(gradeRecord);
  } catch (error: any) {
    console.error('Error updating grade:', error);
    return NextResponse.json({ error: error.message || 'Failed to save grade' }, { status: 500 });
  }
}
