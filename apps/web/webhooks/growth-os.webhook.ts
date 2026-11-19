import { getEnv } from "@/config/env";
import { logger } from "@/utils/logger";
import type { WebhookDispatcher, WebhookPayload } from "@/webhooks/types";

/**
 * Dispatches events to Growth OS when GROWTH_OS_WEBHOOK_URL is configured.
 * Non-blocking — failures are logged but do not break the main request flow.
 */
export class GrowthOsWebhookDispatcher implements WebhookDispatcher {
  async dispatch(payload: WebhookPayload): Promise<void> {
    let webhookUrl: string | undefined;
    let webhookSecret: string | undefined;

    try {
      const env = getEnv();
      webhookUrl = env.GROWTH_OS_WEBHOOK_URL;
      webhookSecret = env.GROWTH_OS_WEBHOOK_SECRET;
    } catch {
      return;
    }

    if (!webhookUrl) return;

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(webhookSecret ? { "X-Webhook-Secret": webhookSecret } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        logger.warn("Growth OS webhook delivery failed", {
          event: payload.event,
          status: response.status,
        });
      }
    } catch (error) {
      logger.error("Growth OS webhook error", {
        event: payload.event,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export const growthOsWebhook = new GrowthOsWebhookDispatcher();
