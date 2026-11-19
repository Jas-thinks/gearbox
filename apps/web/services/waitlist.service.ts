import { WaitlistRepository } from "@/repositories/waitlist.repository";
import { emailService } from "@/emails/email.service";
import { validationService } from "@/services/validation.service";
import { notificationService } from "@/services/notification.service";
import { growthOsWebhook } from "@/webhooks/growth-os.webhook";
import { jobQueue } from "@/jobs/interfaces";
import {
  createWaitlistSchema,
  listWaitlistSchema,
  type CreateWaitlistInput,
  type ListWaitlistInput,
} from "@/schemas";
import type { RequestContext, WaitlistEntry } from "@/types/database";
import { AppError } from "@/utils/errors";
import { logger } from "@/utils/logger";
import { calculatePagination } from "@/utils/request";

export class WaitlistService {
  constructor(private repository = new WaitlistRepository()) {}

  async create(
    rawInput: unknown,
    context: RequestContext,
    utm?: { utmSource?: string; utmMedium?: string; utmCampaign?: string; referrer?: string }
  ): Promise<{ entry: WaitlistEntry; message: string }> {
    const sanitized = validationService.sanitizeStrings(
      rawInput as Record<string, unknown>
    );
    const input: CreateWaitlistInput = validationService.parse(createWaitlistSchema, sanitized);

    const existing = await this.repository.findByEmail(input.email);
    if (existing) {
      throw AppError.conflict("Email already registered on the waitlist");
    }

    const entry = await this.repository.create(input, {
      ipAddress: context.ipAddress,
      referrer: utm?.referrer,
      utmSource: utm?.utmSource,
      utmMedium: utm?.utmMedium,
      utmCampaign: utm?.utmCampaign,
    });

    await this.repository.logActivity({
      action: "waitlist.created",
      entity_type: "waitlist",
      entity_id: entry.id,
      metadata: { email: entry.email, city: entry.city, role: entry.role },
      ip_address: context.ipAddress,
      user_agent: context.userAgent,
      request_id: context.requestId,
    });

    logger.waitlistSignup(entry.email, context.requestId, entry.city);

    await notificationService.notifyAdmin({
      type: "waitlist.signup",
      title: "New waitlist signup",
      body: `${entry.name} from ${entry.city}`,
      metadata: { email: entry.email, role: entry.role },
    });

    void growthOsWebhook.dispatch({
      event: "waitlist.signup",
      timestamp: new Date().toISOString(),
      data: {
        id: entry.id,
        email: entry.email,
        city: entry.city,
        role: entry.role,
      },
    });

    void jobQueue.enqueue({
      type: "analytics.track",
      data: { event: "waitlist.signup", properties: { city: entry.city } },
    });

    const template = emailService.buildWaitlistConfirmation(entry.name);
    await emailService.sendTemplate(entry.email, template);

    return {
      entry,
      message: "Successfully joined the waitlist",
    };
  }

  async list(rawInput: unknown): Promise<{
    items: WaitlistEntry[];
    pagination: ReturnType<typeof calculatePagination>;
  }> {
    const input: ListWaitlistInput = validationService.parse(listWaitlistSchema, rawInput);
    const { items, total } = await this.repository.list(input);

    return {
      items,
      pagination: calculatePagination(input.page, input.limit, total),
    };
  }
}

export const waitlistService = new WaitlistService();
