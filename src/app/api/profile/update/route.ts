import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { recordActivity } from '@/lib/activity/logger';
import { ACTIONS, MODULES } from '@/lib/activity/actions';

export async function POST(request: NextRequest) {
  try {
    const { userId, field } = await request.json();
    await recordActivity({
      userId,
      action: ACTIONS.UPDATE,
      module: MODULES.PROFILE,
      description: `Updated profile: ${field}`,
      status: 'success',
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[profile/update]', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
