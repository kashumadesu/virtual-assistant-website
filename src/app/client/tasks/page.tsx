import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth/get-user';
import { recordActivity } from '@/lib/activity/logger';
import { ACTIONS, MODULES } from '@/lib/activity/actions';
import { Card } from '@/components/ui/Card';
import { TaskStatusBadge } from '@/components/ui/StatusBadge';
import { formatDate } from '@/utils/format';
import type { Task } from '@/types';

export default async function ClientTasksPage() {
  const { user } = await getUser();
  if (!user) return null;

  await recordActivity({
    userId: user.id,
    action: ACTIONS.VIEW,
    module: MODULES.TASKS,
    description: 'Viewed assigned tasks',
    status: 'success',
  });

  const supabase = await createClient();
  const { data } = await supabase
    .from('tasks')
    .select('*')
    .eq('assigned_to', user.id)
    .order('created_at', { ascending: false });

  const tasks = (data ?? []) as Task[];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">My Tasks</h2>
        <p className="text-slate-500 text-sm mt-0.5">{tasks.length} tasks assigned to you</p>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {['Task', 'Description', 'Status', 'Created'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tasks.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-sm">No tasks assigned</td></tr>
              )}
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{task.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-xs">
                    <p className="truncate">{task.description ?? '—'}</p>
                  </td>
                  <td className="px-6 py-4"><TaskStatusBadge status={task.status} /></td>
                  <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{formatDate(task.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
