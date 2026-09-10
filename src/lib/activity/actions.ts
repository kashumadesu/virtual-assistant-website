import type { ActivityAction, ActivityModule } from '@/types';

export const ACTIONS: Record<string, ActivityAction> = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  FAILED_LOGIN: 'FAILED_LOGIN',
  ACCESS: 'ACCESS',
  VIEW: 'VIEW',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  SEND: 'SEND',
  UPLOAD: 'UPLOAD',
  DOWNLOAD: 'DOWNLOAD',
};

export const MODULES: Record<string, ActivityModule> = {
  AUTH: 'AUTH',
  DASHBOARD: 'DASHBOARD',
  FILES: 'FILES',
  TASKS: 'TASKS',
  MESSAGES: 'MESSAGES',
  PROFILE: 'PROFILE',
  USERS: 'USERS',
};
