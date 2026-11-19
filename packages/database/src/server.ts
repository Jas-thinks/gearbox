import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getEnv } from "@gearbox/config/env";

/**
 * Server-side Supabase client using anon key.
 * Respects RLS policies — use for public read operations.
 */
export function createSupabaseServerClient(): SupabaseClient {
  const env = getEnv();
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

let serverClient: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient {
  if (!serverClient) {
    serverClient = createSupabaseServerClient();
  }
  return serverClient;
}
