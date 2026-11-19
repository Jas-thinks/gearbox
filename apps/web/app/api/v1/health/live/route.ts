import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Liveness: process is up. No dependencies — ALB/ECS use this to restart tasks. */
export function GET() {
  return NextResponse.json({ status: "alive" });
}
