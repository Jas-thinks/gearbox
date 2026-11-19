import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_CONFIG } from "@/config/app";
import type { Database } from "./database.types";

let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Returns a singleton Supabase browser client.
 * Safe to call multiple times — returns the same instance.
 */
export function getSupabaseBrowserClient() {
  if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  if (!clientInstance) {
    clientInstance = createBrowserClient<Database>(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey
    );
  }

  return clientInstance;
}
