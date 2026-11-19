import { CategoryRepository } from "@/repositories/category.repository";
import type { Category } from "@/types/database";

export class CategoryService {
  constructor(private repository = new CategoryRepository()) {}

  async list(): Promise<Category[]> {
    return this.repository.findAll();
  }
}

export const categoryService = new CategoryService();
