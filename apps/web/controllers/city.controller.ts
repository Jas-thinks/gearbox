import { cityService } from "@/services/city.service";

export class CityController {
  static async list() {
    const cities = await cityService.list();
    return { data: { items: cities } };
  }
}
