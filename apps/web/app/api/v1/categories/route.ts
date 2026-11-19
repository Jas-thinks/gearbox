import { withApiHandler } from "@/middleware/with-api-handler";
import { CategoryController } from "@/controllers/category.controller";

export const GET = withApiHandler(CategoryController.list, {
  rateLimitKey: "categories:list",
  cache: { sMaxAge: 60, staleWhileRevalidate: 300 },
});

export const OPTIONS = withApiHandler(async () => ({ data: null }), {});
