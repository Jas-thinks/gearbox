import { withApiHandler } from "@/middleware/with-api-handler";
import { EquipmentController } from "@/controllers/equipment.controller";

export const GET = withApiHandler(EquipmentController.list, {
  rateLimitKey: "equipment:list",
  cache: { sMaxAge: 60, staleWhileRevalidate: 300 },
});

export const OPTIONS = withApiHandler(async () => ({ data: null }), {});
