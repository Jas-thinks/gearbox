import { getSupabaseServerClient } from "@/supabase/server";
import type { City } from "@/types/database";
import { AppError } from "@/utils/errors";

export class CityRepository {
  private get db() {
    return getSupabaseServerClient();
  }

  async findAll(activeOnly = true): Promise<City[]> {
    let query = this.db.from("cities").select("*").order("name", { ascending: true });

    if (activeOnly) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;

    if (error) {
      throw AppError.internal("Failed to fetch cities");
    }

    return (data ?? []) as City[];
  }

  async findBySlug(slug: string): Promise<City | null> {
    const { data, error } = await this.db
      .from("cities")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw AppError.internal("Failed to fetch city");
    }

    return data as City | null;
  }
}
