import { getSupabaseServerClient } from "@/lib/supabase/server";
import { logError } from "@/utils/error";

export interface LeadNote {
  id: string;
  lead_id: string;
  content: string;
  is_pinned: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteInput {
  lead_id: string;
  content: string;
  is_pinned?: boolean;
  created_by?: string | null;
}

export async function findNotesByLead(leadId: string): Promise<LeadNote[]> {
  const supabase = await getSupabaseServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("lead_notes") as any)
    .select("*")
    .eq("lead_id", leadId)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    logError(error, { context: "findNotesByLead", leadId });
    throw error;
  }

  return (data ?? []) as LeadNote[];
}

export async function createNote(input: CreateNoteInput): Promise<LeadNote> {
  const supabase = await getSupabaseServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("lead_notes") as any)
    .insert(input)
    .select()
    .single();

  if (error) {
    logError(error, { context: "createNote", input });
    throw error;
  }

  return data as LeadNote;
}

export async function updateNote(
  id: string,
  input: Partial<Pick<LeadNote, "content" | "is_pinned">>
): Promise<LeadNote> {
  const supabase = await getSupabaseServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("lead_notes") as any)
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    logError(error, { context: "updateNote", id });
    throw error;
  }

  return data as LeadNote;
}

export async function deleteNote(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("lead_notes") as any)
    .delete()
    .eq("id", id);

  if (error) {
    logError(error, { context: "deleteNote", id });
    throw error;
  }
}
