import { withApiHandler } from "@/middleware/with-api-handler";
import { ContactController } from "@/controllers/contact.controller";

export const POST = withApiHandler(ContactController.create, {
  rateLimitKey: "contact:create",
});

export const OPTIONS = withApiHandler(async () => ({ data: null }), {});
