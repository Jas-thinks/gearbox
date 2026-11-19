import { ZodError, type ZodSchema } from "zod";
import { AppError } from "@/utils/errors";
import { sanitizeInput } from "@/utils/request";

export class ValidationService {
  parse<T>(schema: ZodSchema<T>, data: unknown): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        throw AppError.unprocessable("Validation failed", error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })));
      }
      throw error;
    }
  }

  sanitizeStrings<T extends Record<string, unknown>>(obj: T): T {
    const result = { ...obj };
    for (const key of Object.keys(result)) {
      const value = result[key];
      if (typeof value === "string") {
        (result as Record<string, unknown>)[key] = sanitizeInput(value);
      }
    }
    return result;
  }

  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  validatePhone(phone: string): boolean {
    return /^[+]?[\d\s()-]{7,20}$/.test(phone);
  }
}

export const validationService = new ValidationService();
