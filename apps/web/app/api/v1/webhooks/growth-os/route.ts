import type { NextRequest } from "next/server";
import { withApiHandler } from "@/middleware/with-api-handler";
import { getEnv } from "@/config/env";
import { extractBearerToken } from "@/utils/request";
import { AppError } from "@/utils/errors";
import type { WebhookPayload } from "@/webhooks/types";

async function handleWebhook(request: NextRequest) {
  const env = getEnv();
  const secret = env.GROWTH_OS_WEBHOOK_SECRET;
  const token = extractBearerToken(request);

  if (secret && token !== secret && request.headers.get("x-webhook-secret") !== secret) {
    throw AppError.unauthorized("Invalid webhook secret");
  }

  const body = (await request.json()) as WebhookPayload;

  return {
    data: {
      received: true,
      event: body.event,
      message: "Webhook endpoint ready — Growth OS integration pending",
    },
  };
}

export const POST = withApiHandler(handleWebhook, {
  rateLimitKey: "webhooks:growth-os",
});

export const GET = withApiHandler(async () => ({
  data: {
    endpoint: "/api/webhooks/growth-os",
    status: "ready",
    events: ["waitlist.signup", "contact.message", "equipment.updated"],
  },
}), { rateLimitKey: "webhooks:growth-os" });

export const OPTIONS = withApiHandler(async () => ({ data: null }), {});
