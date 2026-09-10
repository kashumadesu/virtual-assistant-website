import { getUser } from '@/lib/auth/get-user';
import { recordActivity } from '@/lib/activity/logger';
import { ACTIONS, MODULES } from '@/lib/activity/actions';
import { EmployeeProfileClient } from '@/app/employee/profile/EmployeeProfileClient';

export default async function ClientProfilePage() {
  const { user, profile } = await getUser();
  if (!user || !profile) return null;

  await recordActivity({
    userId: user.id,
    action: ACTIONS.VIEW,
    module: MODULES.PROFILE,
    description: 'Viewed profile',
    status: 'success',
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
        <p className="text-slate-500 text-sm mt-0.5">Manage your account information</p>
      </div>
      <EmployeeProfileClient profile={profile} email={user.email ?? ''} />
    </div>
  );
}
