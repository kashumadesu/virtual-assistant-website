'use client';

import { useState, useTransition } from 'react';
import { Card } from '@/components/ui/Card';
import { TaskStatusBadge } from '@/components/ui/StatusBadge';
import { formatDate } from '@/utils/format';
import type { Task, TaskStatus } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

interface Props {
  tasks: Task[];
  userId: string;
}

export function EmployeeTasksClient({ tasks: initialTasks, userId }: Props) {
  const [tasks, setTasks] = useState(initialTasks);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleStatusChange(taskId: string, newStatus: TaskStatus, taskTitle: string) {
    const supabase = createClient();

    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (!error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );

      // Log the activity
      await fetch('/api/tasks/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, taskTitle, newStatus, userId }),
      });

      startTransition(() => router.refresh());
    }
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {['Task', 'Description', 'Status', 'Update Status', 'Created'].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tasks.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">No tasks assigned</td></tr>
            )}
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-900">{task.title}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 max-w-xs">
                  <p className="truncate">{task.description ?? '—'}</p>
                </td>
                <td className="px-6 py-4">
                  <TaskStatusBadge status={task.status} />
                </td>
                <td className="px-6 py-4">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus, task.title)}
                    disabled={isPending}
                    className="text-sm border border-slate-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                  {formatDate(task.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
