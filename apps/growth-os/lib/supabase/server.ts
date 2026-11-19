import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_CONFIG } from "@/config/app";
import type { Database } from "./database.types";

/**
 * Creates a Supabase server client bound to the current request's cookies.
 * Must be called inside a Server Component, Server Action, or Route Handler.
 */
export async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey,
    {
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
            // setAll called from a Server Component — cookies are read-only in RSC.
            // Mutations happen in middleware or route handlers.
          }
        },
      },
    }
  );
}
