import { createClient } from '@/lib/supabase/server';
import type { Profile, UserRole } from '@/types';

export async function getUser(): Promise<{
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { user: null, profile: null };

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Fallback profile if row is not created yet
    const fallbackProfile: Profile = profile || {
      id: user.id,
      full_name: (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'User',
      role: ((user.user_metadata?.role as UserRole) || 'client'),
      avatar_url: null,
      status: 'active',
      last_active_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return { user: { id: user.id, email: user.email }, profile: fallbackProfile };
  } catch (error: unknown) {
    // Next.js dynamic server usage error must be rethrown so App Router opts into dynamic SSR
    if (error && typeof error === 'object' && 'digest' in error && (error as { digest?: string }).digest === 'DYNAMIC_SERVER_USAGE') {
      throw error;
    }
    console.error('[getUser error]:', error);
    return { user: null, profile: null };
  }
}
