import { NotificationRepository } from "@/repositories/notification.repository";
import type { Notification } from "@/types/database";
import { logger } from "@/utils/logger";

export class NotificationService {
  constructor(private repository = new NotificationRepository()) {}

  async notifyAdmin(payload: {
    type: string;
    title: string;
    body?: string;
    metadata?: Record<string, unknown>;
  }): Promise<Notification | null> {
    try {
      return await this.repository.create({
        profile_id: null,
        type: payload.type,
        title: payload.title,
        body: payload.body ?? null,
        metadata: payload.metadata ?? {},
      });
    } catch (error) {
      logger.error("Failed to create admin notification", {
        type: payload.type,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return null;
    }
  }
}

export const notificationService = new NotificationService();
