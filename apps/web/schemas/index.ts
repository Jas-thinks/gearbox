import { z } from "zod";

const phoneRegex = /^[+]?[\d\s()-]{7,20}$/;

export const createWaitlistSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .trim(),
  email: z
    .string()
    .email("Invalid email address")
    .max(255)
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .regex(phoneRegex, "Invalid phone number format")
    .trim(),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(100)
    .trim(),
  creatorType: z.enum([
    "filmmaker",
    "photographer",
    "content-creator",
    "youtuber",
    "other",
  ]),
  role: z.enum(["creator", "owner", "both"]),
  interestedEquipment: z.string().max(1000).trim().optional().default(""),
  utmSource: z.string().max(255).trim().optional(),
  utmMedium: z.string().max(255).trim().optional(),
  utmCampaign: z.string().max(255).trim().optional(),
  referrer: z.string().max(500).trim().optional(),
});

export type CreateWaitlistInput = z.infer<typeof createWaitlistSchema>;

export const listWaitlistSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  city: z.string().trim().optional(),
  role: z.enum(["creator", "owner", "both"]).optional(),
  search: z.string().trim().optional(),
});

export type ListWaitlistInput = z.infer<typeof listWaitlistSchema>;

export const createContactSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(255).trim().toLowerCase(),
  subject: z.string().min(3).max(200).trim(),
  message: z.string().min(10).max(5000).trim(),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;

export const listEquipmentSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  category: z.string().trim().optional(),
  city: z.string().trim().optional(),
  search: z.string().trim().optional(),
  sort: z
    .enum(["newest", "popular", "price-low", "price-high", "rating"])
    .default("newest"),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  featured: z.coerce.boolean().optional(),
});

export type ListEquipmentInput = z.infer<typeof listEquipmentSchema>;

export const equipmentSlugSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
});

export type EquipmentSlugInput = z.infer<typeof equipmentSlugSchema>;

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

export const createBookingSchema = z
  .object({
    equipmentSlug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
    startDate: isoDate,
    endDate: isoDate,
    notes: z.string().max(1000).trim().optional(),
  })
  .refine((v) => v.endDate >= v.startDate, {
    message: "endDate must be on or after startDate",
    path: ["endDate"],
  })
  .refine((v) => v.startDate >= new Date().toISOString().slice(0, 10), {
    message: "startDate cannot be in the past",
    path: ["startDate"],
  });

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const availabilityQuerySchema = z.object({
  from: isoDate.optional(),
  to: isoDate.optional(),
});
