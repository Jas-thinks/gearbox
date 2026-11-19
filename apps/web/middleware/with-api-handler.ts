import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getCorsHeaders, handleCorsPreflightRequest } from "@/middleware/cors";
import { getSecurityHeaders } from "@/middleware/security-headers";
import { checkRateLimit } from "@/middleware/rate-limit";
import { requireApiAuth } from "@/middleware/auth";
import { AppError, errorResponse, successResponse } from "@/utils/errors";
import { logger } from "@/utils/logger";
import {
  buildRequestContext,
  generateRequestId,
  getClientIp,
} from "@/utils/request";
import type { RequestContext } from "@/types/database";

export interface ApiHandlerOptions {
  /** Require Bearer token auth (WAITLIST_API_KEY or API_SECRET) */
  auth?: boolean;
  /** Custom rate limit key prefix */
  rateLimitKey?: string;
  /** Public CDN caching for idempotent GETs, e.g. { sMaxAge: 60, staleWhileRevalidate: 300 } */
  cache?: { sMaxAge: number; staleWhileRevalidate?: number };
  /** Override the default limit for sensitive/expensive routes */
  rateLimit?: { max: number; windowMs: number };
}

type ApiHandler = (
  request: NextRequest,
  context: RequestContext,
  params?: Record<string, string>
) => Promise<{ data: unknown; status?: number }>;

function applyHeaders(response: NextResponse, request: NextRequest, requestId: string): NextResponse {
  const headers = {
    ...getSecurityHeaders(),
    ...getCorsHeaders(request),
    "X-Request-ID": requestId,
  };

  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }

  return response;
}

export function withApiHandler(
  handler: ApiHandler,
  options: ApiHandlerOptions = {}
) {
  return async (
    request: NextRequest,
    routeContext?: { params: Promise<Record<string, string>> }
  ): Promise<NextResponse> => {
    const requestId = request.headers.get("x-request-id") ?? generateRequestId();
    const path = new URL(request.url).pathname;

    if (handleCorsPreflightRequest(request)) {
      const response = new NextResponse(null, { status: 204 });
      return applyHeaders(response, request, requestId);
    }

    try {
      logger.apiCall(request.method, path, requestId, {
        ip: getClientIp(request),
      });

      const rateLimitKey = `${options.rateLimitKey ?? path}:${getClientIp(request) ?? "unknown"}`;
      const rateLimit = await checkRateLimit(rateLimitKey, options.rateLimit?.max, options.rateLimit?.windowMs);

      if (!rateLimit.allowed) {
        throw AppError.tooManyRequests("Rate limit exceeded. Please try again later.");
      }

      if (options.auth) {
        requireApiAuth(request);
      }

      const context = buildRequestContext(request, requestId);
      const params = routeContext?.params ? await routeContext.params : undefined;

      const { data, status = 200 } = await handler(request, context, params);

      const response = successResponse(data, requestId, status);
      response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
      response.headers.set("X-RateLimit-Reset", String(rateLimit.resetAt));

      if (options.cache && request.method === "GET") {
        const { sMaxAge, staleWhileRevalidate = 0 } = options.cache;
        response.headers.set(
          "Cache-Control",
          `public, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`
        );
      }

      return applyHeaders(response, request, requestId);
    } catch (error) {
      if (!(error instanceof AppError) && !(error instanceof ZodError)) {
        logger.error("Unhandled API error", {
          requestId,
          path,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }

      const response = errorResponse(
        error instanceof Error ? error : new Error("Unknown error"),
        requestId
      );

      return applyHeaders(response, request, requestId);
    }
  };
}
