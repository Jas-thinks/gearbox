export type BookingStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded";

export interface User {
  id: string;
  profile_id: string | null;
  email: string;
  status: "active" | "suspended" | "deleted";
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string | null;
  equipment_id: string;
  session_id: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  equipment_id: string;
  renter_id: string | null;
  owner_id: string | null;
  start_date: string;
  end_date: string;
  status: BookingStatus;
  daily_rate: number;
  total_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  booking_id: string | null;
  payer_id: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: string | null;
  provider_ref: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  auth_user_id: string | null;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "user" | "owner" | "admin";
  phone: string | null;
  city: string | null;
  bio: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  equipment_id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  verified: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  profile_id: string | null;
  type: string;
  title: string;
  body: string | null;
  read: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}
