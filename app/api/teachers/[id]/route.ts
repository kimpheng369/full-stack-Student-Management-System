import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        department: true,
        subjects: true,
      },
    });

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    return NextResponse.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher detail:', error);
    return NextResponse.json({ error: 'Failed to fetch teacher' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session?.user || role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const { name, email, phone, departmentId } = body;

    const existing = await prisma.teacher.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    const updated = await prisma.teacher.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        email: email ? email.toLowerCase() : existing.email,
        phone: phone ?? existing.phone,
        departmentId: departmentId ?? existing.departmentId,
      },
      include: {
        department: true,
      },
    });

    if (existing.userId) {
      await prisma.user.update({
        where: { id: existing.userId },
        data: {
          name: updated.name,
          email: updated.email,
        },
      });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating teacher:', error);
    return NextResponse.json({ error: error.message || 'Failed to update teacher' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session?.user || role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const teacher = await prisma.teacher.findUnique({ where: { id } });

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    await prisma.teacher.delete({ where: { id } });
    if (teacher.userId) {
      await prisma.user.delete({ where: { id: teacher.userId } }).catch(() => {});
    }

    return NextResponse.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    return NextResponse.json({ error: 'Failed to delete teacher' }, { status: 500 });
  }
}
