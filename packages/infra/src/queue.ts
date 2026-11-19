import {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  type Message,
} from "@aws-sdk/client-sqs";

export interface DomainEvent {
  /** Stable unique id — consumers use it to de-duplicate (SQS is at-least-once). */
  id: string;
  type: string;
  occurredAt: string;
  payload: Record<string, unknown>;
}

export interface EventPublisher {
  publish(event: DomainEvent): Promise<void>;
}

let sqs: SQSClient | null = null;
function client(): SQSClient {
  if (!sqs) sqs = new SQSClient({ region: process.env.AWS_REGION ?? "ap-south-1" });
  return sqs;
}

/** In-process bus used when SQS_QUEUE_URL is not set (local dev, tests). */
const localSubscribers: Array<(e: DomainEvent) => Promise<void>> = [];
export function subscribeLocal(fn: (e: DomainEvent) => Promise<void>): void {
  localSubscribers.push(fn);
}

export const publisher: EventPublisher = {
  async publish(event) {
    const url = process.env.SQS_QUEUE_URL;
    if (!url) {
      await Promise.allSettled(localSubscribers.map((fn) => fn(event)));
      return;
    }
    await client().send(
      new SendMessageCommand({
        QueueUrl: url,
        MessageBody: JSON.stringify(event),
        MessageAttributes: {
          eventType: { DataType: "String", StringValue: event.type },
        },
      })
    );
  },
};

export interface ConsumerOptions {
  handler: (event: DomainEvent) => Promise<void>;
  signal: AbortSignal;
  onError?: (err: unknown, event?: DomainEvent) => void;
}

/**
 * Long-polling SQS consumer. A message is deleted ONLY after the handler
 * succeeds; failures return to the queue and, after maxReceiveCount, land in
 * the dead-letter queue (configured in Terraform).
 */
export async function consume({ handler, signal, onError }: ConsumerOptions): Promise<void> {
  const url = process.env.SQS_QUEUE_URL;
  if (!url) throw new Error("SQS_QUEUE_URL is required to run the consumer");

  while (!signal.aborted) {
    let messages: Message[] = [];
    try {
      const res = await client().send(
        new ReceiveMessageCommand({
          QueueUrl: url,
          MaxNumberOfMessages: 10,
          WaitTimeSeconds: 20,
          VisibilityTimeout: 60,
        }),
        { abortSignal: signal }
      );
      messages = res.Messages ?? [];
    } catch (err) {
      if (signal.aborted) return;
      onError?.(err);
      await new Promise((r) => setTimeout(r, 2_000));
      continue;
    }

    await Promise.all(
      messages.map(async (msg) => {
        let event: DomainEvent | undefined;
        try {
          event = JSON.parse(msg.Body ?? "") as DomainEvent;
          await handler(event);
          await client().send(
            new DeleteMessageCommand({ QueueUrl: url, ReceiptHandle: msg.ReceiptHandle })
          );
        } catch (err) {
          onError?.(err, event); // leave on queue → retry → DLQ
        }
      })
    );
  }
}
