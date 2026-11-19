import type { ID, ISODateString, Timestamps } from "./common";
import type { CreatorType } from "./lead";

export type WaitlistStatus = "pending" | "synced_to_crm" | "disqualified";

export interface WaitlistEntry extends Timestamps {
  id: ID;
  name: string;
  email: string;
  city: string | null;
  creator_type: CreatorType | null;
  interested_equipment: string[];
  status: WaitlistStatus;
  synced_lead_id: ID | null;
  ip_address: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  notes: string | null;
}

export type CreateWaitlistEntryInput = Pick<
  WaitlistEntry,
  | "name"
  | "email"
  | "city"
  | "creator_type"
  | "interested_equipment"
  | "ip_address"
  | "referrer"
  | "utm_source"
  | "utm_medium"
  | "utm_campaign"
>;

export interface WaitlistFilters {
  status?: WaitlistStatus;
  creator_type?: CreatorType;
  city?: string;
  search?: string;
  synced?: boolean;
}
