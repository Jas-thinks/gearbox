"use server";

import { parseCSV } from "@/utils/csv";
import { createLeadWithScoring } from "./lead.service";
import { findLeadByEmail } from "@/repositories/leads/lead.repository";
import { CreateLeadSchema } from "@/schemas/lead.schema";
import { getErrorMessage, logError } from "@/utils/error";
import type { CsvColumnMapping, ImportResult } from "./csv-import.utils";

/**
 * Import leads from CSV content with given column mappings.
 * Skips duplicate emails. Returns a summary.
 */
export async function importLeadsFromCsv(
  csvContent: string,
  mappings: CsvColumnMapping[]
): Promise<ImportResult> {
  const rows = parseCSV(csvContent);
  const result: ImportResult = {
    total: rows.length,
    imported: 0,
    skipped: 0,
    errors: [],
  };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      const mapped: Record<string, unknown> = {};
      for (const m of mappings) {
        if (m.leadField && row[m.csvColumn] !== undefined) {
          mapped[m.leadField] = row[m.csvColumn];
        }
      }

      if (typeof mapped.owned_equipment === "string") {
        mapped.owned_equipment = mapped.owned_equipment
          .split(";")
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
      if (typeof mapped.interested_equipment === "string") {
        mapped.interested_equipment = (mapped.interested_equipment as string)
          .split(";")
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
      if (typeof mapped.tags === "string") {
        mapped.tags = (mapped.tags as string)
          .split(";")
          .map((s: string) => s.trim())
          .filter(Boolean);
      }

      mapped.lead_source = mapped.lead_source || "csv_import";

      const parsed = CreateLeadSchema.safeParse(mapped);
      if (!parsed.success) {
        result.errors.push({
          row: i + 2,
          reason: parsed.error.issues[0]?.message ?? "Validation failed",
        });
        result.skipped++;
        continue;
      }

      const existing = await findLeadByEmail(parsed.data.email);
      if (existing) {
        result.skipped++;
        continue;
      }

      await createLeadWithScoring(parsed.data);
      result.imported++;
    } catch (error) {
      logError(error, { context: "importLeadsFromCsv", row: i });
      result.errors.push({ row: i + 2, reason: getErrorMessage(error) });
      result.skipped++;
    }
  }

  return result;
}
