import Redis from "ioredis";

let client: Redis | null = null;
let disabled = false;

/**
 * Shared Redis connection (ElastiCache in production).
 *
 * Returns `null` when REDIS_URL is not configured so every consumer degrades to a
 * per-process in-memory implementation. Local dev and CI work with zero infra;
 * production gets cluster-wide correctness.
 */
export function getRedis(): Redis | null {
  if (disabled) return null;
  const url = process.env.REDIS_URL;
  if (!url) return null;

  if (!client) {
    client = new Redis(url, {
      maxRetriesPerRequest: 2,
      enableOfflineQueue: false,
      connectTimeout: 2_000,
      lazyConnect: false,
      tls: url.startsWith("rediss://") ? {} : undefined,
    });
    client.on("error", () => {
      /* swallow: callers fail open via try/catch; health endpoint reports it */
    });
  }
  return client;
}

export async function pingRedis(): Promise<"up" | "down" | "disabled"> {
  const redis = getRedis();
  if (!redis) return "disabled";
  try {
    return (await redis.ping()) === "PONG" ? "up" : "down";
  } catch {
    return "down";
  }
}

export async function closeRedis(): Promise<void> {
  disabled = true;
  if (client) await client.quit().catch(() => undefined);
  client = null;
}
