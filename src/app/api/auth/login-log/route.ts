import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { recordActivity } from '@/lib/activity/logger';
import { ACTIONS, MODULES } from '@/lib/activity/actions';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  try {
    const { userId, email, success } = await request.json();
    const userAgent = request.headers.get('user-agent') ?? undefined;
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? undefined;

    if (success && userId) {
      await recordActivity({
        userId,
        action: ACTIONS.LOGIN,
        module: MODULES.AUTH,
        description: `Successful login`,
        status: 'success',
        ipAddress: ip,
        userAgent,
      });
    } else {
      // For failed logins we can't associate a userId easily.
      // Log against the admin account as a system record.
      const adminClient = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { cookies: { getAll: () => [], setAll: () => {} } }
      );
      const { data } = await adminClient
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1)
        .single();

      if (data?.id) {
        await recordActivity({
          userId: data.id,
          action: ACTIONS.FAILED_LOGIN,
          module: MODULES.AUTH,
          description: `Failed login attempt for ${email}`,
          status: 'failed',
          ipAddress: ip,
          userAgent,
          metadata: { attempted_email: email },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[login-log]', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
