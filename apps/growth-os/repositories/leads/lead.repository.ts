/**
 * Lead Repository.
 * All database access for leads goes through this file.
 * Never write raw Supabase queries outside this layer.
 */

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Lead } from "@/types/lead";
import type { PaginatedResponse, PaginationParams } from "@/types/common";
import type { LeadFiltersInput, CreateLeadInput, UpdateLeadInput } from "@/schemas/lead.schema";
import { buildPaginatedResponse, getOffset } from "@/utils/pagination";
import { logError } from "@/utils/error";

export async function findLeads(
  filters: Partial<LeadFiltersInput>,
  pagination: PaginationParams
): Promise<PaginatedResponse<Lead>> {
  const supabase = await getSupabaseServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from("leads")
    .select("*", { count: "exact" })
    .is("deleted_at", null);

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.creator_type) query = query.eq("creator_type", filters.creator_type);
  if (filters.lead_source) query = query.eq("lead_source", filters.lead_source);
  if (filters.city) query = query.ilike("city", `%${filters.city}%`);
  if (filters.country) query = query.eq("country", filters.country);
  if (filters.campaign_id) query = query.eq("assigned_campaign_id", filters.campaign_id);
  if (filters.tags?.length) query = query.overlaps("tags", filters.tags);
  if (filters.lead_score_min !== undefined)
    query = query.gte("lead_score", filters.lead_score_min);
  if (filters.lead_score_max !== undefined)
    query = query.lte("lead_score", filters.lead_score_max);
  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,business_name.ilike.%${filters.search}%`
    );
  }

  const offset = getOffset(pagination);
  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + pagination.pageSize - 1);

  if (error) {
    logError(error, { context: "findLeads", filters });
    throw error;
  }

  return buildPaginatedResponse((data ?? []) as Lead[], count ?? 0, pagination);
}

export async function findLeadById(id: string): Promise<Lead | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    logError(error, { context: "findLeadById", id });
    throw error;
  }

  return data as unknown as Lead | null;
}

export async function findLeadByEmail(email: string): Promise<Lead | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("email", email)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    logError(error, { context: "findLeadByEmail", email });
    throw error;
  }

  return data as unknown as Lead | null;
}

export async function createLead(input: CreateLeadInput): Promise<Lead> {
  const supabase = await getSupabaseServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("leads") as any)
    .insert(input)
    .select()
    .single();

  if (error) {
    logError(error, { context: "createLead", input });
    throw error;
  }

  return data as Lead;
}

export async function updateLead(
  id: string,
  input: UpdateLeadInput
): Promise<Lead> {
  const supabase = await getSupabaseServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("leads") as any)
    .update(input)
    .eq("id", id)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) {
    logError(error, { context: "updateLead", id, input });
    throw error;
  }

  return data as Lead;
}

export async function softDeleteLead(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("leads") as any)
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    logError(error, { context: "softDeleteLead", id });
    throw error;
  }
}

export async function countLeadsByStatus(): Promise<
  { status: string; count: number }[]
> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("leads")
    .select("status")
    .is("deleted_at", null);

  if (error) {
    logError(error, { context: "countLeadsByStatus" });
    throw error;
  }

  const counts: Record<string, number> = {};
  (data ?? []).forEach((row) => {
    const status = (row as { status: string }).status;
    counts[status] = (counts[status] ?? 0) + 1;
  });

  return Object.entries(counts).map(([status, count]) => ({ status, count }));
}

export async function bulkUpdateLeadStatus(
  ids: string[],
  status: string
): Promise<void> {
  const supabase = await getSupabaseServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("leads") as any)
    .update({ status })
    .in("id", ids)
    .is("deleted_at", null);

  if (error) {
    logError(error, { context: "bulkUpdateLeadStatus", ids, status });
    throw error;
  }
}

export async function bulkSoftDeleteLeads(ids: string[]): Promise<void> {
  const supabase = await getSupabaseServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("leads") as any)
    .update({ deleted_at: new Date().toISOString() })
    .in("id", ids);

  if (error) {
    logError(error, { context: "bulkSoftDeleteLeads", ids });
    throw error;
  }
}

export async function findArchivedLeads(
  pagination: PaginationParams
): Promise<PaginatedResponse<Lead>> {
  const supabase = await getSupabaseServerClient();
  const offset = getOffset(pagination);

  const { data, error, count } = await supabase
    .from("leads")
    .select("*", { count: "exact" })
    .not("deleted_at", "is", null)
    .order("deleted_at", { ascending: false })
    .range(offset, offset + pagination.pageSize - 1);

  if (error) {
    logError(error, { context: "findArchivedLeads" });
    throw error;
  }

  return buildPaginatedResponse((data ?? []) as Lead[], count ?? 0, pagination);
}

export async function countNewLeadsToday(): Promise<number> {
  const supabase = await getSupabaseServerClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .is("deleted_at", null)
    .gte("created_at", today.toISOString());

  if (error) {
    logError(error, { context: "countNewLeadsToday" });
    throw error;
  }

  return count ?? 0;
}
