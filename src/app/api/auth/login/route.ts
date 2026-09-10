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

const DEMO_CREDENTIALS: Record<string, { role: UserRole; name: string }> = {
  'admin@zenva.test': { role: 'admin', name: 'Alex Rivera' },
  'employee@zenva.test': { role: 'employee', name: 'Maria Santos' },
  'client@zenva.test': { role: 'client', name: 'Juan Cruz' },
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const cleanEmail = (email || '').trim().toLowerCase();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const cookieStore = await cookies();
    const userAgent = request.headers.get('user-agent') ?? undefined;
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? undefined;

    // Check if credentials are present
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase credentials are not yet configured in your Vercel Project Settings. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.' },
        { status: 500 }
      );
    }

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

    let authData: { user: { id: string; email?: string } | null } | null = null;

    // 1. Attempt standard signIn
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (!signInError && signInData.user) {
      authData = signInData;
    } else if (serviceRoleKey && DEMO_CREDENTIALS[cleanEmail]) {
      // 2. If it's a demo account and signIn failed, auto-provision or update password via service role!
      try {
        const adminClient = createServerClient(supabaseUrl, serviceRoleKey, {
          cookies: { getAll: () => [], setAll: () => {} },
        });

        const demoMeta = DEMO_CREDENTIALS[cleanEmail];
        let targetId: string | undefined;

        // Check if user already exists in auth.users
        const { data: listData } = await adminClient.auth.admin.listUsers();
        const existing = listData?.users?.find((u) => u.email?.toLowerCase() === cleanEmail);

        if (existing) {
          targetId = existing.id;
          // Update password and confirm email
          await adminClient.auth.admin.updateUserById(existing.id, {
            password,
            email_confirm: true,
            user_metadata: { full_name: demoMeta.name, role: demoMeta.role },
          });
        } else {
          // Create new user
          const { data: newUserData, error: createError } = await adminClient.auth.admin.createUser({
            email: cleanEmail,
            password,
            email_confirm: true,
            user_metadata: { full_name: demoMeta.name, role: demoMeta.role },
          });

          if (!createError && newUserData?.user) {
            targetId = newUserData.user.id;
          }
        }

        if (targetId) {
          // Ensure profile exists in profiles table
          try {
            await adminClient.from('profiles').upsert({
              id: targetId,
              full_name: demoMeta.name,
              role: demoMeta.role,
              status: 'active',
              updated_at: new Date().toISOString(),
            });
          } catch (profileError) {
            console.error('[Profile Upsert Note]:', profileError);
          }

          // Retry signIn now that password/email_confirm are guaranteed
          const retry = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });
          if (retry.data?.user) {
            authData = retry.data;
          }
        }
      } catch (e) {
        console.error('[Auto-provision error]:', e);
      }
    }

    if (!authData || !authData.user) {
      // Log failed attempt safely
      try {
        await recordActivity({
          userId: '00000000-0000-0000-0000-000000000000',
          action: ACTIONS.FAILED_LOGIN,
          module: MODULES.AUTH,
          description: `Failed login attempt for ${cleanEmail}`,
          status: 'failed',
          ipAddress: ip,
          userAgent,
          metadata: { attempted_email: cleanEmail, error: signInError?.message },
        });
      } catch (logErr) {
        console.error('[Activity Log Note]:', logErr);
      }

      return NextResponse.json(
        { error: signInError?.message || 'Invalid email or password. Please verify the account exists in Supabase.' },
        { status: 401 }
      );
    }

    // Log successful login safely
    try {
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
    } catch (actErr) {
      console.error('[Post-login activity note]:', actErr);
    }

    // Fetch user profile to determine role destination
    let role = DEMO_CREDENTIALS[cleanEmail]?.role || 'client';
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profile?.role) {
        role = profile.role as UserRole;
      }
    } catch (profFetchErr) {
      console.error('[Profile fetch note]:', profFetchErr);
    }

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
