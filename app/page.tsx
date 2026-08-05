import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const role = (session.user as any).role;

  if (role === 'ADMIN') {
    redirect('/admin');
  } else if (role === 'TEACHER') {
    redirect('/teacher');
  } else {
    redirect('/student');
  }
}
