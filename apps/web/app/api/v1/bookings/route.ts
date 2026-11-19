import { withApiHandler } from "@/middleware/with-api-handler";
import { BookingController } from "@/controllers/booking.controller";

export const POST = withApiHandler(BookingController.create, {
  rateLimitKey: "bookings:create",
  rateLimit: { max: 10, windowMs: 60_000 },
});
export const GET = withApiHandler(BookingController.listMine, { rateLimitKey: "bookings:list" });
export const OPTIONS = withApiHandler(async () => ({ data: null }), {});
