export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailProvider {
  readonly name: string;
  send(options: SendEmailOptions): Promise<{ id: string }>;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}
