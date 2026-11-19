import { categoryService } from "@/services/category.service";

export class CategoryController {
  static async list() {
    const categories = await categoryService.list();
    return { data: { items: categories } };
  }
}
