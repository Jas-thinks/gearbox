import { consume, closeRedis, subscribeLocal } from "@gearbox/infra";
import { logger } from "@gearbox/utils/logger";
import { handleEvent } from "./handlers";
import { runOutboxRelay } from "./outbox-relay";

const controller = new AbortController();

async function shutdown(signal: string) {
  logger.info("worker shutting down", { signal });
  controller.abort();
  setTimeout(() => process.exit(0), 10_000).unref(); // hard stop if drain hangs
}
process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

async function main() {
  logger.info("gearbox worker starting", { sqs: Boolean(process.env.SQS_QUEUE_URL) });

  const relay = runOutboxRelay(controller.signal);

  if (process.env.SQS_QUEUE_URL) {
    await consume({
      signal: controller.signal,
      handler: handleEvent,
      onError: (err, event) =>
        logger.error("event handler failed; message returns to queue", {
          eventId: event?.id,
          error: err instanceof Error ? err.message : String(err),
        }),
    });
  } else {
    // Local dev: no SQS, events flow through the in-process bus.
    subscribeLocal(handleEvent);
    await new Promise<void>((resolve) => controller.signal.addEventListener("abort", () => resolve()));
  }

  await relay;
  await closeRedis();
}

main().catch((err) => {
  logger.error("worker crashed", { error: err instanceof Error ? err.message : String(err) });
  process.exit(1);
});
