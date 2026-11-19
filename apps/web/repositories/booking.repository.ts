import { getSupabaseAdminClient } from "@/supabase/admin";
import { AppError } from "@/utils/errors";

export interface BookingRow {
  id: string;
  equipment_id: string;
  renter_id: string;
  owner_id: string | null;
  start_date: string;
  end_date: string;
  status: string;
  daily_rate: number;
  service_fee: number;
  total_amount: number;
  created_at: string;
}

export class BookingRepository {
  private get db() {
    return getSupabaseAdminClient();
  }

  /** Atomic: availability check + insert + outbox event in ONE DB transaction. */
  async create(args: {
    equipmentId: string;
    renterId: string;
    startDate: string;
    endDate: string;
    notes?: string;
    idempotencyKey?: string;
  }): Promise<BookingRow> {
    const { data, error } = await this.db.rpc("create_booking", {
      p_equipment_id: args.equipmentId,
      p_renter_id: args.renterId,
      p_start: args.startDate,
      p_end: args.endDate,
      p_notes: args.notes ?? null,
      p_idempotency_key: args.idempotencyKey ?? null,
    });

    if (error) {
      if (error.code === "23P01") {
        throw AppError.conflict("These dates are no longer available for this equipment");
      }
      if (error.code === "P0002") throw AppError.notFound("Equipment not found");
      throw AppError.internal("Failed to create booking");
    }
    return data as BookingRow;
  }

  async findById(id: string): Promise<BookingRow | null> {
    const { data } = await this.db.from("bookings").select("*").eq("id", id).maybeSingle();
    return (data as BookingRow) ?? null;
  }

  async listForRenter(renterId: string, limit = 50): Promise<BookingRow[]> {
    const { data, error } = await this.db
      .from("bookings")
      .select("*")
      .eq("renter_id", renterId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw AppError.internal("Failed to load bookings");
    return (data ?? []) as BookingRow[];
  }

  async busyRanges(equipmentId: string, from: string, to: string) {
    const { data, error } = await this.db
      .from("bookings")
      .select("start_date,end_date")
      .eq("equipment_id", equipmentId)
      .in("status", ["pending", "confirmed", "active"])
      .lte("start_date", to)
      .gte("end_date", from)
      .order("start_date");
    if (error) throw AppError.internal("Failed to load availability");
    return (data ?? []) as { start_date: string; end_date: string }[];
  }
}
