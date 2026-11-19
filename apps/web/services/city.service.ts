import { CityRepository } from "@/repositories/city.repository";
import type { City } from "@/types/database";

export class CityService {
  constructor(private repository = new CityRepository()) {}

  async list(): Promise<City[]> {
    return this.repository.findAll(true);
  }
}

export const cityService = new CityService();
