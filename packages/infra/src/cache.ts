import { getRedis } from "./redis";

const local = new Map<string, { value: string; expiresAt: number }>();
const inflight = new Map<string, Promise<unknown>>();

const MAX_LOCAL_ENTRIES = 1_000;

function jitter(ttlSeconds: number): number {
  // ±10% so keys written together do not all expire together (thundering herd).
  return Math.max(1, Math.round(ttlSeconds * (0.9 + Math.random() * 0.2)));
}

async function read(key: string): Promise<string | null> {
  const redis = getRedis();
  if (redis) {
    try {
      return await redis.get(`c:${key}`);
    } catch {
      /* fall through to local */
    }
  }
  const hit = local.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.value;
  local.delete(key);
  return null;
}

async function write(key: string, value: string, ttlSeconds: number): Promise<void> {
  const ttl = jitter(ttlSeconds);
  const redis = getRedis();
  if (redis) {
    try {
      await redis.set(`c:${key}`, value, "EX", ttl);
      return;
    } catch {
      /* fall through */
    }
  }
  if (local.size >= MAX_LOCAL_ENTRIES) local.delete(local.keys().next().value as string);
  local.set(key, { value, expiresAt: Date.now() + ttl * 1000 });
}

/**
 * Cache-aside with single-flight: N concurrent misses for one key trigger ONE
 * loader call per process (stampede protection), and results are shared across
 * replicas through Redis.
 */
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>
): Promise<T> {
  const hit = await read(key);
  if (hit !== null) return JSON.parse(hit) as T;

  const pending = inflight.get(key) as Promise<T> | undefined;
  if (pending) return pending;

  const promise = (async () => {
    try {
      const value = await loader();
      await write(key, JSON.stringify(value), ttlSeconds);
      return value;
    } finally {
      inflight.delete(key);
    }
  })();
  inflight.set(key, promise);
  return promise;
}

export async function invalidate(...keys: string[]): Promise<void> {
  const redis = getRedis();
  for (const key of keys) {
    local.delete(key);
    if (redis) await redis.del(`c:${key}`).catch(() => undefined);
  }
}

export async function invalidatePrefix(prefix: string): Promise<void> {
  for (const key of local.keys()) if (key.startsWith(prefix)) local.delete(key);
  const redis = getRedis();
  if (!redis) return;
  try {
    let cursor = "0";
    do {
      const [next, keys] = await redis.scan(cursor, "MATCH", `c:${prefix}*`, "COUNT", 100);
      cursor = next;
      if (keys.length) await redis.del(...keys);
    } while (cursor !== "0");
  } catch {
    /* best effort */
  }
}
