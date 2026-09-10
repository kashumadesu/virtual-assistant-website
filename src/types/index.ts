export type UserRole = 'admin' | 'employee' | 'client';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type UserStatus = 'active' | 'inactive';
export type ActivityStatus = 'success' | 'failed';

export type ActivityAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'FAILED_LOGIN'
  | 'ACCESS'
  | 'VIEW'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'SEND'
  | 'UPLOAD'
  | 'DOWNLOAD';

export type ActivityModule =
  | 'AUTH'
  | 'DASHBOARD'
  | 'FILES'
  | 'TASKS'
  | 'MESSAGES'
  | 'PROFILE'
  | 'USERS';

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  status: UserStatus;
  last_active_at: string | null;
  created_at: string;
  updated_at: string;
  email?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assigned_to: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  assignee?: Profile;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: Profile;
  receiver?: Profile;
}

export interface FileRecord {
  id: string;
  name: string;
  storage_path: string;
  accessible_roles: UserRole[];
  file_size: number | null;
  file_type: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: ActivityAction;
  module: ActivityModule;
  description: string;
  status: ActivityStatus;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  profile?: Profile;
}

export interface DashboardStats {
  totalUsers: number;
  totalEmployees: number;
  totalClients: number;
  activeUsers: number;
  todayLogins: number;
}
