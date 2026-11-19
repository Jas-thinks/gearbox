import { withApiHandler } from "@/middleware/with-api-handler";
import { WaitlistController } from "@/controllers/waitlist.controller";

export const POST = withApiHandler(WaitlistController.create, {
  rateLimitKey: "waitlist:create",
});

export const GET = withApiHandler(WaitlistController.list, {
  auth: true,
  rateLimitKey: "waitlist:list",
});

export const OPTIONS = withApiHandler(async () => ({ data: null }), {});
