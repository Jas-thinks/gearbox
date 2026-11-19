import { withApiHandler } from "@/middleware/with-api-handler";
import { HealthController } from "@/controllers/health.controller";

export const GET = withApiHandler(HealthController.check, {
  rateLimitKey: "health",
});

export const OPTIONS = withApiHandler(async () => ({ data: null }), {});
