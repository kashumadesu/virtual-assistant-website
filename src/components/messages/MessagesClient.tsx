'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { RoleBadge } from '@/components/ui/StatusBadge';
import { formatDateTime } from '@/utils/format';
import { createClient } from '@/lib/supabase/client';
import type { Message, Profile } from '@/types';
import { Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  messages: (Message & { sender: Profile; receiver: Profile })[];
  contacts: Profile[];
  currentUserId: string;
}

export function MessagesClient({ messages, contacts, currentUserId }: Props) {
  const [content, setContent] = useState('');
  const [receiverId, setReceiverId] = useState(contacts[0]?.id ?? '');
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !receiverId) return;
    setIsSending(true);

    const supabase = createClient();
    const { error } = await supabase.from('messages').insert({
      sender_id: currentUserId,
      receiver_id: receiverId,
      content: content.trim(),
    });

    if (!error) {
      const receiver = contacts.find((c) => c.id === receiverId);
      await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          receiverName: receiver?.full_name ?? 'User',
        }),
      });
      setContent('');
      router.refresh();
    }
    setIsSending(false);
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Message Thread */}
      <Card className="lg:col-span-3">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Conversation</h3>
        </div>
        <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
          {messages.length === 0 && (
            <div className="px-6 py-8 text-center text-slate-400 text-sm">No messages yet</div>
          )}
          {[...messages].reverse().map((msg) => {
            const isOwn = msg.sender_id === currentUserId;
            return (
              <div key={msg.id} className={`px-6 py-4 ${isOwn ? 'bg-teal-50' : ''}`}>
                <div className="flex items-start gap-3">
                  <Avatar name={msg.sender?.full_name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-900">
                        {isOwn ? 'You' : msg.sender?.full_name}
                      </span>
                      <span className="text-xs text-slate-400">{formatDateTime(msg.created_at)}</span>
                    </div>
                    <p className="text-sm text-slate-700">{msg.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Send Message */}
      <Card className="lg:col-span-2">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Send Message</h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
              <select
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name} ({c.role})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                placeholder="Type your message..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>
            <Button type="submit" className="w-full" isLoading={isSending}>
              <Send className="h-4 w-4" />
              Send Message
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
