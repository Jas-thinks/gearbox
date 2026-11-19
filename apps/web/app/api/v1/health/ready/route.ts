import { NextResponse } from "next/server";
import { pingRedis } from "@gearbox/infra";
import { getSupabaseAdminClient } from "@/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * Readiness: can this replica serve traffic? Checks Postgres (hard dependency).
 * Redis is a soft dependency (we fail open), so it is reported but never fails
 * the probe — a cache outage must not take the fleet out of rotation.
 */
export async function GET() {
  const started = Date.now();
  let database: "up" | "down" = "up";
  try {
    const { error } = await getSupabaseAdminClient().from("categories").select("id").limit(1);
    if (error) database = "down";
  } catch {
    database = "down";
  }
  const redis = await pingRedis();
  const ready = database === "up";
  return NextResponse.json(
    { status: ready ? "ready" : "unavailable", database, redis, latencyMs: Date.now() - started },
    { status: ready ? 200 : 503 }
  );
}
