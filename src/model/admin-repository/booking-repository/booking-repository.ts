import crypto from "crypto";
import { PrismaClient, Prisma, BookingStatus, PaymentStatus } from "../../../../generated/prisma";
import { APIError, STATUS_CODES } from "../../../custom-error/app-error";
import type { CreateBookingInput } from "../../../interface/booking/golfcourse-booking";
// keep your existing imports for getOrderBooking (booking-dto, booking.mapper)
const COURSE_TZ = "+06:00"; // Bhutan
const MAX_PLAYERS = 4;
const prisma = new PrismaClient();

// Same rates as the frontend PRICES sheet. The server is the source of truth.
// All amounts are per player.
const RATES = {
  local:         { currency: "BTN", round: 1500, coaching: 1500, companion: 0 },
  saarc:         { currency: "USD", round: 140,  coaching: 50,   companion: 40 },
  international: { currency: "USD", round: 180,  coaching: 50,   companion: 40 },
} as const;

const COURSES = ["rtgc", "drakpoi"];

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const generateReference = () => {
  let s = "";
  for (const b of crypto.randomBytes(8)) s += ALPHABET[b % ALPHABET.length];
  return `YGB-${s}`;
};

const bad = (msg: string) =>
  new APIError("API_ERROR", STATUS_CODES.BAD_REQUEST, msg, true);
const notFound = (msg: string) =>
  new APIError("NOT_FOUND", STATUS_CODES.NOT_FOUND, msg, true);
const fail = (err: unknown, msg: string) => {
  if (err instanceof APIError) return err;
  console.error(msg, err);
  return new APIError("API_ERROR", STATUS_CODES.INTERNAL_ERROR, msg, true);
};

const mergeLines = (lines: { id: number; quantity: number }[]) => {
  const map = new Map<number, number>();
  for (const l of lines) map.set(l.id, (map.get(l.id) ?? 0) + l.quantity);
  return [...map].map(([id, quantity]) => ({ id, quantity }));
};

