import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { recordActivity } from '@/lib/activity/logger';
import { ACTIONS, MODULES } from '@/lib/activity/actions';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.redirect(new URL('/login', request.url));

    const formData = await request.formData();
    const fileName = formData.get('fileName') as string;
    const fileId = formData.get('fileId') as string;

    await recordActivity({
      userId: user.id,
      action: ACTIONS.ACCESS,
      module: MODULES.FILES,
      description: `Opened "${fileName}"`,
      status: 'success',
      metadata: { fileId, fileName },
    });

    // In POC, redirect back. In production this would generate a signed URL.
    const referer = request.headers.get('referer') ?? '/';
    return NextResponse.redirect(referer);
  } catch (error) {
    console.error('[files/access]', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
