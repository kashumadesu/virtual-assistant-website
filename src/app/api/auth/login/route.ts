import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { recordActivity } from '@/lib/activity/logger';
import { ACTIONS, MODULES } from '@/lib/activity/actions';
import type { UserRole } from '@/types';

const ROLE_REDIRECTS: Record<UserRole, string> = {
  admin: '/admin/dashboard',
  employee: '/employee/dashboard',
  client: '/client/dashboard',
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const cleanEmail = (email || '').trim();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase credentials are not configured on Vercel yet. Please check your project settings.' },
        { status: 500 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored if called in context where cookies cannot be set
          }
        },
      },
    });

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    const userAgent = request.headers.get('user-agent') ?? undefined;
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? undefined;

    if (authError || !authData.user) {
      // Log failed attempt
      await recordActivity({
        userId: '00000000-0000-0000-0000-000000000000',
        action: ACTIONS.FAILED_LOGIN,
        module: MODULES.AUTH,
        description: `Failed login attempt for ${cleanEmail}`,
        status: 'failed',
        ipAddress: ip,
        userAgent,
        metadata: { attempted_email: cleanEmail, error: authError?.message },
      });

      return NextResponse.json(
        { error: authError?.message || 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Log successful login
    await recordActivity({
      userId: authData.user.id,
      action: ACTIONS.LOGIN,
      module: MODULES.AUTH,
      description: 'Successful login',
      status: 'success',
      ipAddress: ip,
      userAgent,
    });

    // Update last_active_at on profile
    await supabase
      .from('profiles')
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', authData.user.id);

    // Fetch user profile to determine role destination
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    const role = (profile?.role as UserRole) || 'client';
    const redirectUrl = ROLE_REDIRECTS[role] || '/client/dashboard';

    return NextResponse.json({
      success: true,
      redirectUrl,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected server error occurred';
    console.error('[Login Route Error]:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