// Uses priceNu / priceUsd if those columns exist, otherwise `price`.
const unitPrice = (row: any, currency: string): Prisma.Decimal => {
  const specific = currency === "BTN" ? row.priceNu : row.priceUsd;
  return new Prisma.Decimal(specific ?? row.price ?? 0);
};
class BookingRepository {
 async createBooking(input: CreateBookingInput) {
    const email = input.partyEmail.trim().toLowerCase();
const DEFAULT_GOLF_COURSE_ID = "rtgc"; // Royal Thimphu. Use "drakpoi" for Drakpoi.
    const rate = RATES[input.playerType as keyof typeof RATES];
    if (!rate) throw bad(`Invalid playerType: ${input.playerType}`);

    // The DB enum only has local / international. SAARC is priced separately
    // above but stored as international (nationality keeps the detail).
    const dbPlayerType = input.playerType === "local" ? "local" : "international";

    const players = Number(input.numberOfPlayers);
    if (!Number.isInteger(players) || players < 1 || players > MAX_PLAYERS) {
      throw bad(`Players must be between 1 and ${MAX_PLAYERS}`);
    }

    const skillLevel = input.skillLevel;
    if (!skillLevel) throw bad("Skill level is required");

    const coaching = !!input.coaching && String(skillLevel) === "newbie";
    const companion = !!input.companion && input.playerType !== "local";

    const teeDateTime = new Date(
      `${input.teeOffDate}T${input.teeTime}:00${COURSE_TZ}`,
    );
    if (isNaN(teeDateTime.getTime())) throw bad("Invalid tee-off date or time");
    if (teeDateTime <= new Date()) throw bad("Tee time is in the past");

    const bookingKey = `${email}|${DEFAULT_GOLF_COURSE_ID}|${teeDateTime.toISOString()}`;

    const setLines = mergeLines(
      (input.golfSets ?? []).map((s) => ({ id: s.golfSetId, quantity: s.quantity })),
    );
    const itemLines = mergeLines(
      (input.items ?? []).map((i) => ({ id: i.itemVariantId, quantity: i.quantity })),
    );

    if (setLines.some((l) => l.quantity < 1)) throw bad("Invalid golf set quantity");
    if (itemLines.some((l) => l.quantity < 1)) throw bad("Invalid item quantity");
    if (setLines.reduce((a, l) => a + l.quantity, 0) > players) {
      throw bad("You can't rent more golf sets than golfers");
    }
    if (itemLines.some((l) => l.quantity > players)) {
      throw bad("You can't book more of one item than golfers");
    }

    try {
      return await prisma.$transaction(async (tx) => {
        const sets = await tx.golfSet.findMany({
          where: { id: { in: setLines.map((l) => l.id) } },
        });
        if (sets.length !== setLines.length) throw bad("One or more golf sets were not found");
        if (sets.some((s) => !s.availability)) throw bad("One or more golf sets are unavailable");
        const setById = new Map(sets.map((s) => [s.id, s]));

        const variants = await tx.itemVariant.findMany({
          where: { id: { in: itemLines.map((l) => l.id) } },
        });
        if (variants.length !== itemLines.length) throw bad("One or more items were not found");
        const variantById = new Map(variants.map((v) => [v.id, v]));

        for (const line of itemLines) {
          const r = await tx.itemVariant.updateMany({
            where: { id: line.id, availability: true, stockQty: { gte: line.quantity } },
            data: { stockQty: { decrement: line.quantity } },
          });
          if (r.count === 0) {
            throw bad(`Not enough stock for ${variantById.get(line.id)!.sku}`);
          }
        }

        // ── totals calculated on the server
        const courseFee = new Prisma.Decimal(rate.round).mul(players);
        const addOnsFee = new Prisma.Decimal(
          (coaching ? rate.coaching : 0) + (companion ? rate.companion : 0),
        ).mul(players);

        const setsFee = setLines.reduce(
          (sum, l) => sum.add(unitPrice(setById.get(l.id)!, rate.currency).mul(l.quantity)),
          new Prisma.Decimal(0),
        );
        const accessoriesFee = itemLines.reduce(
          (sum, l) => sum.add(unitPrice(variantById.get(l.id)!, rate.currency).mul(l.quantity)),
          new Prisma.Decimal(0),
        );
        const itemsFee = accessoriesFee.add(addOnsFee); // items + coaching + companion
        const packageFee = new Prisma.Decimal(0); // frontend sells sets individually, no package price
        const totalPrice = courseFee.add(packageFee).add(setsFee).add(itemsFee);

        const booking = await tx.booking.create({
          data: {
            reference: generateReference(),
            bookingKey,
            status: BookingStatus.pending,
            playerType: dbPlayerType,
            // courseId: DEFAULT_GOLF_COURSE_ID,
            skillLevel,
            playDate: new Date(`${input.teeOffDate}T00:00:00.000Z`),
            teeTime: teeDateTime,
            players,
            // coaching,
            // companion,
            partyName: input.partyName,
            partyEmail: email,
            partyPhone: input.partyPhone,
            nationality: input.nationality,
            specialRequest: input.specialRequest,
            currency: rate.currency,
            courseFee,
            packageFee,
            setsFee,
            itemsFee,
            totalPrice,
            golfSets: {
              create: setLines.map((l) => ({
                golfSetId: l.id,
                quantity: l.quantity,
                unitPrice: unitPrice(setById.get(l.id)!, rate.currency),
              })),
            },
            items: {
              create: itemLines.map((l) => ({
                itemVariantId: l.id,
                quantity: l.quantity,
                unitPrice: unitPrice(variantById.get(l.id)!, rate.currency),
              })),
            },
          },
          include: { golfSets: true, items: true },
        });

        return { booking };
      });
    } catch (e) {
      console.log("BookingRepository.createBooking error:", e);
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw bad("You already have a booking at this tee time");
      }
      throw fail(e, "Unable to create booking");
    }
  }


  async approveBooking(id: number) {
    try {
      return await prisma.$transaction(async (tx) => {
        const booking = await tx.booking.findUnique({ where: { id } });
        if (!booking) throw notFound("Booking not found");
        if (booking.status !== BookingStatus.pending) {
          throw bad(`Booking is already ${booking.status}`);
        }

        await tx.payment.updateMany({
          where: { bookingId: id, status: PaymentStatus.pending },
          data: { status: PaymentStatus.success, payment_date: new Date() },
        });

        const updated = await tx.booking.update({
          where: { id },
          data: { status: BookingStatus.booked },
          select: {
            id: true,
            reference: true,
            status: true,
            playDate: true,
            teeTime: true,
            partyName: true,
            partyEmail: true,
            currency: true,
            totalPrice: true,
          },
        });
        return { booking: updated };
      });
    } catch (e) {
      throw fail(e, "Unable to approve booking");
    }
  }

  async cancelBooking(id: number) {
    try {
      return await prisma.$transaction(async (tx) => {
        const booking = await tx.booking.findUnique({
          where: { id },
          include: { items: true },
        });
        if (!booking) throw notFound("Booking not found");
        if (
          booking.status === BookingStatus.cancelled ||
          booking.status === BookingStatus.completed
        ) {
          throw bad(`Booking is already ${booking.status}`);
        }

        // Put the item stock back
        for (const it of booking.items) {
          await tx.itemVariant.update({
            where: { id: it.itemVariantId },
            data: { stockQty: { increment: it.quantity } },
          });
        }

        // TODO: if a payment succeeded, trigger the refund with your gateway,
        // then set that Payment to `refunded`.

        const updated = await tx.booking.update({
          where: { id },
          // Free the key so the guest can rebook the same slot
          data: { status: BookingStatus.cancelled, bookingKey: null },
          select: { id: true, reference: true, status: true },
        });
        return { booking: updated };
      });
    } catch (e) {
      throw fail(e, "Unable to cancel booking");
    }
  }

  // getOrderBooking stays as it is, but add console.error(err) in its catch,
  // and update booking-dto.ts / booking.mapper.ts (see point 3).
}

export default BookingRepository;