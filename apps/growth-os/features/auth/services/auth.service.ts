/**
 * Authentication Service.
 *
 * Currently uses environment-variable credentials for a simple admin login.
 * Designed for easy replacement with Supabase Auth, NextAuth, or any
 * identity provider — just swap this service without touching the UI.
 */

import { AUTH_CONFIG } from "@/config/app";
import type { AuthResult, AuthSession, AdminUser, LoginInput } from "@/types/auth";
import { logError } from "@/utils/error";

/**
 * Returns the configured admin user from environment variables.
 * In future, this queries a users table or an identity provider.
 */
function getAdminCredentials(): { email: string; password: string } | null {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    logError("ADMIN_EMAIL or ADMIN_PASSWORD environment variables are not set.");
    return null;
  }

  return { email, password };
}

/**
 * Validates login credentials against environment variables.
 * Replace this function body to swap auth providers.
 */
export async function validateAdminCredentials(
  input: LoginInput
): Promise<AuthResult> {
  const credentials = getAdminCredentials();

  if (!credentials) {
    return {
      success: false,
      error:
        "Authentication is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD.",
    };
  }

  const emailMatch = input.email.toLowerCase() === credentials.email.toLowerCase();
  const passwordMatch = input.password === credentials.password;

  if (!emailMatch || !passwordMatch) {
    return { success: false, error: "Invalid email or password." };
  }

  const user: AdminUser = {
    id: "admin-001",
    email: credentials.email,
    name: process.env.ADMIN_NAME ?? "Admin",
    role: "super_admin",
  };

  const session: AuthSession = {
    user,
    expiresAt: Date.now() + AUTH_CONFIG.sessionMaxAgeSec * 1000,
  };

  return { success: true, session };
}

/**
 * Validates an existing session object.
 * Returns false if the session is expired or malformed.
 */
export function isSessionValid(session: AuthSession | null | undefined): boolean {
  if (!session) return false;
  if (!session.user || !session.expiresAt) return false;
  return Date.now() < session.expiresAt;
}
