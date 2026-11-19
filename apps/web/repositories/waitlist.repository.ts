import { getSupabaseAdminClient } from "@/supabase/admin";
import type { ActivityLog, WaitlistEntry } from "@/types/database";
import type { CreateWaitlistInput, ListWaitlistInput } from "@/schemas";
import { AppError, isPostgresUniqueViolation } from "@/utils/errors";
import { getPaginationRange } from "@/utils/request";

export class WaitlistRepository {
  private get db() {
    return getSupabaseAdminClient();
  }

  async create(
    input: CreateWaitlistInput,
    meta: { ipAddress: string | null; referrer?: string; utmSource?: string; utmMedium?: string; utmCampaign?: string }
  ): Promise<WaitlistEntry> {
    const { data, error } = await this.db
      .from("waitlist")
      .insert({
        name: input.name,
        email: input.email,
        phone: input.phone,
        city: input.city,
        creator_type: input.creatorType,
        role: input.role,
        interested_equipment: input.interestedEquipment || null,
        utm_source: meta.utmSource ?? input.utmSource ?? null,
        utm_medium: meta.utmMedium ?? input.utmMedium ?? null,
        utm_campaign: meta.utmCampaign ?? input.utmCampaign ?? null,
        referrer: meta.referrer ?? input.referrer ?? null,
        ip_address: meta.ipAddress,
      })
      .select("*")
      .single();

    if (error) {
      if (isPostgresUniqueViolation(error)) {
        throw AppError.conflict("Email already registered on the waitlist");
      }
      throw AppError.internal("Failed to create waitlist entry");
    }

    return data as WaitlistEntry;
  }

  async findByEmail(email: string): Promise<WaitlistEntry | null> {
    const { data, error } = await this.db
      .from("waitlist")
      .select("*")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (error) {
      throw AppError.internal("Failed to fetch waitlist entry");
    }

    return data as WaitlistEntry | null;
  }

  async list(input: ListWaitlistInput): Promise<{ items: WaitlistEntry[]; total: number }> {
    const { from, to } = getPaginationRange(input.page, input.limit);

    let query = this.db
      .from("waitlist")
      .select("*", { count: "exact" });

    if (input.city) {
      query = query.ilike("city", `%${input.city}%`);
    }

    if (input.role) {
      query = query.eq("role", input.role);
    }

    if (input.search) {
      query = query.or(
        `name.ilike.%${input.search}%,email.ilike.%${input.search}%,city.ilike.%${input.search}%`
      );
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      throw AppError.internal("Failed to list waitlist entries");
    }

    return {
      items: (data ?? []) as WaitlistEntry[],
      total: count ?? 0,
    };
  }

  async logActivity(log: Omit<ActivityLog, "id" | "created_at">): Promise<void> {
    const { error } = await this.db.from("activity_logs").insert({
      action: log.action,
      entity_type: log.entity_type,
      entity_id: log.entity_id,
      metadata: log.metadata,
      ip_address: log.ip_address,
      user_agent: log.user_agent,
      request_id: log.request_id,
    });

    if (error) {
      // Non-blocking — log failure should not break main flow
      console.error(JSON.stringify({ level: "error", message: "Failed to write activity log", error: error.message }));
    }
  }
}
