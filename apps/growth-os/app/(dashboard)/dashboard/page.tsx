import { Suspense } from "react";
import {
  getDashboardStats,
  getLeadsByCity,
  getLeadsByStatus,
  getRecentActivityFeed,
} from "@/features/dashboard/hooks/useDashboardStats";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GrowthChart } from "@/features/dashboard/components/GrowthChart";
import { PipelineFunnel } from "@/features/dashboard/components/PipelineFunnel";
import { RecentActivity } from "@/features/dashboard/components/RecentActivity";
import { SystemHealth } from "@/features/dashboard/components/SystemHealth";
import {
  Users, UserPlus, CheckCircle, Mail, MessageSquare,
  Calendar, Clock, ShoppingBag, TrendingUp, Send, MapPin,
} from "lucide-react";
import type { LeadActivity } from "@/types/lead";
import type { GrowthDataPoint } from "@/types/analytics";

const FUNNEL_STAGES = [
  { label: "Total Leads",  key: "totalLeads",        color: "bg-slate-400" },
  { label: "Qualified",    key: "qualifiedLeads",     color: "bg-blue-400" },
  { label: "Contacted",    key: "contactedLeads",     color: "bg-indigo-400" },
  { label: "Replied",      key: "repliedLeads",       color: "bg-violet-400" },
  { label: "Meetings",     key: "meetingsScheduled",  color: "bg-purple-400" },
  { label: "Waitlisted",   key: "waitlisted",         color: "bg-pink-400" },
  { label: "Customers",    key: "customers",          color: "bg-emerald-400" },
];

async function DashboardContent() {
  const [stats, cityData, statusData, activities] = await Promise.all([
    getDashboardStats(),
    getLeadsByCity(),
    getLeadsByStatus(),
    getRecentActivityFeed(),
  ]);

  const growthData: GrowthDataPoint[] = [];

  const funnelStages = FUNNEL_STAGES.map((stage) => ({
    label: stage.label,
    count: stats[stage.key as keyof typeof stats] as number,
    color: stage.color,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Growth Dashboard"
        description="Overview of your growth pipeline and outreach performance"
      />

      {/* KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard title="Total Leads" value={stats.totalLeads} icon={Users} iconClassName="bg-slate-100" format="compact" />
        <StatCard title="New Today" value={stats.newLeadsToday} subtitle={`${stats.newLeadsThisWeek} this week`} icon={UserPlus} iconClassName="bg-emerald-100" format="number" />
        <StatCard title="Qualified" value={stats.qualifiedLeads} icon={CheckCircle} iconClassName="bg-blue-100" format="compact" />
        <StatCard title="Contacted" value={stats.contactedLeads} icon={Mail} iconClassName="bg-indigo-100" format="compact" />
        <StatCard title="Replied" value={stats.repliedLeads} icon={MessageSquare} iconClassName="bg-violet-100" format="compact" />
        <StatCard title="Meetings" value={stats.meetingsScheduled} icon={Calendar} iconClassName="bg-purple-100" format="compact" />
        <StatCard title="Waitlisted" value={stats.waitlisted} icon={Clock} iconClassName="bg-pink-100" format="compact" />
        <StatCard title="Customers" value={stats.customers} icon={ShoppingBag} iconClassName="bg-amber-100" format="compact" />
        <StatCard title="Emails Today" value={stats.emailsSentToday} icon={Send} iconClassName="bg-teal-100" format="compact" />
        <StatCard title="Conversion Rate" value={stats.conversionRate} icon={TrendingUp} iconClassName="bg-orange-100" format="percent" />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Growth Over Time</CardTitle>
            <CardDescription>New leads, emails sent, and replies — last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <GrowthChart data={growthData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Pipeline Funnel</CardTitle>
            <CardDescription>Lead distribution across stages</CardDescription>
          </CardHeader>
          <CardContent>
            <PipelineFunnel stages={funnelStages} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            <CardDescription>Latest events across all leads</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity activities={activities as LeadActivity[]} />
          </CardContent>
        </Card>

        {/* Leads by City */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Leads by City
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cityData.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No data yet</p>
              ) : (
                <div className="space-y-2">
                  {cityData.map((item) => (
                    <div key={item.city} className="flex items-center justify-between gap-2">
                      <span className="text-sm text-foreground truncate">{item.city}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 rounded-full bg-indigo-400"
                          style={{ width: `${Math.max(20, (item.count / (cityData[0]?.count ?? 1)) * 80)}px` }}
                        />
                        <span className="text-xs font-medium text-muted-foreground w-6 text-right">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <SystemHealth />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div><Skeleton className="h-8 w-48" /><Skeleton className="mt-2 h-4 w-72" /></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-80 rounded-lg lg:col-span-2" />
        <Skeleton className="h-80 rounded-lg" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-64 rounded-lg lg:col-span-2" />
        <div className="space-y-4">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
