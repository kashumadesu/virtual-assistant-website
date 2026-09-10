import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth/get-user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { RoleBadge, ActionBadge } from '@/components/ui/StatusBadge';
import { formatDateTime } from '@/utils/format';
import { recordActivity } from '@/lib/activity/logger';
import { ACTIONS, MODULES } from '@/lib/activity/actions';
import { Users, UserCheck, Briefcase, Activity, LogIn, TrendingUp } from 'lucide-react';
import type { ActivityLog, Profile } from '@/types';

export default async function AdminDashboardPage() {
  const { user, profile } = await getUser();
  if (!user || !profile) return null;

  await recordActivity({
    userId: user.id,
    action: ACTIONS.ACCESS,
    module: MODULES.DASHBOARD,
    description: 'Accessed Admin Dashboard',
    status: 'success',
  });

  const supabase = await createClient();

  const [usersResult, activityResult, todayLoginsResult] = await Promise.all([
    supabase.from('profiles').select('id, role, status'),
    supabase
      .from('activity_logs')
      .select('*, profile:profiles(id, full_name, role, avatar_url)')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('activity_logs')
      .select('id')
      .eq('action', 'LOGIN')
      .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
  ]);

  const profiles = usersResult.data ?? [];
  const totalUsers = profiles.length;
  const totalEmployees = profiles.filter((p) => p.role === 'employee').length;
  const totalClients = profiles.filter((p) => p.role === 'client').length;
  const activeUsers = profiles.filter((p) => p.status === 'active').length;
  const todayLogins = todayLoginsResult.data?.length ?? 0;

  const recentLogs = (activityResult.data ?? []) as (ActivityLog & { profile: Profile })[];

  const statCards = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Employees', value: totalEmployees, icon: UserCheck, color: 'bg-teal-50 text-teal-600' },
    { label: 'Clients', value: totalClients, icon: Briefcase, color: 'bg-purple-50 text-purple-600' },
    { label: 'Active Users', value: activeUsers, icon: Activity, color: 'bg-emerald-50 text-emerald-600' },
    { label: "Today's Logins", value: todayLogins, icon: LogIn, color: 'bg-amber-50 text-amber-600' },
    { label: 'Recent Activities', value: recentLogs.length, icon: TrendingUp, color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-500 text-sm mt-0.5">Welcome back, {profile.full_name}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardContent className="p-4">
                <div className={`inline-flex h-9 w-9 rounded-lg items-center justify-center mb-3 ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <div className="divide-y divide-slate-100">
          {recentLogs.length === 0 && (
            <div className="px-6 py-8 text-center text-slate-400 text-sm">No activity yet</div>
          )}
          {recentLogs.map((log) => (
            <div key={log.id} className="px-6 py-3 flex items-center gap-4">
              <Avatar name={log.profile?.full_name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {log.profile?.full_name ?? 'Unknown User'}
                </p>
                <p className="text-xs text-slate-500 truncate">{log.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {log.profile?.role && <RoleBadge role={log.profile.role} />}
                <ActionBadge action={log.action} />
              </div>
              <span className="text-xs text-slate-400 flex-shrink-0">{formatDateTime(log.created_at)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
