import { createServerClient } from '@supabase/ssr';
import type { ActivityAction, ActivityModule, ActivityStatus } from '@/types';

interface RecordActivityParams {
  userId: string;
  action: ActivityAction;
  module: ActivityModule;
  description: string;
  status?: ActivityStatus;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Centralized activity logger — uses the service-role key so records
 * are written server-side only and can never be forged or deleted by users.
 *
 * IMPORTANT: Call this only from Server Actions, Route Handlers, or
 * Server Components — never from client components.
 */
export async function recordActivity({
  userId,
  action,
  module,
  description,
  status = 'success',
  ipAddress,
  userAgent,
  metadata,
}: RecordActivityParams): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return;
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      serviceRoleKey,
      {
        cookies: {
          getAll: () => [],
          setAll: () => {},
        },
      }
    );

    await supabase.from('activity_logs').insert({
      user_id: userId,
      action,
      module,
      description,
      status,
      ip_address: ipAddress ?? null,
      user_agent: userAgent ?? null,
      metadata: metadata ?? null,
    });
  } catch (error) {
    // Never throw — logging should never break the main user flow.
    console.error('[ActivityLogger] Failed to record activity:', error);
  }
}
