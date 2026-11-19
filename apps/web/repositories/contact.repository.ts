import { getSupabaseAdminClient } from "@/supabase/admin";
import type { ContactMessage } from "@/types/database";
import type { CreateContactInput } from "@/schemas";
import { AppError } from "@/utils/errors";

export class ContactRepository {
  private get db() {
    return getSupabaseAdminClient();
  }

  async create(
    input: CreateContactInput,
    meta: { ipAddress: string | null }
  ): Promise<ContactMessage> {
    const { data, error } = await this.db
      .from("contact_messages")
      .insert({
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        status: "new",
        ip_address: meta.ipAddress,
      })
      .select("*")
      .single();

    if (error) {
      throw AppError.internal("Failed to create contact message");
    }

    return data as ContactMessage;
  }
}
