import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/get-user';
import { DashboardLayout } from '@/components/navigation/DashboardLayout';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await getUser();
  if (!user || !profile || profile.role !== 'admin') redirect('/login');
  return (
    <DashboardLayout profile={profile} email={user.email}>
      {children}
    </DashboardLayout>
  );
}
