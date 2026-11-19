import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getEnv } from "@gearbox/config/env";

/**
 * Admin Supabase client using service role key.
 * BYPASSES RLS — server-side only. NEVER expose to client.
 */
export function createSupabaseAdminClient(): SupabaseClient {
  const env = getEnv();
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient {
  if (!adminClient) {
    adminClient = createSupabaseAdminClient();
  }
  return adminClient;
}

/** Reset client — useful for testing */
export function resetSupabaseAdminClient(): void {
  adminClient = null;
}
