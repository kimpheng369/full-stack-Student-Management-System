import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/backend/lib/auth';
import { prisma } from '@/backend/lib/prisma';
import { SearchResult } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    const searchTerm = query.trim();

    const [students, teachers, subjects, departments] = await Promise.all([
      prisma.student.findMany({
        where: {
          OR: [
            { firstName: { contains: searchTerm } },
            { lastName: { contains: searchTerm } },
            { studentId: { contains: searchTerm } },
            { email: { contains: searchTerm } },
          ],
        },
        take: 5,
        include: { department: { select: { name: true } }, class: { select: { className: true } } },
      }),
      prisma.teacher.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm } },
            { teacherId: { contains: searchTerm } },
            { email: { contains: searchTerm } },
          ],
        },
        take: 5,
        include: { department: { select: { name: true } } },
      }),
      prisma.subject.findMany({
        where: {
          OR: [
            { subjectName: { contains: searchTerm } },
            { code: { contains: searchTerm } },
          ],
        },
        take: 5,
        include: { department: { select: { name: true } } },
      }),
      prisma.department.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm } },
            { code: { contains: searchTerm } },
          ],
        },
        take: 5,
      }),
    ]);

    const results: SearchResult[] = [];

    students.forEach((s) => {
      results.push({
        type: 'student',
        id: s.id,
        title: `${s.firstName} ${s.lastName} (${s.studentId})`,
        subtitle: `${s.department.name} • ${s.class.className}`,
        href: `/students?id=${s.id}`,
      });
    });

    teachers.forEach((t) => {
      results.push({
        type: 'teacher',
        id: t.id,
        title: `${t.name} (${t.teacherId})`,
        subtitle: `Dept: ${t.department.name}`,
        href: `/teachers?id=${t.id}`,
      });
    });

    subjects.forEach((subj) => {
      results.push({
        type: 'subject',
        id: subj.id,
        title: `${subj.subjectName} [${subj.code}]`,
        subtitle: `Dept: ${subj.department.name}`,
        href: `/academics?tab=subjects&id=${subj.id}`,
      });
    });

    departments.forEach((d) => {
      results.push({
        type: 'department',
        id: d.id,
        title: `${d.name} (${d.code})`,
        subtitle: `Department`,
        href: `/academics?tab=departments&id=${d.id}`,
      });
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error executing global search:', error);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
