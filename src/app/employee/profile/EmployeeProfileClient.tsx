'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RoleBadge, UserStatusBadge } from '@/components/ui/StatusBadge';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types';
import { useRouter } from 'next/navigation';

interface Props {
  profile: Profile;
  email: string;
}

export function EmployeeProfileClient({ profile, email }: Props) {
  const [fullName, setFullName] = useState(profile.full_name ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    const supabase = createClient();
    await supabase.from('profiles').update({ full_name: fullName }).eq('id', profile.id);

    await fetch('/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: profile.id, field: 'full_name' }),
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setIsSaving(false);
    router.refresh();
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Profile Card */}
      <Card>
        <CardContent className="p-6 flex flex-col items-center text-center">
          <Avatar name={profile.full_name} size="lg" className="mb-3" />
          <h3 className="font-semibold text-slate-900">{profile.full_name}</h3>
          <p className="text-slate-500 text-sm mb-3">{email}</p>
          <div className="flex items-center gap-2">
            <RoleBadge role={profile.role} />
            <UserStatusBadge status={profile.status} />
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            {saved && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3">
                Profile updated successfully!
              </div>
            )}
            <Input
              id="fullName"
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input
              id="email"
              label="Email Address"
              value={email}
              disabled
              helperText="Email cannot be changed here."
            />
            <Input
              id="role"
              label="Role"
              value={profile.role}
              disabled
              helperText="Role is managed by administrators."
            />
            <Button type="submit" isLoading={isSaving}>
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
