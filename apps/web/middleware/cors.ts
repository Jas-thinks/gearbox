import type { NextRequest } from "next/server";
import { getCorsOrigins } from "@/config/env";

export function getCorsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get("origin");
  const allowedOrigins = getCorsOrigins();
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Request-ID",
    "Access-Control-Max-Age": "86400",
  };

  if (origin && (allowedOrigins.length === 0 || allowedOrigins.includes(origin))) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Vary"] = "Origin";
  } else if (allowedOrigins.length === 1) {
    headers["Access-Control-Allow-Origin"] = allowedOrigins[0];
  }

  return headers;
}

export function handleCorsPreflightRequest(request: NextRequest): boolean {
  return request.method === "OPTIONS";
}
