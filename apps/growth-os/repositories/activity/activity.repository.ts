import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { LeadActivity, ActivityType } from "@/types/lead";
import { logError } from "@/utils/error";

interface CreateActivityInput {
  lead_id: string;
  activity_type: ActivityType;
  description: string;
  metadata?: Record<string, unknown> | null;
  performed_by?: string | null;
}

export async function createActivity(input: CreateActivityInput): Promise<LeadActivity> {
  const supabase = await getSupabaseServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("lead_activities") as any)
    .insert(input)
    .select()
    .single();

  if (error) {
    logError(error, { context: "createActivity", input });
    throw error;
  }

  return data as LeadActivity;
}

export async function findActivitiesByLead(
  leadId: string,
  limit = 50
): Promise<LeadActivity[]> {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("lead_activities")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    logError(error, { context: "findActivitiesByLead", leadId });
    throw error;
  }

  return (data ?? []) as LeadActivity[];
}

export async function findRecentActivities(limit = 20): Promise<LeadActivity[]> {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("lead_activities")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    logError(error, { context: "findRecentActivities" });
    throw error;
  }

  return (data ?? []) as LeadActivity[];
}
