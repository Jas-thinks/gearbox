import type { NextRequest } from "next/server";
import { contactService } from "@/services/contact.service";
import type { RequestContext } from "@/types/database";

export class ContactController {
  static async create(request: NextRequest, context: RequestContext) {
    const body = await request.json();
    const result = await contactService.create(body, context);

    return {
      data: {
        success: true,
        message: result.confirmation,
        id: result.message.id,
      },
      status: 201,
    };
  }
}
