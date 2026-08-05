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

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        department: true,
        class: true,
        user: { select: { id: true, email: true, name: true } },
        attendances: {
          include: { subject: { select: { subjectName: true, code: true } } },
          orderBy: { date: 'desc' },
          take: 30,
        },
        grades: {
          include: {
            subject: {
              select: {
                subjectName: true,
                code: true,
                teacher: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error('Error fetching student detail:', error);
    return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session?.user || (role !== Role.ADMIN && role !== Role.TEACHER)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
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
    } = body;

    const existing = await prisma.student.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Update student and associated user email/name if changed
    const updated = await prisma.student.update({
      where: { id },
      data: {
        firstName: firstName ?? existing.firstName,
        lastName: lastName ?? existing.lastName,
        email: email ? email.toLowerCase() : existing.email,
        phone: phone ?? existing.phone,
        gender: gender ?? existing.gender,
        birthday: birthday ?? existing.birthday,
        address: address ?? existing.address,
        departmentId: departmentId ?? existing.departmentId,
        classId: classId ?? existing.classId,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : existing.avatarUrl,
      },
      include: {
        department: true,
        class: true,
      },
    });

    if (existing.userId) {
      await prisma.user.update({
        where: { id: existing.userId },
        data: {
          name: `${updated.firstName} ${updated.lastName}`,
          email: updated.email,
        },
      });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating student:', error);
    return NextResponse.json({ error: error.message || 'Failed to update student' }, { status: 500 });
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
      return NextResponse.json({ error: 'Forbidden. Admin role required.' }, { status: 403 });
    }

    const { id } = await params;
    const student = await prisma.student.findUnique({ where: { id } });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Delete student and linked user
    await prisma.student.delete({ where: { id } });
    if (student.userId) {
      await prisma.user.delete({ where: { id: student.userId } }).catch(() => {});
    }

    return NextResponse.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
