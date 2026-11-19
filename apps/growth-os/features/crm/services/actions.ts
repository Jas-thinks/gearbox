"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createLeadWithScoring,
  updateLeadWithTracking,
  archiveLead,
  restoreLead,
  duplicateLead,
} from "./lead.service";
import {
  findLeadById,
  softDeleteLead,
  bulkUpdateLeadStatus,
  bulkSoftDeleteLeads,
} from "@/repositories/leads/lead.repository";
import { createNote, updateNote, deleteNote } from "@/repositories/notes/notes.repository";
import { CreateLeadSchema, UpdateLeadSchema } from "@/schemas/lead.schema";
import type { ApiResponse } from "@/types/common";
import { getErrorMessage, logError } from "@/utils/error";

// ---------------------------------------------------------------------------
// Lead CRUD
// ---------------------------------------------------------------------------

export async function createLeadAction(
  _prev: ApiResponse | null,
  formData: FormData
): Promise<ApiResponse<{ id: string }>> {
  try {
    const raw = Object.fromEntries(formData.entries());

    // Handle array fields from comma-separated strings
    const parsed = CreateLeadSchema.safeParse({
      ...raw,
      owned_equipment: raw.owned_equipment
        ? String(raw.owned_equipment)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      interested_equipment: raw.interested_equipment
        ? String(raw.interested_equipment)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      tags: raw.tags
        ? String(raw.tags)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      lead_score: raw.lead_score ? Number(raw.lead_score) : undefined,
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Validation failed.",
      };
    }

    const lead = await createLeadWithScoring(parsed.data);
    revalidatePath("/crm");
    revalidatePath("/dashboard");
    return { success: true, data: { id: lead.id }, message: "Lead created successfully." };
  } catch (error) {
    logError(error, { context: "createLeadAction" });
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updateLeadAction(
  id: string,
  _prev: ApiResponse | null,
  formData: FormData
): Promise<ApiResponse> {
  try {
    const raw = Object.fromEntries(formData.entries());

    const parsed = UpdateLeadSchema.safeParse({
      ...raw,
      owned_equipment: raw.owned_equipment
        ? String(raw.owned_equipment)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      interested_equipment: raw.interested_equipment
        ? String(raw.interested_equipment)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      tags: raw.tags
        ? String(raw.tags)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      lead_score: raw.lead_score ? Number(raw.lead_score) : undefined,
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Validation failed.",
      };
    }

    await updateLeadWithTracking(id, parsed.data, parsed.data);
    revalidatePath("/crm");
    revalidatePath(`/crm/${id}`);
    revalidatePath("/dashboard");
    return { success: true, message: "Lead updated." };
  } catch (error) {
    logError(error, { context: "updateLeadAction", id });
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updateLeadStatusAction(
  id: string,
  status: string
): Promise<ApiResponse> {
  try {
    await updateLeadWithTracking(id, { status: status as never });
    revalidatePath("/crm");
    revalidatePath(`/crm/${id}`);
    revalidatePath("/leads");
    revalidatePath("/dashboard");
    return { success: true, message: "Status updated." };
  } catch (error) {
    logError(error, { context: "updateLeadStatusAction", id });
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function archiveLeadAction(id: string): Promise<ApiResponse> {
  try {
    await archiveLead(id);
    revalidatePath("/crm");
    revalidatePath("/dashboard");
    return { success: true, message: "Lead archived." };
  } catch (error) {
    logError(error, { context: "archiveLeadAction", id });
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function restoreLeadAction(id: string): Promise<ApiResponse> {
  try {
    await restoreLead(id);
    revalidatePath("/crm");
    return { success: true, message: "Lead restored." };
  } catch (error) {
    logError(error, { context: "restoreLeadAction", id });
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function duplicateLeadAction(id: string): Promise<ApiResponse<{ id: string }>> {
  try {
    const newLead = await duplicateLead(id);
    revalidatePath("/crm");
    return { success: true, data: { id: newLead.id }, message: "Lead duplicated." };
  } catch (error) {
    logError(error, { context: "duplicateLeadAction", id });
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function permanentDeleteLeadAction(id: string): Promise<ApiResponse> {
  try {
    await softDeleteLead(id);
    revalidatePath("/crm");
    revalidatePath("/dashboard");
    return { success: true, message: "Lead deleted." };
  } catch (error) {
    logError(error, { context: "permanentDeleteLeadAction", id });
    return { success: false, error: getErrorMessage(error) };
  }
}

// ---------------------------------------------------------------------------
// Bulk Operations
// ---------------------------------------------------------------------------

export async function bulkUpdateStatusAction(
  ids: string[],
  status: string
): Promise<ApiResponse> {
  try {
    await bulkUpdateLeadStatus(ids, status);
    revalidatePath("/crm");
    revalidatePath("/leads");
    revalidatePath("/dashboard");
    return { success: true, message: `${ids.length} leads updated.` };
  } catch (error) {
    logError(error, { context: "bulkUpdateStatusAction" });
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function bulkArchiveLeadsAction(ids: string[]): Promise<ApiResponse> {
  try {
    await bulkSoftDeleteLeads(ids);
    revalidatePath("/crm");
    revalidatePath("/dashboard");
    return { success: true, message: `${ids.length} leads archived.` };
  } catch (error) {
    logError(error, { context: "bulkArchiveLeadsAction" });
    return { success: false, error: getErrorMessage(error) };
  }
}

// ---------------------------------------------------------------------------
// Notes
// ---------------------------------------------------------------------------

export async function createNoteAction(
  leadId: string,
  content: string,
  isPinned = false
): Promise<ApiResponse> {
  try {
    if (!content.trim()) return { success: false, error: "Note cannot be empty." };
    await createNote({ lead_id: leadId, content: content.trim(), is_pinned: isPinned });
    revalidatePath(`/crm/${leadId}`);
    return { success: true, message: "Note added." };
  } catch (error) {
    logError(error, { context: "createNoteAction", leadId });
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updateNoteAction(
  noteId: string,
  leadId: string,
  updates: { content?: string; is_pinned?: boolean }
): Promise<ApiResponse> {
  try {
    await updateNote(noteId, updates);
    revalidatePath(`/crm/${leadId}`);
    return { success: true, message: "Note updated." };
  } catch (error) {
    logError(error, { context: "updateNoteAction", noteId });
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function deleteNoteAction(noteId: string, leadId: string): Promise<ApiResponse> {
  try {
    await deleteNote(noteId);
    revalidatePath(`/crm/${leadId}`);
    return { success: true, message: "Note deleted." };
  } catch (error) {
    logError(error, { context: "deleteNoteAction", noteId });
    return { success: false, error: getErrorMessage(error) };
  }
}

// ---------------------------------------------------------------------------
// Waitlist conversion
// ---------------------------------------------------------------------------

export async function convertWaitlistToLeadAction(
  waitlistId: string,
  waitlistData: {
    name: string;
    email: string;
    city: string | null;
    creator_type: string | null;
    interested_equipment: string[];
  }
): Promise<ApiResponse<{ leadId: string }>> {
  try {
    const { updateWaitlistStatus } = await import(
      "@/repositories/waitlist/waitlist.repository"
    );

    const lead = await createLeadWithScoring({
      name: waitlistData.name,
      email: waitlistData.email,
      city: waitlistData.city,
      creator_type: waitlistData.creator_type as never,
      interested_equipment: waitlistData.interested_equipment,
      owned_equipment: [],
      tags: ["from-waitlist"],
      lead_source: "waitlist",
      status: "created",
      country: "India",
      lead_score: 0,
    });

    await updateWaitlistStatus(waitlistId, "synced_to_crm", lead.id);

    revalidatePath("/crm");
    revalidatePath("/waitlist");
    revalidatePath("/dashboard");

    return { success: true, data: { leadId: lead.id }, message: "Converted to lead." };
  } catch (error) {
    logError(error, { context: "convertWaitlistToLeadAction", waitlistId });
    return { success: false, error: getErrorMessage(error) };
  }
}
