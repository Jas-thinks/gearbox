import { cached } from "@gearbox/infra";
import { EquipmentRepository } from "@/repositories/equipment.repository";
import { CategoryRepository } from "@/repositories/category.repository";
import { CityRepository } from "@/repositories/city.repository";
import { validationService } from "@/services/validation.service";
import {
  listEquipmentSchema,
  equipmentSlugSchema,
  type ListEquipmentInput,
} from "@/schemas";
import type { EquipmentWithRelations } from "@/types/database";
import { AppError } from "@/utils/errors";
import { calculatePagination } from "@/utils/request";

export class EquipmentService {
  constructor(
    private equipmentRepo = new EquipmentRepository(),
    private categoryRepo = new CategoryRepository(),
    private cityRepo = new CityRepository()
  ) {}

  /** Cache-aside (Redis, 60s): the catalog is read-heavy and changes rarely. */
  async list(rawInput: unknown): Promise<{
    items: EquipmentWithRelations[];
    pagination: ReturnType<typeof calculatePagination>;
  }> {
    const input: ListEquipmentInput = validationService.parse(listEquipmentSchema, rawInput);
    return cached(`equipment:list:${JSON.stringify(input)}`, 60, () => this.loadList(input));
  }

  private async loadList(input: ListEquipmentInput): Promise<{
    items: EquipmentWithRelations[];
    pagination: ReturnType<typeof calculatePagination>;
  }> {

    let categoryId: string | undefined;
    let cityId: string | undefined;

    if (input.category) {
      const category = await this.categoryRepo.findBySlug(input.category);
      if (category) categoryId = category.id;
    }

    if (input.city) {
      const city = await this.cityRepo.findBySlug(input.city);
      if (!city) {
        const cities = await this.cityRepo.findAll();
        const match = cities.find(
          (c) => c.name.toLowerCase() === input.city!.toLowerCase()
        );
        if (match) cityId = match.id;
      } else {
        cityId = city.id;
      }
    }

    const { items, total } = await this.equipmentRepo.findAll(input, categoryId, cityId);

    return {
      items,
      pagination: calculatePagination(input.page, input.limit, total),
    };
  }

  async getBySlug(rawSlug: string): Promise<EquipmentWithRelations> {
    const { slug } = validationService.parse(equipmentSlugSchema, { slug: rawSlug });
    const equipment = await cached(`equipment:slug:${slug}`, 120, () =>
      this.equipmentRepo.findBySlug(slug)
    );

    if (!equipment) {
      throw AppError.notFound("Equipment not found");
    }

    return equipment;
  }
}

export const equipmentService = new EquipmentService();
