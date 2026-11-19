import { getSupabaseServerClient } from "@/supabase/server";
import type { Category } from "@/types/database";
import { AppError } from "@/utils/errors";

export class CategoryRepository {
  private get db() {
    return getSupabaseServerClient();
  }

  async findAll(): Promise<Category[]> {
    const { data, error } = await this.db
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      throw AppError.internal("Failed to fetch categories");
    }

    return (data ?? []) as Category[];
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await this.db
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw AppError.internal("Failed to fetch category");
    }

    return data as Category | null;
  }
}
