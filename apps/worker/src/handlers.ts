import { getRedis, type DomainEvent } from "@gearbox/infra";
import { getSupabaseAdminClient } from "@gearbox/database/admin";
import { logger } from "@gearbox/utils/logger";

type Handler = (event: DomainEvent) => Promise<void>;

/**
 * Consumer-side de-duplication. SQS + the outbox are at-least-once, so every
 * handler must be idempotent; this guard makes that cheap.
 */
async function firstDelivery(eventId: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return true; // handlers below are also idempotent by design
  const ok = await redis.set(`evt:${eventId}`, "1", "EX", 7 * 24 * 3600, "NX");
  return ok === "OK";
}

const handlers: Record<string, Handler> = {
  "booking.created": async (event) => {
    const { bookingId, ownerId, renterId, startDate, endDate } = event.payload as Record<
      string,
      string
    >;
    const db = getSupabaseAdminClient();

    const rows = [
      ownerId && {
        profile_id: ownerId,
        type: "booking.request",
        title: "New booking request",
        body: `Someone wants to rent your gear from ${startDate} to ${endDate}.`,
        metadata: { bookingId, eventId: event.id },
      },
      renterId && {
        profile_id: renterId,
        type: "booking.created",
        title: "Booking request sent",
        body: `We've notified the owner. Dates: ${startDate} → ${endDate}.`,
        metadata: { bookingId, eventId: event.id },
      },
    ].filter(Boolean);

    if (rows.length) {
      const { error } = await db.from("notifications").insert(rows);
      if (error) throw error;
    }
    // Next: email provider + push + Growth OS webhook fan-out.
  },
};

export async function handleEvent(event: DomainEvent): Promise<void> {
  const handler = handlers[event.type];
  if (!handler) {
    logger.warn("no handler for event type", { type: event.type, id: event.id });
    return;
  }
  if (!(await firstDelivery(event.id))) {
    logger.info("duplicate event skipped", { id: event.id });
    return;
  }
  await handler(event);
  logger.info("event handled", { type: event.type, id: event.id });
}
