import { getRedis } from "./redis";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Atomic fixed-window counter. INCR + PEXPIRE run in one Lua call so a crash
 * between the two can never leave an immortal key.
 */
const LUA = `
local c = redis.call('INCR', KEYS[1])
if c == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
return {c, redis.call('PTTL', KEYS[1])}
`;

const memory = new Map<string, { count: number; resetAt: number }>();

function memoryLimit(key: string, max: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || now > entry.resetAt) {
    memory.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1, resetAt: now + windowMs };
  }
  entry.count += 1;
  return {
    allowed: entry.count <= max,
    remaining: Math.max(0, max - entry.count),
    resetAt: entry.resetAt,
  };
}

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of memory) if (now > v.resetAt) memory.delete(k);
  }, 60_000).unref?.();
}

/**
 * Distributed rate limiter. All API replicas share one counter via Redis.
 * Fails OPEN to the local limiter if Redis is unreachable: availability beats
 * strictness for a public marketplace, and WAF still sits in front.
 */
export async function rateLimit(
  key: string,
  max: number,
  windowMs: number
): Promise<RateLimitResult> {
  const redis = getRedis();
  if (!redis) return memoryLimit(key, max, windowMs);

  try {
    const [count, ttl] = (await redis.eval(LUA, 1, `rl:${key}`, windowMs)) as [number, number];
    return {
      allowed: count <= max,
      remaining: Math.max(0, max - count),
      resetAt: Date.now() + Math.max(ttl, 0),
    };
  } catch {
    return memoryLimit(key, max, windowMs);
  }
}
