import { NextRequest, NextResponse } from "next/server";
import { WaitlistSignupSchema } from "@/schemas/waitlist.schema";
import {
  createWaitlistEntry,
  findWaitlistByEmail,
} from "@/repositories/waitlist/waitlist.repository";
import { getErrorMessage, logError } from "@/utils/error";

/**
 * POST /api/waitlist
 * Public endpoint — no authentication required.
 * Called from the Gearbox website signup form.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = WaitlistSignupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 422 }
      );
    }

    // Duplicate check
    const existing = await findWaitlistByEmail(parsed.data.email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: "This email is already on the waitlist." },
        { status: 409 }
      );
    }

    // Extract UTM from query string
    const url = new URL(request.url);
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

    const entry = await createWaitlistEntry({
      ...parsed.data,
      ip_address: ip,
      referrer: request.headers.get("referer"),
      utm_source: url.searchParams.get("utm_source"),
      utm_medium: url.searchParams.get("utm_medium"),
      utm_campaign: url.searchParams.get("utm_campaign"),
    });

    return NextResponse.json(
      { success: true, data: { id: entry.id }, message: "You've been added to the waitlist!" },
      { status: 201 }
    );
  } catch (error) {
    logError(error, { context: "POST /api/waitlist" });
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/waitlist — returns count of pending entries (public stats endpoint)
 */
export async function GET() {
  try {
    const { countWaitlistPending } = await import(
      "@/repositories/waitlist/waitlist.repository"
    );
    const count = await countWaitlistPending();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
