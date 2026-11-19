export type WebhookEventType =
  | "waitlist.signup"
  | "contact.message"
  | "equipment.updated";

export interface WebhookPayload {
  event: WebhookEventType;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface WebhookDispatcher {
  dispatch(payload: WebhookPayload): Promise<void>;
}
