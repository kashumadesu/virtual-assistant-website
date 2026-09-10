import { Avatar } from '@/components/ui/Avatar';
import { RoleBadge } from '@/components/ui/StatusBadge';
import type { Profile } from '@/types';

interface TopBarProps {
  profile: Profile;
  email?: string;
  title?: string;
}

export function TopBar({ profile, email, title }: TopBarProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
      <div>
        {title && <h1 className="text-lg font-semibold text-slate-900">{title}</h1>}
      </div>
      <div className="flex items-center gap-3">
        <RoleBadge role={profile.role} />
        <div className="flex items-center gap-2">
          <Avatar name={profile.full_name} avatarUrl={profile.avatar_url} size="sm" />
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-slate-900 leading-tight">{profile.full_name ?? 'User'}</p>
            <p className="text-xs text-slate-500 leading-tight">{email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
