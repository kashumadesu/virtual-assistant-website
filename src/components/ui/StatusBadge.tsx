import { cn, getTaskStatusColor, getTaskStatusLabel, getRoleColor, getRoleLabel, getActivityStatusColor, getActionColor } from '@/utils/format';
import type { TaskStatus, UserRole, ActivityStatus, ActivityAction } from '@/types';

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getTaskStatusColor(status))}>
      {getTaskStatusLabel(status)}
    </span>
  );
}

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getRoleColor(role))}>
      {getRoleLabel(role)}
    </span>
  );
}

export function ActivityStatusBadge({ status }: { status: ActivityStatus }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getActivityStatusColor(status))}>
      {status.toUpperCase()}
    </span>
  );
}

export function ActionBadge({ action }: { action: ActivityAction }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getActionColor(action))}>
      {action}
    </span>
  );
}

export function UserStatusBadge({ status }: { status: 'active' | 'inactive' }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
    )}>
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  );
}
