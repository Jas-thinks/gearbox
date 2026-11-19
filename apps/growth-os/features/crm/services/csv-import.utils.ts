export interface CsvColumnMapping {
  csvColumn: string;
  leadField: string;
}

export interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  errors: { row: number; reason: string }[];
}

const FIELD_MAP: Record<string, string> = {
  name: "name",
  full_name: "name",
  email: "email",
  email_address: "email",
  phone: "phone",
  mobile: "phone",
  website: "website",
  url: "website",
  instagram: "instagram_handle",
  instagram_handle: "instagram_handle",
  linkedin: "linkedin_url",
  linkedin_url: "linkedin_url",
  city: "city",
  state: "state",
  country: "country",
  type: "creator_type",
  creator_type: "creator_type",
  business: "business_name",
  business_name: "business_name",
  notes: "notes",
  tags: "tags",
  source: "lead_source",
  lead_source: "lead_source",
  owned_equipment: "owned_equipment",
  interested_equipment: "interested_equipment",
};

/**
 * Auto-detect column mappings from CSV headers.
 */
export function detectColumnMappings(headers: string[]): CsvColumnMapping[] {
  return headers.map((col) => ({
    csvColumn: col,
    leadField: FIELD_MAP[col.toLowerCase().replace(/\s+/g, "_")] ?? "",
  }));
}
