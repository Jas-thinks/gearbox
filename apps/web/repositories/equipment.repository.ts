import { getSupabaseServerClient } from "@/supabase/server";
import type { EquipmentWithRelations } from "@/types/database";
import type { ListEquipmentInput } from "@/schemas";
import { AppError } from "@/utils/errors";
import { getPaginationRange } from "@/utils/request";

const EQUIPMENT_SELECT = `
  *,
  city:cities(id, name, slug),
  category:categories(id, name, slug),
  images:equipment_images(id, equipment_id, url, alt_text, sort_order, is_primary, created_at),
  reviews:reviews(id, equipment_id, reviewer_name, rating, comment, verified, created_at),
  availability:equipment_availability(id, equipment_id, date, status, created_at)
`;

export class EquipmentRepository {
  private get db() {
    return getSupabaseServerClient();
  }

  async findAll(
    input: ListEquipmentInput,
    categoryId?: string,
    cityId?: string
  ): Promise<{ items: EquipmentWithRelations[]; total: number }> {
    const { from, to } = getPaginationRange(input.page, input.limit);

    let query = this.db
      .from("equipment")
      .select(EQUIPMENT_SELECT, { count: "exact" })
      .eq("status", "published");

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (cityId) {
      query = query.eq("city_id", cityId);
    }

    if (input.search) {
      query = query.textSearch("search_vector", input.search, {
        type: "plain",
        config: "english",
      });
    }

    if (input.minPrice !== undefined) {
      query = query.gte("daily_price", input.minPrice);
    }

    if (input.maxPrice !== undefined) {
      query = query.lte("daily_price", input.maxPrice);
    }

    if (input.featured) {
      query = query.eq("featured", true);
    }

    switch (input.sort) {
      case "popular":
        query = query.order("popular", { ascending: false });
        break;
      case "price-low":
        query = query.order("daily_price", { ascending: true });
        break;
      case "price-high":
        query = query.order("daily_price", { ascending: false });
        break;
      case "rating":
        query = query.order("rating", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
      throw AppError.internal("Failed to fetch equipment");
    }

    return {
      items: (data ?? []) as EquipmentWithRelations[],
      total: count ?? 0,
    };
  }

  async findBySlug(slug: string): Promise<EquipmentWithRelations | null> {
    const { data, error } = await this.db
      .from("equipment")
      .select(EQUIPMENT_SELECT)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) {
      throw AppError.internal("Failed to fetch equipment");
    }

    return data as EquipmentWithRelations | null;
  }
}
