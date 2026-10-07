import { z } from "zod";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/;

/* ------------------------------------------------------------------ */
/* POST /bookings  (public — guest checkout, no login)                 */
/* ------------------------------------------------------------------ */
export const createBookingSchema = z.object({
  /** Random id created once per form session — stops double-tap duplicates */
  bookingKey: z.string().trim().min(8).max(191).optional(),

  // Step 1 — Course
  golfCourseId: z.coerce.number().int().positive(),

  // Who is playing
  playerType: z.enum(["Bhutanese", "Non-Bhutanese"]),
  players: z.coerce.number().int().min(1).max(4).default(1),
  rounds: z.coerce.number().int().min(1).max(4).default(1),
  roundTypeId: z.coerce.number().int().positive().optional(),

  // Step 2 — Experience (optional)
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  handicap: z.coerce.number().min(0).max(54).optional(),
  caddieRequested: z.boolean().default(false),

  // Step 3 — Equipment (optional)
  bringsOwnClubs: z.boolean().default(false),
  carrySetIds: z.array(z.coerce.number().int().positive()).max(4).default([]),

  // Step 4 — Date
  playDate: z.string().regex(ISO_DATE, "Use YYYY-MM-DD"),

  // Guest contact
  partyName: z.string().trim().min(1, "Name is required").max(255),
  partyEmail: z.string().trim().toLowerCase().email("Enter a valid email").max(100),
  partyPhone: z.string().trim().max(50).optional(),
  nationality: z.string().trim().max(100).optional(),
  idNumber: z.string().trim().max(50).optional(), // CID or passport no.
  specialRequest: z.string().trim().max(500).optional(),

  // Step 5 — Payment (never send card details here)
  paymentMethod: z.enum(["dk_bank", "card"]),
});
export type CreateBookingInput = z.infer<typeof createBookingSchema>;

/* ------------------------------------------------------------------ */
/* PATCH /admin/bookings/:id/approve                                   */
/* ------------------------------------------------------------------ */
export const approveBookingSchema = z.object({
  teeTime: z.string().regex(HH_MM, "Use HH:mm (24h)").optional(), // Bhutan time
  caddieId: z.coerce.number().int().positive().optional(),
  gatewayTxnId: z.string().trim().max(100).optional(),
  journalNo: z.string().trim().max(50).optional(),
  referenceNo: z.string().trim().max(50).optional(),
});
export type ApproveBookingInput = z.infer<typeof approveBookingSchema>;

/* ------------------------------------------------------------------ */
/* GET /admin/bookings?page=&limit=&status=&date=&q=                   */
/* ------------------------------------------------------------------ */
export const listBookingsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(["pending", "booked", "cancelled", "completed"]).optional(),
  date: z.string().regex(ISO_DATE, "Use YYYY-MM-DD").optional(),
  q: z.string().trim().max(100).optional(), // search reference / name / email
});
export type ListBookingsQuery = z.infer<typeof listBookingsQuerySchema>;

/** Turns a zod error into one readable line: "partyEmail: Enter a valid email; playDate: Use YYYY-MM-DD" */
export const zodMessage = (error: { issues: Array<{ path: ReadonlyArray<PropertyKey>; message: string }> }) =>
  error.issues.map((i) => (i.path.length ? `${i.path.map(String).join(".")}: ${i.message}` : i.message)).join("; ");