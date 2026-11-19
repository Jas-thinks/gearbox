import type { ID, ISODateString, Timestamps, SoftDelete } from "./common";
import type { LeadStatus } from "./lead";

export type CampaignStatus = "draft" | "active" | "paused" | "completed" | "archived";

export type CampaignGoal =
  | "owner_acquisition"
  | "rental_shop_onboarding"
  | "college_outreach"
  | "creator_onboarding"
  | "investor_outreach"
  | "partner_acquisition"
  | "custom";

export type AudienceType =
  | "photographers"
  | "wedding_studios"
  | "drone_operators"
  | "rental_shops"
  | "agencies"
  | "production_houses"
  | "influencers"
  | "college_clubs"
  | "all_creators"
  | "custom";

export interface EmailTemplate {
  id: ID;
  campaign_id: ID;
  name: string;
  subject: string;
  body_html: string;
  body_text: string;
  sequence_order: number;
  delay_days: number; // days after previous email
  variables: string[]; // e.g. ["{{name}}", "{{city}}"]
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface Campaign extends Timestamps, SoftDelete {
  id: ID;
  name: string;
  description: string | null;
  goal: CampaignGoal;
  audience_type: AudienceType;
  status: CampaignStatus;

  // Configuration
  max_emails_per_day: number;
  follow_up_days: number[]; // e.g. [0, 3, 7]
  stop_on_reply: boolean;

  // Targeting
  target_lead_statuses: LeadStatus[];
  target_creator_types: string[];
  target_cities: string[];
  target_countries: string[];

  // Stats (denormalized for performance)
  total_leads: number;
  emails_sent: number;
  emails_opened: number;
  emails_replied: number;
  meetings_booked: number;
  converted: number;

  // Meta
  created_by: ID | null;
  started_at: ISODateString | null;
  completed_at: ISODateString | null;
}

export type CreateCampaignInput = Omit<
  Campaign,
  | "id"
  | "created_at"
  | "updated_at"
  | "deleted_at"
  | "total_leads"
  | "emails_sent"
  | "emails_opened"
  | "emails_replied"
  | "meetings_booked"
  | "converted"
  | "started_at"
  | "completed_at"
>;

export type UpdateCampaignInput = Partial<CreateCampaignInput>;

export interface CampaignFilters {
  status?: CampaignStatus;
  goal?: CampaignGoal;
  search?: string;
}
