import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_CONFIG } from "@/config/app";

const PUBLIC_PATHS = [
  AUTH_CONFIG.adminPath,
  "/api/waitlist", // public waitlist API
  "/favicon.ico",
  "/_next",
  "/images",
];

/**
 * Middleware runs on every request before the page renders.
 * Protects all dashboard routes behind session authentication.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths without authentication
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Protect all non-public routes
  if (!pathname.startsWith("/api")) {
    const session = request.cookies.get(AUTH_CONFIG.sessionCookieName);

    if (!session?.value) {
      const loginUrl = new URL(AUTH_CONFIG.adminPath, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const parsed = JSON.parse(session.value);
      if (!parsed?.expiresAt || Date.now() > parsed.expiresAt) {
        const loginUrl = new URL(AUTH_CONFIG.adminPath, request.url);
        loginUrl.searchParams.set("expired", "1");
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete(AUTH_CONFIG.sessionCookieName);
        return response;
      }
    } catch {
      const loginUrl = new URL(AUTH_CONFIG.adminPath, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
