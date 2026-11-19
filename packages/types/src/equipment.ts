export type EquipmentCategory =
  | "camera"
  | "lens"
  | "drone"
  | "lighting"
  | "audio"
  | "gimbal";

export type SortOption = "newest" | "popular" | "price-low" | "price-high" | "rating";

export interface EquipmentOwner {
  name: string;
  avatar: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  memberSince: string;
}

export interface Equipment {
  id: string;
  slug: string;
  name: string;
  category: EquipmentCategory;
  description: string;
  pricePerDay: number;
  city: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  owner: EquipmentOwner;
  specifications: Record<string, string>;
  featured?: boolean;
  popular?: boolean;
  createdAt: string;
}
