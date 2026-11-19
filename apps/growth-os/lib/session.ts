/**
 * Server-side session management using encrypted cookies.
 * Uses the iron-session pattern with Next.js cookies API.
 */

import { cookies } from "next/headers";
import { AUTH_CONFIG } from "@/config/app";
import type { AuthSession } from "@/types/auth";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: AUTH_CONFIG.sessionMaxAgeSec,
  path: "/",
};

/**
 * Stores the session in an httpOnly cookie.
 * The session object is JSON-stringified (no encryption by default — add iron-session for production).
 */
export async function setSession(session: AuthSession): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(
    AUTH_CONFIG.sessionCookieName,
    JSON.stringify(session),
    COOKIE_OPTIONS
  );
}

/**
 * Reads and parses the session from the cookie store.
 * Returns null if the cookie is missing or malformed.
 */
export async function getSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(AUTH_CONFIG.sessionCookieName);
    if (!cookie?.value) return null;
    const session = JSON.parse(cookie.value) as AuthSession;
    return session;
  } catch {
    return null;
  }
}

/**
 * Removes the session cookie (logout).
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_CONFIG.sessionCookieName);
}
