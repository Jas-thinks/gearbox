import type { NextRequest } from "next/server";
import type { RequestContext } from "@gearbox/types/database";

const REQUEST_ID_HEADER = "x-request-id";

export function generateRequestId(): string {
  return crypto.randomUUID();
}

export function getRequestId(request: NextRequest): string {
  return request.headers.get(REQUEST_ID_HEADER) ?? generateRequestId();
}

export function buildRequestContext(request: NextRequest, requestId: string): RequestContext {
  const forwarded = request.headers.get("x-forwarded-for");
  const ipAddress = forwarded?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? null;

  return {
    requestId,
    ipAddress,
    userAgent: request.headers.get("user-agent"),
  };
}

export function getClientIp(request: NextRequest): string | null {
  return buildRequestContext(request, "").ipAddress;
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .trim();
}

export function extractBearerToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7).trim();
}

export function getUtmParams(request: NextRequest): {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
} {
  const url = new URL(request.url);
  return {
    utmSource: url.searchParams.get("utm_source") ?? undefined,
    utmMedium: url.searchParams.get("utm_medium") ?? undefined,
    utmCampaign: url.searchParams.get("utm_campaign") ?? undefined,
    referrer: request.headers.get("referer") ?? undefined,
  };
}

export function calculatePagination(
  page: number,
  limit: number,
  total: number
) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export function getPaginationRange(page: number, limit: number) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return { from, to };
}
