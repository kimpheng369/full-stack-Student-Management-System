import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const departmentId = searchParams.get('departmentId') || '';
    const classId = searchParams.get('classId') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { studentId: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (departmentId) {
      where.departmentId = departmentId;
    }

    if (classId) {
      where.classId = classId;
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          department: { select: { id: true, name: true, code: true } },
          class: { select: { id: true, className: true, year: true } },
        },
      }),
      prisma.student.count({ where }),
    ]);

    return NextResponse.json({
      students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
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
    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      birthday,
      address,
      departmentId,
      classId,
      avatarUrl,
      password,
    } = body;

    if (!firstName || !lastName || !email || !departmentId || !classId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check email uniqueness
    const existingStudent = await prisma.student.findUnique({ where: { email: email.toLowerCase() } });
    if (existingStudent) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Generate Student ID
    const count = await prisma.student.count();
    const studentId = `STU-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

    // Create User account for student
    const defaultPassword = password || 'student123';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: email.toLowerCase(),
        password: passwordHash,
        role: Role.STUDENT,
      },
    });

    const student = await prisma.student.create({
      data: {
        studentId,
        userId: user.id,
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone: phone || '',
        gender: gender || 'Male',
        birthday: birthday || '2005-01-01',
        address: address || '',
        avatarUrl: avatarUrl || null,
        departmentId,
        classId,
      },
      include: {
        department: true,
        class: true,
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: error.message || 'Failed to create student' }, { status: 500 });
  }
}
