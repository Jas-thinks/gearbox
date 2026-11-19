export type CreatorType =
  | "filmmaker"
  | "photographer"
  | "content-creator"
  | "youtuber"
  | "other";

export type WaitlistRole = "creator" | "owner" | "both";

export type ContactStatus = "new" | "read" | "replied" | "archived";

export type EquipmentStatus = "draft" | "published" | "archived";

export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  creator_type: CreatorType;
  role: WaitlistRole;
  interested_equipment: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  state: string | null;
  country: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EquipmentImage {
  id: string;
  equipment_id: string;
  url: string;
  storage_path?: string | null;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
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

export interface EquipmentAvailability {
  id: string;
  equipment_id: string;
  date: string;
  status: "available" | "booked" | "blocked";
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

export interface Equipment {
  id: string;
  title: string;
  slug: string;
  description: string;
  daily_price: number;
  city_id: string;
  category_id: string;
  owner_name: string;
  verified_owner: boolean;
  rating: number;
  review_count: number;
  status: EquipmentStatus;
  coming_soon: boolean;
  featured: boolean;
  popular: boolean;
  specifications: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface EquipmentWithRelations extends Equipment {
  city: Pick<City, "id" | "name" | "slug">;
  category: Pick<Category, "id" | "name" | "slug">;
  images: EquipmentImage[];
  reviews?: Review[];
  availability?: EquipmentAvailability[];
}

export interface ActivityLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  request_id: string | null;
  created_at: string;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  requestId: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface RequestContext {
  requestId: string;
  ipAddress: string | null;
  userAgent: string | null;
}
