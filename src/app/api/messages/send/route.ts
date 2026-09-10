import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { recordActivity } from '@/lib/activity/logger';
import { ACTIONS, MODULES } from '@/lib/activity/actions';

export async function POST(request: NextRequest) {
  try {
    const { userId, receiverName } = await request.json();
    await recordActivity({
      userId,
      action: ACTIONS.SEND,
      module: MODULES.MESSAGES,
      description: `Sent message to ${receiverName}`,
      status: 'success',
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[messages/send]', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
