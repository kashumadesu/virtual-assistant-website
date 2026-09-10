import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

const DEMO_USERS = [
  {
    email: 'admin@zenva.test',
    password: 'Admin123!',
    full_name: 'Alex Rivera',
    role: 'admin',
  },
  {
    email: 'employee@zenva.test',
    password: 'Employee123!',
    full_name: 'Maria Santos',
    role: 'employee',
  },
  {
    email: 'client@zenva.test',
    password: 'Client123!',
    full_name: 'Juan Cruz',
    role: 'client',
  },
];

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL is missing.' },
      { status: 500 }
    );
  }

  const adminClient = createServerClient(supabaseUrl, serviceRoleKey, {
    cookies: { getAll: () => [], setAll: () => {} },
  });

  const results: Array<{ email: string; status: string; id?: string }> = [];

  for (const user of DEMO_USERS) {
    try {
      // 1. Try to create user
      const { data: createData, error: createError } = await adminClient.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
          role: user.role,
        },
      });

      let userId = createData?.user?.id;

      if (createError) {
        // If already exists, find the user and ensure password and metadata are updated
        const { data: listData } = await adminClient.auth.admin.listUsers();
        const existing = listData?.users?.find((u) => u.email === user.email);

        if (existing) {
          userId = existing.id;
          await adminClient.auth.admin.updateUserById(existing.id, {
            password: user.password,
            email_confirm: true,
            user_metadata: { full_name: user.full_name, role: user.role },
          });
        }
      }

      if (userId) {
        // Ensure profile exists with correct role
        await adminClient.from('profiles').upsert({
          id: userId,
          full_name: user.full_name,
          role: user.role,
          status: 'active',
          updated_at: new Date().toISOString(),
        });

        results.push({ email: user.email, status: 'ready', id: userId });
      } else {
        results.push({ email: user.email, status: 'failed', id: undefined });
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      results.push({ email: user.email, status: `error: ${msg}` });
    }
  }

  return NextResponse.json({
    message: 'Demo accounts provisioned successfully',
    results,
  });
}
