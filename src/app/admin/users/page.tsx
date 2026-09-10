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

  const adminClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  const [profilesResult, authUsersResult] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    adminClient.auth.admin.listUsers(),
  ]);

  const profiles = (profilesResult.data ?? []) as Profile[];
  const authUsers = authUsersResult.data?.users ?? [];

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
