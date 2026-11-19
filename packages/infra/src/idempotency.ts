import { getRedis } from "./redis";

const local = new Map<string, { value: string; expiresAt: number }>();

const TTL_SECONDS = 24 * 60 * 60;

export type IdempotencyState<T> =
  | { status: "new" }
  | { status: "in_flight" }
  | { status: "done"; response: T };

/**
 * Claim an idempotency key. Exactly one caller across the whole fleet gets
 * `new`; concurrent duplicates see `in_flight`; later retries get the stored
 * response. (The database also enforces uniqueness, this is the fast path.)
 */
export async function beginIdempotent<T>(scope: string): Promise<IdempotencyState<T>> {
  const key = `idem:${scope}`;
  const redis = getRedis();
  const marker = JSON.stringify({ state: "in_flight" });

  if (redis) {
    try {
      const claimed = await redis.set(key, marker, "EX", 60, "NX");
      if (claimed === "OK") return { status: "new" };
      const raw = await redis.get(key);
      if (!raw) return { status: "new" };
      const parsed = JSON.parse(raw);
      return parsed.state === "done"
        ? { status: "done", response: parsed.response as T }
        : { status: "in_flight" };
    } catch {
      /* fall through to local */
    }
  }

  const hit = local.get(key);
  if (hit && hit.expiresAt > Date.now()) {
    const parsed = JSON.parse(hit.value);
    return parsed.state === "done"
      ? { status: "done", response: parsed.response as T }
      : { status: "in_flight" };
  }
  local.set(key, { value: marker, expiresAt: Date.now() + 60_000 });
  return { status: "new" };
}

export async function completeIdempotent<T>(scope: string, response: T): Promise<void> {
  const key = `idem:${scope}`;
  const value = JSON.stringify({ state: "done", response });
  const redis = getRedis();
  if (redis) {
    try {
      await redis.set(key, value, "EX", TTL_SECONDS);
      return;
    } catch {
      /* fall through */
    }
  }
  local.set(key, { value, expiresAt: Date.now() + TTL_SECONDS * 1000 });
}

export async function abortIdempotent(scope: string): Promise<void> {
  const key = `idem:${scope}`;
  local.delete(key);
  await getRedis()?.del(key).catch(() => undefined);
}
