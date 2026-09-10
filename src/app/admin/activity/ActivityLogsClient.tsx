'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { RoleBadge, ActionBadge, ActivityStatusBadge } from '@/components/ui/StatusBadge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatDateTime } from '@/utils/format';
import type { ActivityLog, Profile, UserRole, ActivityAction, ActivityModule } from '@/types';
import { Search, Filter } from 'lucide-react';

type LogWithProfile = ActivityLog & { profile: Profile };

interface Props {
  logs: LogWithProfile[];
}

export function ActivityLogsClient({ logs }: Props) {
  const [search, setSearch] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const uniqueUsers = useMemo(() => {
    const userMap = new Map<string, { id: string; name: string; role: string }>();
    logs.forEach((log) => {
      if (log.profile?.id) {
        userMap.set(log.profile.id, {
          id: log.profile.id,
          name: log.profile.full_name ?? 'Unknown',
          role: log.profile.role,
        });
      }
    });
    return Array.from(userMap.values());
  }, [logs]);

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        !search ||
        log.description.toLowerCase().includes(search.toLowerCase()) ||
        log.profile?.full_name?.toLowerCase().includes(search.toLowerCase());

      const matchUser = userFilter === 'all' || log.user_id === userFilter;
      const matchRole = roleFilter === 'all' || log.profile?.role === roleFilter;
      const matchAction = actionFilter === 'all' || log.action === actionFilter;
      const matchModule = moduleFilter === 'all' || log.module === moduleFilter;

      let matchDate = true;
      if (dateFilter !== 'all') {
        const logDate = new Date(log.created_at);
        const now = new Date();
        if (dateFilter === 'today') {
          matchDate = logDate.toDateString() === now.toDateString();
        } else if (dateFilter === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchDate = logDate >= weekAgo;
        } else if (dateFilter === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchDate = logDate >= monthAgo;
        }
      }

      return matchSearch && matchUser && matchRole && matchAction && matchModule && matchDate;
    });
  }, [logs, search, userFilter, roleFilter, actionFilter, moduleFilter, dateFilter]);

  return (
    <Card>
      {/* Filters */}
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search user or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <Select value={userFilter} onChange={(e) => setUserFilter(e.target.value)} className="sm:w-40">
            <option value="all">All Users</option>
            {uniqueUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </Select>
          <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="sm:w-36">
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
            <option value="client">Client</option>
          </Select>
          <Select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="sm:w-40">
            <option value="all">All Actions</option>
            <option value="LOGIN">Login</option>
            <option value="LOGOUT">Logout</option>
            <option value="FAILED_LOGIN">Failed Login</option>
            <option value="ACCESS">Access</option>
            <option value="VIEW">View</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="SEND">Send</option>
            <option value="UPLOAD">Upload</option>
            <option value="DOWNLOAD">Download</option>
          </Select>
          <Select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} className="sm:w-40">
            <option value="all">All Modules</option>
            <option value="AUTH">Authentication</option>
            <option value="DASHBOARD">Dashboard</option>
            <option value="FILES">Files</option>
            <option value="TASKS">Tasks</option>
            <option value="MESSAGES">Messages</option>
            <option value="PROFILE">Profile</option>
            <option value="USERS">Users</option>
          </Select>
          <Select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="sm:w-36">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </Select>
        </div>
        <p className="text-xs text-slate-500 mt-2">{filtered.length} records</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {['Date / Time', 'User', 'Role', 'Action', 'Module', 'Description', 'Status'].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400 text-sm">No logs match your filters</td></tr>
            )}
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3 text-xs text-slate-500 whitespace-nowrap">{formatDateTime(log.created_at)}</td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={log.profile?.full_name} size="sm" />
                    <span className="text-sm font-medium text-slate-900 whitespace-nowrap">{log.profile?.full_name ?? 'Unknown'}</span>
                  </div>
                </td>
                <td className="px-6 py-3">{log.profile?.role && <RoleBadge role={log.profile.role} />}</td>
                <td className="px-6 py-3"><ActionBadge action={log.action} /></td>
                <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">{log.module}</td>
                <td className="px-6 py-3 text-sm text-slate-600 max-w-xs truncate">{log.description}</td>
                <td className="px-6 py-3"><ActivityStatusBadge status={log.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
