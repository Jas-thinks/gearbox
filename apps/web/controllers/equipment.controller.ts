import type { NextRequest } from "next/server";
import { equipmentService } from "@/services/equipment.service";
import type { RequestContext } from "@/types/database";
import { AppError } from "@/utils/errors";

export class EquipmentController {
  static async list(request: NextRequest) {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const result = await equipmentService.list(params);

    return { data: result };
  }

  static async getBySlug(
    _request: NextRequest,
    _context: RequestContext,
    params?: Record<string, string>
  ) {
    const slug = params?.slug;
    if (!slug) {
      throw AppError.badRequest("Slug parameter is required");
    }

    const equipment = await equipmentService.getBySlug(slug);
    return { data: equipment };
  }
}
