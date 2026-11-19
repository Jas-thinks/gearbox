/**
 * Lead Service — Business Logic Layer.
 *
 * Orchestrates: validation → scoring → persistence → activity logging.
 * Never import this in Client Components — server-side only.
 */

import { computeLeadScore } from "@/services/scoring/lead-scoring.service";
import {
  createLead as dbCreateLead,
  updateLead as dbUpdateLead,
  softDeleteLead as dbSoftDeleteLead,
  findLeadById,
} from "@/repositories/leads/lead.repository";
import { createActivity } from "@/repositories/activity/activity.repository";
import type { CreateLeadInput, UpdateLeadInput } from "@/schemas/lead.schema";
import type { Lead } from "@/types/lead";
import { NotFoundError } from "@/utils/error";

export async function createLeadWithScoring(input: CreateLeadInput): Promise<Lead> {
  const scoreBreakdown = computeLeadScore(input);

  const lead = await dbCreateLead({
    ...input,
    lead_score: scoreBreakdown.total,
  });

  await createActivity({
    lead_id: lead.id,
    activity_type: "lead_created",
    description: `Lead "${lead.name}" was created via ${lead.lead_source}.`,
    metadata: { score: scoreBreakdown.total, source: lead.lead_source },
  });

  return lead;
}

export async function updateLeadWithTracking(
  id: string,
  input: UpdateLeadInput,
  changes?: Record<string, unknown>
): Promise<Lead> {
  const existing = await findLeadById(id);
  if (!existing) throw new NotFoundError("Lead", id);

  // Recompute score if profile fields changed
  let updatedInput = { ...input };
  if (
    input.creator_type !== undefined ||
    input.owned_equipment !== undefined ||
    input.interested_equipment !== undefined ||
    input.website !== undefined ||
    input.instagram_handle !== undefined ||
    input.linkedin_url !== undefined ||
    input.rental_frequency !== undefined
  ) {
    const scoreBreakdown = computeLeadScore({
      creator_type: input.creator_type ?? existing.creator_type ?? undefined,
      owned_equipment: input.owned_equipment ?? existing.owned_equipment,
      interested_equipment: input.interested_equipment ?? existing.interested_equipment,
      website: input.website ?? existing.website ?? undefined,
      instagram_handle: input.instagram_handle ?? existing.instagram_handle ?? undefined,
      linkedin_url: input.linkedin_url ?? existing.linkedin_url ?? undefined,
      city: input.city ?? existing.city ?? undefined,
      state: input.state ?? existing.state ?? undefined,
      country: input.country ?? existing.country ?? undefined,
      phone: input.phone ?? existing.phone ?? undefined,
      email: input.email ?? existing.email,
      rental_frequency: input.rental_frequency ?? existing.rental_frequency ?? undefined,
    });
    updatedInput = { ...updatedInput, lead_score: scoreBreakdown.total };
  }

  const lead = await dbUpdateLead(id, updatedInput);

  // Log status change separately
  if (input.status && input.status !== existing.status) {
    await createActivity({
      lead_id: id,
      activity_type: "status_changed",
      description: `Status changed from "${existing.status}" to "${input.status}".`,
      metadata: { from: existing.status, to: input.status },
    });
  } else if (changes && Object.keys(changes).length > 0) {
    await createActivity({
      lead_id: id,
      activity_type: "field_updated",
      description: `Lead profile updated.`,
      metadata: { changed_fields: Object.keys(changes) },
    });
  }

  return lead;
}

export async function archiveLead(id: string): Promise<void> {
  const existing = await findLeadById(id);
  if (!existing) throw new NotFoundError("Lead", id);

  await dbSoftDeleteLead(id);

  await createActivity({
    lead_id: id,
    activity_type: "status_changed",
    description: `Lead "${existing.name}" was archived.`,
    metadata: { action: "archive" },
  });
}

export async function restoreLead(id: string): Promise<Lead> {
  const { getSupabaseServerClient } = await import("@/lib/supabase/server");
  const supabase = await getSupabaseServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("leads") as any)
    .update({ deleted_at: null })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  await createActivity({
    lead_id: id,
    activity_type: "status_changed",
    description: `Lead was restored from archive.`,
    metadata: { action: "restore" },
  });

  return data as Lead;
}

export async function duplicateLead(id: string): Promise<Lead> {
  const existing = await findLeadById(id);
  if (!existing) throw new NotFoundError("Lead", id);

  const { id: _id, created_at: _ca, updated_at: _ua, deleted_at: _da, ...rest } = existing;

  const duplicate = await dbCreateLead({
    ...rest,
    name: `${rest.name} (Copy)`,
    email: `copy_${Date.now()}_${rest.email}`,
    status: "created",
    lead_score: rest.lead_score,
    ai_summary: null,
    ai_pitch: null,
    ai_personalized_email: null,
    ai_follow_up: null,
    last_contacted_at: null,
    last_replied_at: null,
    emails_sent_count: 0,
  } as CreateLeadInput);

  await createActivity({
    lead_id: duplicate.id,
    activity_type: "lead_created",
    description: `Lead duplicated from "${existing.name}".`,
    metadata: { original_lead_id: id },
  });

  return duplicate;
}
