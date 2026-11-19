import { NextRequest, NextResponse } from "next/server";
import { findLeads } from "@/repositories/leads/lead.repository";
import { generateCSV } from "@/utils/csv";
import { getErrorMessage, logError } from "@/utils/error";
import type { Lead } from "@/types/lead";

const EXPORT_COLUMNS: { key: keyof Lead; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "website", label: "Website" },
  { key: "instagram_handle", label: "Instagram" },
  { key: "linkedin_url", label: "LinkedIn" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "country", label: "Country" },
  { key: "creator_type", label: "Creator Type" },
  { key: "business_name", label: "Business Name" },
  { key: "owned_equipment", label: "Owned Equipment" },
  { key: "interested_equipment", label: "Interested Equipment" },
  { key: "rental_frequency", label: "Rental Frequency" },
  { key: "status", label: "Status" },
  { key: "lead_score", label: "Lead Score" },
  { key: "lead_source", label: "Lead Source" },
  { key: "tags", label: "Tags" },
  { key: "notes", label: "Notes" },
  { key: "created_at", label: "Created At" },
];

/**
 * GET /api/leads/export
 * Exports leads as CSV.
 * Query params: status, creator_type, city, etc. (same as CRM filters)
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const filters = {
      status: url.searchParams.get("status") as never ?? undefined,
      creator_type: url.searchParams.get("creator_type") as never ?? undefined,
      city: url.searchParams.get("city") ?? undefined,
      search: url.searchParams.get("search") ?? undefined,
    };

    const { data } = await findLeads(filters, { page: 1, pageSize: 5000 });

    const csv = generateCSV(
      data as unknown as Record<string, unknown>[],
      EXPORT_COLUMNS as never
    );

    const filename = `gearbox-leads-${new Date().toISOString().split("T")[0]}.csv`;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    logError(error, { context: "GET /api/leads/export" });
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
