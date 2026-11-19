export type CreatorType =
  | "filmmaker"
  | "photographer"
  | "content-creator"
  | "youtuber"
  | "other";

export type WaitlistRole = "creator" | "owner" | "both";

export interface WaitlistFormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  creatorType: CreatorType;
  interestedEquipment: string;
  role: WaitlistRole;
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
}
