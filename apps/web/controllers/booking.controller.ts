import type { NextRequest } from "next/server";
import { requireUser } from "@/middleware/auth";
import { bookingService } from "@/services/booking.service";
import { AppError } from "@/utils/errors";
import type { RequestContext } from "@/types/database";

export class BookingController {
  static async create(request: NextRequest) {
    const user = await requireUser(request);
    const key = request.headers.get("idempotency-key") ?? undefined;
    if (key && !/^[\w-]{8,128}$/.test(key)) {
      throw AppError.badRequest("Idempotency-Key must be 8-128 chars (letters, digits, _ or -)");
    }
    const { booking, replayed } = await bookingService.create(
      user.profileId,
      await request.json(),
      key
    );
    return { data: { ...booking, replayed }, status: replayed ? 200 : 201 };
  }

  static async listMine(request: NextRequest) {
    const user = await requireUser(request);
    return { data: await bookingService.listMine(user.profileId) };
  }

  static async get(request: NextRequest, _c: RequestContext, params?: Record<string, string>) {
    const user = await requireUser(request);
    if (!params?.id) throw AppError.badRequest("id is required");
    return { data: await bookingService.get(user.profileId, params.id) };
  }

  static async availability(
    request: NextRequest,
    _c: RequestContext,
    params?: Record<string, string>
  ) {
    if (!params?.slug) throw AppError.badRequest("slug is required");
    const query = Object.fromEntries(new URL(request.url).searchParams);
    return { data: await bookingService.availability(params.slug, query) };
  }
}
