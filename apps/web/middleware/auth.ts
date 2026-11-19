import { getSupabaseAdminClient } from "@/supabase/admin";
import type { NextRequest } from "next/server";
import { getEnv } from "@/config/env";
import { extractBearerToken } from "@/utils/request";
import { AppError } from "@/utils/errors";

export function requireApiAuth(request: NextRequest): void {
  const env = getEnv();
  const token = extractBearerToken(request);

  const validKeys = [env.WAITLIST_API_KEY, env.API_SECRET].filter(Boolean);

  if (validKeys.length === 0) {
    throw AppError.internal("API authentication is not configured");
  }

  if (!token || !validKeys.includes(token)) {
    throw AppError.unauthorized("Invalid or missing API key");
  }
}

export interface AuthenticatedUser {
  /** profiles.id — the marketplace identity used in foreign keys */
  profileId: string;
  authUserId: string;
  email: string | undefined;
}

/**
 * Verifies a Supabase access token (JWT) sent as `Authorization: Bearer`.
 * Stateless: any API replica can authenticate any request, no sticky sessions.
 */
export async function requireUser(request: NextRequest): Promise<AuthenticatedUser> {
  const token = extractBearerToken(request);
  if (!token) throw AppError.unauthorized("Missing access token");

  const db = getSupabaseAdminClient();
  const { data, error } = await db.auth.getUser(token);
  if (error || !data.user) throw AppError.unauthorized("Invalid or expired access token");

  const { data: profile } = await db
    .from("profiles")
    .select("id")
    .eq("auth_user_id", data.user.id)
    .maybeSingle();

  if (!profile) throw AppError.forbidden("Profile not found for this account");

  return { profileId: profile.id as string, authUserId: data.user.id, email: data.user.email };
}
