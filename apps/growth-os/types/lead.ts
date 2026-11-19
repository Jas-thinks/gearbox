import type { ID, ISODateString, Timestamps, SoftDelete } from "./common";

// ---------------------------------------------------------------------------
// Enumerations
// ---------------------------------------------------------------------------

export type LeadStatus =
  | "created"
  | "research"
  | "qualified"
  | "campaign_assigned"
  | "ai_personalized"
  | "approval_queue"
  | "email_sent"
  | "follow_up"
  | "interested"
  | "meeting"
  | "waitlist"
  | "marketplace_user"
  | "customer"
  | "disqualified"
  | "unsubscribed";

export type CreatorType =
  | "photographer"
  | "wedding_studio"
  | "drone_operator"
  | "rental_shop"
  | "agency"
  | "production_house"
  | "influencer"
  | "college_club"
  | "videographer"
  | "filmmaker"
  | "content_creator"
  | "other";

export type LeadSource =
  | "manual"
  | "csv_import"
  | "waitlist"
  | "referral"
  | "instagram"
  | "linkedin"
  | "google"
  | "cold_outreach"
  | "partner"
  | "other";

export type RentalFrequency =
  | "daily"
  | "weekly"
  | "monthly"
  | "occasionally"
  | "unknown";

// ---------------------------------------------------------------------------
// Core Entity
// ---------------------------------------------------------------------------

export interface Lead extends Timestamps, SoftDelete {
  id: ID;

  // Personal
  name: string;
  email: string;
  phone: string | null;
  website: string | null;

  // Social
  instagram_handle: string | null;
  linkedin_url: string | null;

  // Location
  city: string | null;
  state: string | null;
  country: string | null;

  // Business
  creator_type: CreatorType | null;
  business_name: string | null;

  // Equipment
  owned_equipment: string[];
  interested_equipment: string[];
  rental_frequency: RentalFrequency | null;

  // Pipeline
  status: LeadStatus;
  lead_score: number; // 0–100
  lead_source: LeadSource;

  // Meta
  notes: string | null;
  tags: string[];
  assigned_campaign_id: ID | null;
  assigned_to: ID | null; // team member user id

  // AI
  ai_summary: string | null;
  ai_pitch: string | null;
  ai_personalized_email: string | null;
  ai_follow_up: string | null;

  // Tracking
  last_contacted_at: ISODateString | null;
  last_replied_at: ISODateString | null;
  emails_sent_count: number;
}

// ---------------------------------------------------------------------------
// DTOs
// ---------------------------------------------------------------------------

export type CreateLeadInput = Omit<
  Lead,
  | "id"
  | "created_at"
  | "updated_at"
  | "deleted_at"
  | "ai_summary"
  | "ai_pitch"
  | "ai_personalized_email"
  | "ai_follow_up"
  | "emails_sent_count"
  | "last_contacted_at"
  | "last_replied_at"
>;

export type UpdateLeadInput = Partial<CreateLeadInput>;

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

export interface LeadFilters {
  status?: LeadStatus;
  creator_type?: CreatorType;
  lead_source?: LeadSource;
  city?: string;
  country?: string;
  campaign_id?: ID;
  tags?: string[];
  search?: string;
  lead_score_min?: number;
  lead_score_max?: number;
}

// ---------------------------------------------------------------------------
// Activity
// ---------------------------------------------------------------------------

export type ActivityType =
  | "lead_created"
  | "status_changed"
  | "email_sent"
  | "email_opened"
  | "email_replied"
  | "note_added"
  | "tag_added"
  | "tag_removed"
  | "campaign_assigned"
  | "ai_generated"
  | "meeting_scheduled"
  | "field_updated";

export interface LeadActivity extends Timestamps {
  id: ID;
  lead_id: ID;
  activity_type: ActivityType;
  description: string;
  metadata: Record<string, unknown> | null;
  performed_by: ID | null;
}
