import { createClient } from '@/lib/supabase/server';
import { createServerClient } from '@supabase/ssr';
import { getUser } from '@/lib/auth/get-user';
import { recordActivity } from '@/lib/activity/logger';
import { ACTIONS, MODULES } from '@/lib/activity/actions';
import { AdminUsersClient } from './AdminUsersClient';
import type { Profile } from '@/types';

export default async function AdminUsersPage() {
  const { user } = await getUser();
  if (!user) return null;

  await recordActivity({
    userId: user.id,
    action: ACTIONS.ACCESS,
    module: MODULES.USERS,
    description: 'Accessed User Management',
    status: 'success',
  });

  const supabase = await createClient();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let authUsers: Array<{ id: string; email?: string }> = [];

  if (supabaseUrl && serviceRoleKey) {
    try {
      const adminClient = createServerClient(
        supabaseUrl,
        serviceRoleKey,
        { cookies: { getAll: () => [], setAll: () => {} } }
      );
      const authUsersResult = await adminClient.auth.admin.listUsers();
      authUsers = authUsersResult.data?.users ?? [];
    } catch (e) {
      console.error('[AdminUsersPage] Error fetching auth users:', e);
    }
  }

  const profilesResult = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  const profiles = (profilesResult.data ?? []) as Profile[];

  const usersWithEmail = profiles.map((p) => ({
    ...p,
    email: authUsers.find((u) => u.id === p.id)?.email ?? '',
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Users</h2>
        <p className="text-slate-500 text-sm mt-0.5">{profiles.length} total users</p>
      </div>
      <AdminUsersClient users={usersWithEmail} />
    </div>
  );
}
