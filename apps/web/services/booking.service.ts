import { beginIdempotent, completeIdempotent, abortIdempotent, invalidate } from "@gearbox/infra";
import { BookingRepository, type BookingRow } from "@/repositories/booking.repository";
import { EquipmentRepository } from "@/repositories/equipment.repository";
import { validationService } from "@/services/validation.service";
import { createBookingSchema, availabilityQuerySchema } from "@/schemas";
import { AppError } from "@/utils/errors";

const toDto = (b: BookingRow) => ({
  id: b.id,
  equipmentId: b.equipment_id,
  startDate: b.start_date,
  endDate: b.end_date,
  status: b.status,
  dailyRate: b.daily_rate,
  serviceFee: b.service_fee,
  totalAmount: b.total_amount,
  createdAt: b.created_at,
});

export class BookingService {
  constructor(
    private bookings = new BookingRepository(),
    private equipment = new EquipmentRepository()
  ) {}

  /**
   * Create a booking. Safe to retry: the same Idempotency-Key from the same
   * user always yields the same booking, never a duplicate or a double charge.
   * Layers: Redis claim (fast path) → DB unique key → DB exclusion constraint.
   */
  async create(renterId: string, rawInput: unknown, idempotencyKey?: string) {
    const input = validationService.parse(createBookingSchema, rawInput);
    const item = await this.equipment.findBySlug(input.equipmentSlug);
    if (!item) throw AppError.notFound("Equipment not found");

    const scope = idempotencyKey ? `booking:${renterId}:${idempotencyKey}` : null;
    if (scope) {
      const state = await beginIdempotent<ReturnType<typeof toDto>>(scope);
      if (state.status === "done") return { booking: state.response, replayed: true };
      if (state.status === "in_flight") {
        throw AppError.conflict("A request with this Idempotency-Key is already being processed");
      }
    }

    try {
      const row = await this.bookings.create({
        equipmentId: item.id,
        renterId,
        startDate: input.startDate,
        endDate: input.endDate,
        notes: input.notes,
        idempotencyKey,
      });
      const booking = toDto(row);
      if (scope) await completeIdempotent(scope, booking);
      await invalidate(`availability:${item.id}`);
      return { booking, replayed: false };
    } catch (err) {
      if (scope) await abortIdempotent(scope);
      throw err;
    }
  }

  listMine(renterId: string) {
    return this.bookings.listForRenter(renterId).then((rows) => rows.map(toDto));
  }

  async get(renterId: string, id: string) {
    const row = await this.bookings.findById(id);
    if (!row || (row.renter_id !== renterId && row.owner_id !== renterId)) {
      throw AppError.notFound("Booking not found");
    }
    return toDto(row);
  }

  async availability(slug: string, rawQuery: unknown) {
    const q = validationService.parse(availabilityQuerySchema, rawQuery);
    const item = await this.equipment.findBySlug(slug);
    if (!item) throw AppError.notFound("Equipment not found");

    const from = q.from ?? new Date().toISOString().slice(0, 10);
    const to = q.to ?? new Date(Date.now() + 90 * 864e5).toISOString().slice(0, 10);
    const busy = await this.bookings.busyRanges(item.id, from, to);
    return {
      equipmentId: item.id,
      from,
      to,
      busy: busy.map((b) => ({ start: b.start_date, end: b.end_date })),
    };
  }
}

export const bookingService = new BookingService();
