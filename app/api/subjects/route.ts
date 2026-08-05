import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId');
    const teacherId = searchParams.get('teacherId');

    const where: any = {};
    if (departmentId) where.departmentId = departmentId;
    if (teacherId) where.teacherId = teacherId;

    const subjects = await prisma.subject.findMany({
      where,
      orderBy: { subjectName: 'asc' },
      include: {
        teacher: { select: { id: true, name: true, email: true } },
        department: { select: { id: true, name: true, code: true } },
      },
    });

    return NextResponse.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session?.user || role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { subjectName, code, teacherId, departmentId } = body;

    if (!subjectName || !code || !teacherId || !departmentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const subject = await prisma.subject.create({
      data: {
        subjectName,
        code: code.toUpperCase(),
        teacherId,
        departmentId,
      },
      include: {
        teacher: true,
        department: true,
      },
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (error: any) {
    console.error('Error creating subject:', error);
    return NextResponse.json({ error: error.message || 'Failed to create subject' }, { status: 500 });
  }
}
