import { z } from "zod";

export const CreatorTypeEnum = z.enum([
  "photographer",
  "wedding_studio",
  "drone_operator",
  "rental_shop",
  "agency",
  "production_house",
  "influencer",
  "college_club",
  "videographer",
  "filmmaker",
  "content_creator",
  "other",
]);

export const LeadSourceEnum = z.enum([
  "manual",
  "csv_import",
  "waitlist",
  "referral",
  "instagram",
  "linkedin",
  "google",
  "cold_outreach",
  "partner",
  "other",
]);

export const LeadStatusEnum = z.enum([
  "created",
  "research",
  "qualified",
  "campaign_assigned",
  "ai_personalized",
  "approval_queue",
  "email_sent",
  "follow_up",
  "interested",
  "meeting",
  "waitlist",
  "marketplace_user",
  "customer",
  "disqualified",
  "unsubscribed",
]);

export const RentalFrequencyEnum = z.enum([
  "daily",
  "weekly",
  "monthly",
  "occasionally",
  "unknown",
]);

export const CreateLeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(20).nullish(),
  website: z.string().url("Invalid URL").nullish().or(z.literal("")),

  instagram_handle: z.string().max(50).nullish(),
  linkedin_url: z
    .string()
    .url("Invalid LinkedIn URL")
    .nullish()
    .or(z.literal("")),

  city: z.string().max(100).nullish(),
  state: z.string().max(100).nullish(),
  country: z.string().max(100).default("India"),

  creator_type: CreatorTypeEnum.nullish(),
  business_name: z.string().max(200).nullish(),

  owned_equipment: z.array(z.string()).default([]),
  interested_equipment: z.array(z.string()).default([]),
  rental_frequency: RentalFrequencyEnum.nullish(),

  status: LeadStatusEnum.default("created"),
  lead_score: z.number().int().min(0).max(100).default(0),
  lead_source: LeadSourceEnum.default("manual"),

  notes: z.string().max(5000).nullish(),
  tags: z.array(z.string()).default([]),
  assigned_campaign_id: z.string().uuid().nullish(),
  assigned_to: z.string().uuid().nullish(),
});

export const UpdateLeadSchema = CreateLeadSchema.partial();

export const LeadFiltersSchema = z.object({
  status: LeadStatusEnum.optional(),
  creator_type: CreatorTypeEnum.optional(),
  lead_source: LeadSourceEnum.optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  campaign_id: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().max(200).optional(),
  lead_score_min: z.number().min(0).max(100).optional(),
  lead_score_max: z.number().min(0).max(100).optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(25),
});

export type CreateLeadInput = z.infer<typeof CreateLeadSchema>;
export type UpdateLeadInput = z.infer<typeof UpdateLeadSchema>;
export type LeadFiltersInput = z.infer<typeof LeadFiltersSchema>;
