import { withApiHandler } from "@/middleware/with-api-handler";
import { CityController } from "@/controllers/city.controller";

export const GET = withApiHandler(CityController.list, {
  rateLimitKey: "cities:list",
  cache: { sMaxAge: 60, staleWhileRevalidate: 300 },
});

export const OPTIONS = withApiHandler(async () => ({ data: null }), {});
