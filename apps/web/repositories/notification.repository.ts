import { getSupabaseAdminClient } from "@/supabase/admin";
import type { Notification } from "@/types/database";
import { AppError } from "@/utils/errors";

export class NotificationRepository {
  private get db() {
    return getSupabaseAdminClient();
  }

  async create(
    notification: Omit<Notification, "id" | "created_at" | "read">
  ): Promise<Notification> {
    const { data, error } = await this.db
      .from("notifications")
      .insert({ ...notification, read: false })
      .select("*")
      .single();

    if (error) {
      throw AppError.internal("Failed to create notification");
    }

    return data as Notification;
  }
}
