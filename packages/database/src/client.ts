import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getEnv } from "@gearbox/config/env";

/**
 * Browser-safe Supabase client using anon key.
 * NEVER use service role key here.
 */
export function createSupabaseBrowserClient(): SupabaseClient {
  const env = getEnv();
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (!browserClient) {
    browserClient = createSupabaseBrowserClient();
  }
  return browserClient;
}
