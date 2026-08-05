import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const teachers = await prisma.teacher.findMany({
      orderBy: { name: 'asc' },
      include: {
        department: { select: { id: true, name: true, code: true } },
        subjects: { select: { id: true, subjectName: true, code: true } },
      },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
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
    const { name, email, phone, departmentId, password } = body;

    if (!name || !email || !departmentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await prisma.teacher.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: 'Teacher email already exists' }, { status: 400 });
    }

    const count = await prisma.teacher.count();
    const teacherId = `TCH-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, '0')}`;

    const defaultPassword = password || 'teacher123';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: passwordHash,
        role: Role.TEACHER,
      },
    });

    const teacher = await prisma.teacher.create({
      data: {
        teacherId,
        userId: user.id,
        name,
        email: email.toLowerCase(),
        phone: phone || '',
        departmentId,
      },
      include: {
        department: true,
      },
    });

    return NextResponse.json(teacher, { status: 201 });
  } catch (error: any) {
    console.error('Error creating teacher:', error);
    return NextResponse.json({ error: error.message || 'Failed to create teacher' }, { status: 500 });
  }
}
