import { type TaskStatus, type UserRole, type ActivityStatus, type ActivityAction } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

export function getTaskStatusColor(status: TaskStatus): string {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-800';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-emerald-100 text-emerald-800';
  }
}

export function getTaskStatusLabel(status: TaskStatus): string {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
  }
}

export function getRoleColor(role: UserRole): string {
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-800';
    case 'employee':
      return 'bg-blue-100 text-blue-800';
    case 'client':
      return 'bg-teal-100 text-teal-800';
  }
}

export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'admin':
      return 'Admin';
    case 'employee':
      return 'Employee';
    case 'client':
      return 'Client';
  }
}

export function getActivityStatusColor(status: ActivityStatus): string {
  switch (status) {
    case 'success':
      return 'bg-emerald-100 text-emerald-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
  }
}

export function getActionColor(action: ActivityAction): string {
  switch (action) {
    case 'LOGIN':
      return 'bg-green-100 text-green-800';
    case 'LOGOUT':
      return 'bg-slate-100 text-slate-700';
    case 'FAILED_LOGIN':
      return 'bg-red-100 text-red-800';
    case 'ACCESS':
    case 'VIEW':
      return 'bg-blue-100 text-blue-800';
    case 'CREATE':
      return 'bg-teal-100 text-teal-800';
    case 'UPDATE':
      return 'bg-amber-100 text-amber-800';
    case 'DELETE':
      return 'bg-red-100 text-red-800';
    case 'SEND':
      return 'bg-indigo-100 text-indigo-800';
    case 'UPLOAD':
    case 'DOWNLOAD':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
