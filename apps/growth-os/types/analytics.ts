import type { ISODateString } from "./common";
import type { LeadStatus, LeadSource, CreatorType } from "./lead";

export interface DashboardStats {
  totalLeads: number;
  newLeadsToday: number;
  newLeadsThisWeek: number;
  qualifiedLeads: number;
  contactedLeads: number;
  repliedLeads: number;
  meetingsScheduled: number;
  waitlisted: number;
  customers: number;
  emailsSentToday: number;
  conversionRate: number; // percentage
}

export interface LeadsByStatus {
  status: LeadStatus;
  count: number;
}

export interface LeadsBySource {
  source: LeadSource;
  count: number;
}

export interface LeadsByCreatorType {
  creator_type: CreatorType;
  count: number;
}

export interface LeadsByCity {
  city: string;
  count: number;
}

export interface GrowthDataPoint {
  date: ISODateString;
  leads: number;
  emails_sent: number;
  replies: number;
}

export interface CampaignPerformance {
  campaign_id: string;
  campaign_name: string;
  total_leads: number;
  emails_sent: number;
  open_rate: number;
  reply_rate: number;
  conversion_rate: number;
}

export interface ConversionFunnel {
  stage: LeadStatus;
  label: string;
  count: number;
  percentage: number;
}

export interface AnalyticsSummary {
  stats: DashboardStats;
  leadsByStatus: LeadsByStatus[];
  leadsBySource: LeadsBySource[];
  leadsByCreatorType: LeadsByCreatorType[];
  leadsByCity: LeadsByCity[];
  growthData: GrowthDataPoint[];
  campaignPerformance: CampaignPerformance[];
  conversionFunnel: ConversionFunnel[];
}
