'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/format';
import type { UserRole } from '@/types';
import {
  LayoutDashboard,
  CheckSquare,
  FolderOpen,
  MessageSquare,
  User,
  Users,
  ActivitySquare,
  LogOut,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  admin: [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Activity Logs', href: '/admin/activity', icon: ActivitySquare },
  ],
  employee: [
    { label: 'Dashboard', href: '/employee/dashboard', icon: LayoutDashboard },
    { label: 'My Tasks', href: '/employee/tasks', icon: CheckSquare },
    { label: 'Files', href: '/employee/files', icon: FolderOpen },
    { label: 'Messages', href: '/employee/messages', icon: MessageSquare },
    { label: 'Profile', href: '/employee/profile', icon: User },
  ],
  client: [
    { label: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
    { label: 'My Tasks', href: '/client/tasks', icon: CheckSquare },
    { label: 'Files', href: '/client/files', icon: FolderOpen },
    { label: 'Messages', href: '/client/messages', icon: MessageSquare },
    { label: 'Profile', href: '/client/profile', icon: User },
  ],
};

interface SidebarProps {
  role: UserRole;
  fullName?: string | null;
  email?: string;
}

export function Sidebar({ role, fullName, email }: SidebarProps) {
  const pathname = usePathname();
  const navItems = NAV_ITEMS[role];

  return (
    <aside className="w-64 min-h-screen bg-slate-900 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-700">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-teal-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">Z</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Zen VA</p>
            <p className="text-slate-400 text-xs capitalize">{role} Portal</p>
          </div>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                isActive
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info + Logout */}
      <div className="px-3 py-4 border-t border-slate-700 space-y-1">
        <div className="px-3 py-2">
          <p className="text-white text-sm font-medium truncate">{fullName ?? 'User'}</p>
          <p className="text-slate-400 text-xs truncate">{email}</p>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
