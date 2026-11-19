import { rateLimit, type RateLimitResult } from "@gearbox/infra";
import { getEnv } from "@/config/env";

/**
 * Distributed rate limiter (Redis-backed, in-memory fallback).
 * See @gearbox/infra for the algorithm and failure semantics.
 */
export async function checkRateLimit(
  key: string,
  maxRequests?: number,
  windowMs?: number
): Promise<RateLimitResult> {
  const env = getEnv();
  return rateLimit(
    key,
    maxRequests ?? env.RATE_LIMIT_MAX_REQUESTS,
    windowMs ?? env.RATE_LIMIT_WINDOW_MS
  );
}
