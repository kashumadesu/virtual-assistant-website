import { createClient } from '@/lib/supabase/server';
import { recordActivity } from '@/lib/activity/logger';
import { ACTIONS, MODULES } from '@/lib/activity/actions';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? undefined;
    const userAgent = request.headers.get('user-agent') ?? undefined;
    await recordActivity({
      userId: user.id,
      action: ACTIONS.LOGOUT,
      module: MODULES.AUTH,
      description: 'User logged out',
      status: 'success',
      ipAddress: ip,
      userAgent,
    });
  }

  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/login', request.url));
}
