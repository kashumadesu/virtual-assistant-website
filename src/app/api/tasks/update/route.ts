import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { recordActivity } from '@/lib/activity/logger';
import { ACTIONS, MODULES } from '@/lib/activity/actions';

export async function POST(request: NextRequest) {
  try {
    const { taskId, taskTitle, newStatus, userId } = await request.json();
    await recordActivity({
      userId,
      action: ACTIONS.UPDATE,
      module: MODULES.TASKS,
      description: `Updated task "${taskTitle}" to ${newStatus.replace('_', ' ')}`,
      status: 'success',
      metadata: { taskId, newStatus },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[tasks/update]', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
