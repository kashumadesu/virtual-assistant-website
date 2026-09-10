import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth/get-user';
import { recordActivity } from '@/lib/activity/logger';
import { ACTIONS, MODULES } from '@/lib/activity/actions';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { formatDateTime } from '@/utils/format';
import { MessagesClient } from '@/components/messages/MessagesClient';
import type { Message, Profile } from '@/types';

export default async function EmployeeMessagesPage() {
  const { user } = await getUser();
  if (!user) return null;

  await recordActivity({
    userId: user.id,
    action: ACTIONS.VIEW,
    module: MODULES.MESSAGES,
    description: 'Viewed messages',
    status: 'success',
  });

  const supabase = await createClient();
  const { data } = await supabase
    .from('messages')
    .select('*, sender:profiles!messages_sender_id_fkey(id, full_name, role, avatar_url), receiver:profiles!messages_receiver_id_fkey(id, full_name, role, avatar_url)')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
    .limit(50);

  // Fetch profiles to send to
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('id, full_name, role, avatar_url')
    .neq('id', user.id);

  const messages = (data ?? []) as (Message & { sender: Profile; receiver: Profile })[];
  const contacts = (allProfiles ?? []) as Profile[];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Messages</h2>
        <p className="text-slate-500 text-sm mt-0.5">Your conversation history</p>
      </div>
      <MessagesClient messages={messages} contacts={contacts} currentUserId={user.id} />
    </div>
  );
}
