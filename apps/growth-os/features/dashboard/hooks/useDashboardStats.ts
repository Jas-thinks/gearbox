/**
 * Server-side analytics aggregation for the dashboard.
 * Returns pre-computed stats without exposing raw DB queries to the UI.
 */

import type { DashboardStats, GrowthDataPoint, LeadsByStatus, LeadsBySource, LeadsByCity } from "@/types/analytics";

/**
 * Computes dashboard KPIs from the database.
 * Exported for use in Server Components (not client hooks).
 *
 * When Supabase is not configured, returns zero-filled stats
 * so the UI renders gracefully without crashing.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const { getSupabaseServerClient } = await import("@/lib/supabase/server");
    const supabase = await getSupabaseServerClient();

    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    const [
      totalResult,
      newTodayResult,
      newWeekResult,
      qualifiedResult,
      contactedResult,
      repliedResult,
      meetingResult,
      waitlistedResult,
      customerResult,
      emailsTodayResult,
    ] = await Promise.allSettled([
      supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null),
      supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null)
        .gte("created_at", todayStart.toISOString()),
      supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null)
        .gte("created_at", weekStart.toISOString()),
      supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null)
        .eq("status", "qualified"),
      supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null)
        .in("status", ["email_sent", "follow_up", "interested", "meeting"]),
      supabase
        .from("email_logs")
        .select("*", { count: "exact", head: true })
        .eq("status", "replied"),
      supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null)
        .eq("status", "meeting"),
      supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null)
        .eq("status", "waitlist"),
      supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null)
        .eq("status", "customer"),
      supabase
        .from("email_logs")
        .select("*", { count: "exact", head: true })
        .eq("status", "sent")
        .gte("sent_at", todayStart.toISOString()),
    ]);

    const getCount = (result: PromiseSettledResult<{ count: number | null }>) =>
      result.status === "fulfilled" ? (result.value.count ?? 0) : 0;

    const total = getCount(totalResult as PromiseSettledResult<{ count: number | null }>);
    const customers = getCount(customerResult as PromiseSettledResult<{ count: number | null }>);
    const conversionRate = total > 0 ? (customers / total) * 100 : 0;

    return {
      totalLeads: total,
      newLeadsToday: getCount(newTodayResult as PromiseSettledResult<{ count: number | null }>),
      newLeadsThisWeek: getCount(newWeekResult as PromiseSettledResult<{ count: number | null }>),
      qualifiedLeads: getCount(qualifiedResult as PromiseSettledResult<{ count: number | null }>),
      contactedLeads: getCount(contactedResult as PromiseSettledResult<{ count: number | null }>),
      repliedLeads: getCount(repliedResult as PromiseSettledResult<{ count: number | null }>),
      meetingsScheduled: getCount(meetingResult as PromiseSettledResult<{ count: number | null }>),
      waitlisted: getCount(waitlistedResult as PromiseSettledResult<{ count: number | null }>),
      customers,
      emailsSentToday: getCount(emailsTodayResult as PromiseSettledResult<{ count: number | null }>),
      conversionRate,
    };
  } catch {
    return {
      totalLeads: 0,
      newLeadsToday: 0,
      newLeadsThisWeek: 0,
      qualifiedLeads: 0,
      contactedLeads: 0,
      repliedLeads: 0,
      meetingsScheduled: 0,
      waitlisted: 0,
      customers: 0,
      emailsSentToday: 0,
      conversionRate: 0,
    };
  }
}

export async function getLeadsByCity(limit = 8): Promise<LeadsByCity[]> {
  try {
    const { getSupabaseServerClient } = await import("@/lib/supabase/server");
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("leads")
      .select("city")
      .is("deleted_at", null)
      .not("city", "is", null);

    if (error || !data) return [];

    const rows = data as { city: string | null }[];
    const counts: Record<string, number> = {};
    rows.forEach((row) => {
      if (row.city) counts[row.city] = (counts[row.city] ?? 0) + 1;
    });

    return Object.entries(counts)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function getLeadsByStatus(): Promise<LeadsByStatus[]> {
  try {
    const { countLeadsByStatus } = await import("@/repositories/leads/lead.repository");
    const result = await countLeadsByStatus();
    return result.map((r) => ({ status: r.status as never, count: r.count }));
  } catch {
    return [];
  }
}

export async function getRecentActivityFeed() {
  try {
    const { findRecentActivities } = await import("@/repositories/activity/activity.repository");
    return await findRecentActivities(15);
  } catch {
    return [];
  }
}
