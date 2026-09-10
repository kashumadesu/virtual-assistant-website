import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth/get-user';
import { recordActivity } from '@/lib/activity/logger';
import { ACTIONS, MODULES } from '@/lib/activity/actions';
import { Card, CardContent } from '@/components/ui/Card';
import { TaskStatusBadge } from '@/components/ui/StatusBadge';
import { CheckSquare, Clock, FolderOpen, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import type { Task } from '@/types';

export default async function EmployeeDashboardPage() {
  const { user, profile } = await getUser();
  if (!user || !profile) return null;

  await recordActivity({
    userId: user.id,
    action: ACTIONS.ACCESS,
    module: MODULES.DASHBOARD,
    description: 'Accessed Employee Dashboard',
    status: 'success',
  });

  const supabase = await createClient();
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('assigned_to', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const myTasks = (tasks ?? []) as Task[];
  const pending = myTasks.filter((t) => t.status === 'pending').length;
  const inProgress = myTasks.filter((t) => t.status === 'in_progress').length;
  const completed = myTasks.filter((t) => t.status === 'completed').length;

  const quickLinks = [
    { label: 'My Tasks', href: '/employee/tasks', icon: CheckSquare, count: myTasks.length },
    { label: 'Files', href: '/employee/files', icon: FolderOpen },
    { label: 'Messages', href: '/employee/messages', icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Welcome, {profile.full_name?.split(' ')[0]}</h2>
        <p className="text-slate-500 text-sm mt-0.5">Here is your work overview for today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: pending, color: 'bg-amber-50 text-amber-700', icon: Clock },
          { label: 'In Progress', value: inProgress, color: 'bg-blue-50 text-blue-700', icon: CheckSquare },
          { label: 'Completed', value: completed, color: 'bg-emerald-50 text-emerald-700', icon: CheckSquare },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-4 text-center">
                <div className={`inline-flex h-9 w-9 rounded-lg items-center justify-center mb-2 ${s.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <Card className="hover:border-teal-300 hover:shadow-md transition-all cursor-pointer">
                <CardContent className="p-5 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-teal-50 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-teal-600" />
                  </div>
                  <span className="font-medium text-slate-700 text-sm">{link.label}</span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Tasks */}
      <Card>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Recent Tasks</h3>
          <Link href="/employee/tasks" className="text-sm text-teal-600 hover:text-teal-700">View all</Link>
        </div>
        <div className="divide-y divide-slate-50">
          {myTasks.length === 0 && (
            <div className="px-6 py-8 text-center text-slate-400 text-sm">No tasks assigned yet</div>
          )}
          {myTasks.map((task) => (
            <div key={task.id} className="px-6 py-3 flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-slate-900 truncate">{task.title}</p>
              <TaskStatusBadge status={task.status} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
