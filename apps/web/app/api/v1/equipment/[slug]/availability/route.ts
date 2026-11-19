import { withApiHandler } from "@/middleware/with-api-handler";
import { BookingController } from "@/controllers/booking.controller";

export const GET = withApiHandler(BookingController.availability, {
  rateLimitKey: "equipment:availability",
});
export const OPTIONS = withApiHandler(async () => ({ data: null }), {});
