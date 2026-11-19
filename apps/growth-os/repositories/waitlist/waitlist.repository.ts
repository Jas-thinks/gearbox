import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { WaitlistEntry } from "@/types/waitlist";
import type { PaginatedResponse, PaginationParams } from "@/types/common";
import type { WaitlistSignupInput } from "@/schemas/waitlist.schema";
import { buildPaginatedResponse, getOffset } from "@/utils/pagination";
import { logError } from "@/utils/error";

export async function findWaitlistEntries(
  filters: { status?: string; search?: string },
  pagination: PaginationParams
): Promise<PaginatedResponse<WaitlistEntry>> {
  const supabase = await getSupabaseServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from("waitlist")
    .select("*", { count: "exact" });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
    );
  }

  const offset = getOffset(pagination);
  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + pagination.pageSize - 1);

  if (error) {
    logError(error, { context: "findWaitlistEntries" });
    throw error;
  }

  return buildPaginatedResponse(
    (data ?? []) as WaitlistEntry[],
    count ?? 0,
    pagination
  );
}

export async function findWaitlistByEmail(email: string): Promise<WaitlistEntry | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("waitlist")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    logError(error, { context: "findWaitlistByEmail", email });
    throw error;
  }

  return data as WaitlistEntry | null;
}

export async function createWaitlistEntry(
  input: WaitlistSignupInput & {
    ip_address?: string | null;
    referrer?: string | null;
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
  }
): Promise<WaitlistEntry> {
  const supabase = await getSupabaseServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("waitlist") as any)
    .insert(input)
    .select()
    .single();

  if (error) {
    logError(error, { context: "createWaitlistEntry" });
    throw error;
  }

  return data as WaitlistEntry;
}

export async function updateWaitlistStatus(
  id: string,
  status: string,
  synced_lead_id?: string
): Promise<void> {
  const supabase = await getSupabaseServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("waitlist") as any)
    .update({ status, synced_lead_id: synced_lead_id ?? null })
    .eq("id", id);

  if (error) {
    logError(error, { context: "updateWaitlistStatus", id });
    throw error;
  }
}

export async function countWaitlistPending(): Promise<number> {
  const supabase = await getSupabaseServerClient();
  const { count, error } = await supabase
    .from("waitlist")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  if (error) return 0;
  return count ?? 0;
}
