import { getSupabaseAdminClient } from "@gearbox/database/admin";
import { publisher, type DomainEvent } from "@gearbox/infra";
import { logger } from "@gearbox/utils/logger";

interface OutboxRow {
  id: number;
  aggregate_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  created_at: string;
}

/**
 * Transactional-outbox relay. Rows are claimed with FOR UPDATE SKIP LOCKED, so
 * any number of worker replicas can run this loop concurrently without
 * publishing the same row twice (and if they do, consumers de-duplicate on id).
 */
export async function runOutboxRelay(signal: AbortSignal, intervalMs = 1_000): Promise<void> {
  const db = getSupabaseAdminClient();

  while (!signal.aborted) {
    let drained = 0;
    try {
      const { data, error } = await db.rpc("claim_outbox_events", { batch_size: 25 });
      if (error) throw error;

      for (const row of (data ?? []) as OutboxRow[]) {
        const event: DomainEvent = {
          id: `outbox-${row.id}`,
          type: row.event_type,
          occurredAt: row.created_at,
          payload: row.payload,
        };
        try {
          await publisher.publish(event);
          await db
            .from("outbox_events")
            .update({ status: "published", published_at: new Date().toISOString() })
            .eq("id", row.id);
          drained++;
        } catch (err) {
          // Lease from claim_outbox_events expires → row is retried automatically.
          logger.warn("outbox publish failed; will retry", {
            outboxId: row.id,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
    } catch (err) {
      logger.error("outbox relay iteration failed", {
        error: err instanceof Error ? err.message : String(err),
      });
    }

    if (drained === 0) await new Promise((r) => setTimeout(r, intervalMs));
  }
}
