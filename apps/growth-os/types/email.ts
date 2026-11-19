import type { ID, ISODateString, Timestamps } from "./common";

export type EmailStatus =
  | "draft"
  | "queued"
  | "approved"
  | "sent"
  | "delivered"
  | "opened"
  | "clicked"
  | "replied"
  | "bounced"
  | "failed"
  | "unsubscribed";

export type EmailProvider = "smtp" | "resend" | "ses" | "postmark" | "mailgun";

export interface EmailLog extends Timestamps {
  id: ID;
  lead_id: ID;
  campaign_id: ID | null;
  template_id: ID | null;

  to_email: string;
  to_name: string | null;
  from_email: string;
  from_name: string | null;
  subject: string;
  body_html: string;
  body_text: string | null;

  status: EmailStatus;
  provider: EmailProvider;
  provider_message_id: string | null;

  // Tracking
  opened_at: ISODateString | null;
  clicked_at: ISODateString | null;
  replied_at: ISODateString | null;
  bounced_at: ISODateString | null;

  // Follow-up
  sequence_order: number; // 0 = initial
  scheduled_at: ISODateString | null;
  sent_at: ISODateString | null;

  // Meta
  error_message: string | null;
  metadata: Record<string, unknown> | null;
}

export interface SendEmailInput {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface EmailProviderResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Abstract interface for email providers.
 * Any provider must implement this interface.
 */
export interface IEmailProvider {
  send(input: SendEmailInput): Promise<EmailProviderResult>;
  readonly providerName: EmailProvider;
}
