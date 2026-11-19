import { z } from "zod";
import { CreatorTypeEnum } from "./lead.schema";

export const WaitlistSignupSchema = z.object({
  name: z.string().min(2, "Name is required").max(200),
  email: z.string().email("Enter a valid email"),
  city: z.string().max(100).optional(),
  creator_type: CreatorTypeEnum.optional(),
  interested_equipment: z.array(z.string()).default([]),
});

export type WaitlistSignupInput = z.infer<typeof WaitlistSignupSchema>;
