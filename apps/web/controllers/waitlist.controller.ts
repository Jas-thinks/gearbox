import type { NextRequest } from "next/server";
import { waitlistService } from "@/services/waitlist.service";
import type { RequestContext } from "@/types/database";
import { getUtmParams } from "@/utils/request";

export class WaitlistController {
  static async create(request: NextRequest, context: RequestContext) {
    const body = await request.json();
    const utm = getUtmParams(request);
    const result = await waitlistService.create(body, context, utm);

    return {
      data: {
        success: true,
        message: result.message,
        entry: {
          id: result.entry.id,
          email: result.entry.email,
          city: result.entry.city,
          role: result.entry.role,
          createdAt: result.entry.created_at,
        },
      },
      status: 201,
    };
  }

  static async list(request: NextRequest) {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const result = await waitlistService.list(params);

    return { data: result };
  }
}
