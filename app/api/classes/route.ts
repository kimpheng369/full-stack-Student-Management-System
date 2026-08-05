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

    const where = departmentId ? { departmentId } : {};

    const classes = await prisma.class.findMany({
      where,
      orderBy: { className: 'asc' },
      include: {
        department: { select: { name: true, code: true } },
        _count: { select: { students: true } },
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
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
    const { className, year, departmentId } = body;

    if (!className || !departmentId) {
      return NextResponse.json({ error: 'Class name and department are required' }, { status: 400 });
    }

    const newClass = await prisma.class.create({
      data: {
        className,
        year: parseInt(year || new Date().getFullYear(), 10),
        departmentId,
      },
      include: {
        department: true,
      },
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error: any) {
    console.error('Error creating class:', error);
    return NextResponse.json({ error: error.message || 'Failed to create class' }, { status: 500 });
  }
}
