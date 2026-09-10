import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth/get-user';
import { recordActivity } from '@/lib/activity/logger';
import { ACTIONS, MODULES } from '@/lib/activity/actions';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmployeeTasksClient } from './EmployeeTasksClient';
import type { Task } from '@/types';

export default async function EmployeeTasksPage() {
  const { user } = await getUser();
  if (!user) return null;

  await recordActivity({
    userId: user.id,
    action: ACTIONS.VIEW,
    module: MODULES.TASKS,
    description: 'Viewed task list',
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
      <EmployeeTasksClient tasks={tasks} userId={user.id} />
    </div>
  );
}
