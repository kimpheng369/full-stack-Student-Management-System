import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { students: true, teachers: true, classes: true, subjects: true } },
      },
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
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
    const { name, code } = body;

    if (!name || !code) {
      return NextResponse.json({ error: 'Department name and code are required' }, { status: 400 });
    }

    const department = await prisma.department.create({
      data: { name, code: code.toUpperCase() },
    });

    return NextResponse.json(department, { status: 201 });
  } catch (error: any) {
    console.error('Error creating department:', error);
    return NextResponse.json({ error: error.message || 'Failed to create department' }, { status: 500 });
  }
}
