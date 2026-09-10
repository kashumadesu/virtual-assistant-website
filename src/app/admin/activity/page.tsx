import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth/get-user';
import { ActivityLogsClient } from './ActivityLogsClient';
import type { ActivityLog, Profile } from '@/types';

export default async function AdminActivityPage() {
  const { user } = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from('activity_logs')
    .select('*, profile:profiles(id, full_name, role, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(500);

  const logs = (data ?? []) as (ActivityLog & { profile: Profile })[];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Activity Logs</h2>
        <p className="text-slate-500 text-sm mt-0.5">Complete audit trail of all system activity</p>
      </div>
      <ActivityLogsClient logs={logs} />
    </div>
  );
}
