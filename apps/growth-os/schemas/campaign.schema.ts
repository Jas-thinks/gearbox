import { z } from "zod";

export const CampaignStatusEnum = z.enum([
  "draft",
  "active",
  "paused",
  "completed",
  "archived",
]);

export const CampaignGoalEnum = z.enum([
  "owner_acquisition",
  "rental_shop_onboarding",
  "college_outreach",
  "creator_onboarding",
  "investor_outreach",
  "partner_acquisition",
  "custom",
]);

export const AudienceTypeEnum = z.enum([
  "photographers",
  "wedding_studios",
  "drone_operators",
  "rental_shops",
  "agencies",
  "production_houses",
  "influencers",
  "college_clubs",
  "all_creators",
  "custom",
]);

export const CreateCampaignSchema = z.object({
  name: z.string().min(2, "Campaign name is required").max(200),
  description: z.string().max(1000).nullish(),
  goal: CampaignGoalEnum,
  audience_type: AudienceTypeEnum,
  status: CampaignStatusEnum.default("draft"),
  max_emails_per_day: z.number().int().min(1).max(1000).default(50),
  follow_up_days: z.array(z.number().int().min(0)).default([0, 3, 7]),
  stop_on_reply: z.boolean().default(true),
  target_lead_statuses: z.array(z.string()).default([]),
  target_creator_types: z.array(z.string()).default([]),
  target_cities: z.array(z.string()).default([]),
  target_countries: z.array(z.string()).default([]),
  created_by: z.string().uuid().nullish(),
});

export const UpdateCampaignSchema = CreateCampaignSchema.partial();

export const CampaignFiltersSchema = z.object({
  status: CampaignStatusEnum.optional(),
  goal: CampaignGoalEnum.optional(),
  search: z.string().max(200).optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(25),
});

export type CreateCampaignInput = z.infer<typeof CreateCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof UpdateCampaignSchema>;
export type CampaignFiltersInput = z.infer<typeof CampaignFiltersSchema>;
