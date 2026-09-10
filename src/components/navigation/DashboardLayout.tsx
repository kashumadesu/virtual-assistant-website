import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import type { Profile } from '@/types';

interface DashboardLayoutProps {
  children: ReactNode;
  profile: Profile;
  email?: string;
  title?: string;
}

export function DashboardLayout({ children, profile, email, title }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role={profile.role} fullName={profile.full_name} email={email} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar profile={profile} email={email} title={title} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
