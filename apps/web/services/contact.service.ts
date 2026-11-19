import { ContactRepository } from "@/repositories/contact.repository";
import { emailService } from "@/emails/email.service";
import { validationService } from "@/services/validation.service";
import { notificationService } from "@/services/notification.service";
import { growthOsWebhook } from "@/webhooks/growth-os.webhook";
import { jobQueue } from "@/jobs/interfaces";
import { createContactSchema, type CreateContactInput } from "@/schemas";
import type { ContactMessage, RequestContext } from "@/types/database";
import { logger } from "@/utils/logger";

export class ContactService {
  constructor(private repository = new ContactRepository()) {}

  async create(
    rawInput: unknown,
    context: RequestContext
  ): Promise<{ message: ContactMessage; confirmation: string }> {
    const sanitized = validationService.sanitizeStrings(
      rawInput as Record<string, unknown>
    );
    const input: CreateContactInput = validationService.parse(createContactSchema, sanitized);

    const message = await this.repository.create(input, {
      ipAddress: context.ipAddress,
    });

    logger.contactSubmission(message.email, context.requestId, message.subject);

    await notificationService.notifyAdmin({
      type: "contact.message",
      title: "New contact message",
      body: message.subject,
      metadata: { email: message.email, id: message.id },
    });

    void growthOsWebhook.dispatch({
      event: "contact.message",
      timestamp: new Date().toISOString(),
      data: {
        id: message.id,
        email: message.email,
        subject: message.subject,
      },
    });

    void jobQueue.enqueue({
      type: "analytics.track",
      data: { event: "contact.submit", properties: { subject: message.subject } },
    });

    const template = emailService.buildContactConfirmation(message.name);
    await emailService.sendTemplate(message.email, template);

    return {
      message,
      confirmation: "Message received successfully",
    };
  }
}

export const contactService = new ContactService();
