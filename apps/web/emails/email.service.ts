import type { EmailProvider, EmailTemplate, SendEmailOptions } from "@/emails/provider";
import { isEmailConfigured, getEnv } from "@/config/env";
import { logger } from "@/utils/logger";

/** Placeholder SMTP provider — not implemented, abstraction only */
class SmtpEmailProvider implements EmailProvider {
  readonly name = "smtp";

  async send(options: SendEmailOptions): Promise<{ id: string }> {
    void options;
    throw new Error("SMTP provider is not implemented. Configure a supported provider.");
  }
}

/** Placeholder Resend provider — not implemented, abstraction only */
class ResendEmailProvider implements EmailProvider {
  readonly name = "resend";

  async send(options: SendEmailOptions): Promise<{ id: string }> {
    void options;
    throw new Error("Resend provider is not implemented. Configure when ready.");
  }
}

/** Placeholder SendGrid provider — not implemented, abstraction only */
class SendGridEmailProvider implements EmailProvider {
  readonly name = "sendgrid";

  async send(options: SendEmailOptions): Promise<{ id: string }> {
    void options;
    throw new Error("SendGrid provider is not implemented. Configure when ready.");
  }
}

/** Placeholder Mailgun provider — not implemented, abstraction only */
class MailgunEmailProvider implements EmailProvider {
  readonly name = "mailgun";

  async send(options: SendEmailOptions): Promise<{ id: string }> {
    void options;
    throw new Error("Mailgun provider is not implemented. Configure when ready.");
  }
}

/** No-op provider used when email is not configured */
class DisabledEmailProvider implements EmailProvider {
  readonly name = "disabled";

  async send(options: SendEmailOptions): Promise<{ id: string }> {
    logger.info("Email sending disabled — skipping", {
      to: options.to,
      subject: options.subject,
      action: "email.disabled",
    });
    return { id: "disabled" };
  }
}

function createProvider(): EmailProvider {
  if (!isEmailConfigured()) {
    return new DisabledEmailProvider();
  }

  const env = getEnv();

  switch (env.EMAIL_PROVIDER) {
    case "smtp":
      return new SmtpEmailProvider();
    case "resend":
      return new ResendEmailProvider();
    case "sendgrid":
      return new SendGridEmailProvider();
    case "mailgun":
      return new MailgunEmailProvider();
    default:
      return new DisabledEmailProvider();
  }
}

export class EmailService {
  private provider: EmailProvider | null = null;

  private getProvider(): EmailProvider {
    if (!this.provider) {
      this.provider = createProvider();
    }
    return this.provider;
  }

  constructor(provider?: EmailProvider) {
    if (provider) {
      this.provider = provider;
    }
  }

  isEnabled(): boolean {
    return isEmailConfigured();
  }

  async send(options: SendEmailOptions): Promise<{ id: string; sent: boolean }> {
    const provider = this.getProvider();
    try {
      const result = await provider.send(options);
      logger.info("Email sent", {
        to: options.to,
        subject: options.subject,
        provider: provider.name,
        action: "email.sent",
      });
      return { id: result.id, sent: provider.name !== "disabled" };
    } catch (error) {
      logger.error("Email send failed", {
        to: options.to,
        subject: options.subject,
        provider: provider.name,
        error: error instanceof Error ? error.message : "Unknown error",
        action: "email.failed",
      });
      return { id: "failed", sent: false };
    }
  }

  async sendTemplate(to: string, template: EmailTemplate): Promise<{ id: string; sent: boolean }> {
    return this.send({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  buildWaitlistConfirmation(name: string): EmailTemplate {
    return {
      subject: "You're on the Gearbox waitlist!",
      html: `<p>Hi ${name},</p><p>Thanks for joining the Gearbox waitlist. We'll notify you when we launch in your city.</p>`,
      text: `Hi ${name},\n\nThanks for joining the Gearbox waitlist. We'll notify you when we launch in your city.`,
    };
  }

  buildContactConfirmation(name: string): EmailTemplate {
    return {
      subject: "We received your message — Gearbox",
      html: `<p>Hi ${name},</p><p>Thanks for reaching out. Our team will get back to you within 24 hours.</p>`,
      text: `Hi ${name},\n\nThanks for reaching out. Our team will get back to you within 24 hours.`,
    };
  }
}

export const emailService = new EmailService();
