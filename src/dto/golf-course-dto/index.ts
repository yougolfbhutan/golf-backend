import type { Prisma } from "../../../generated/prisma";

/** Relations loaded with every booking we return */
export const bookingInclude = {
  golfCourse: { select: { id: true, name: true } },
  roundType: { select: { id: true, roundname: true } },
  caddie: { select: { id: true, caddiename: true, phone_number: true } },
  equipment: { include: { carrySet: { select: { id: true, carrysetname: true } } } },
  payments: { orderBy: { id: "desc" } },
} satisfies Prisma.BookingInclude;

export type BookingWithRelations = Prisma.BookingGetPayload<{ include: typeof bookingInclude }>;

const money = (d: Prisma.Decimal) => d.toFixed(2);
const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/** Plain JSON-safe shape sent to the frontend / admin panel (Decimals → strings) */
export const toBookingDTO = (b: BookingWithRelations) => {
  const payment = b.payments[0] ?? null; // latest attempt
  return {
    id: b.id,
    reference: b.reference,
    status: b.status,
    playDate: isoDate(b.playDate),
    teeTime: b.teeTime?.toISOString() ?? null,
    course: b.golfCourse,
    roundType: b.roundType,
    playerType: b.playerType,
    players: b.players,
    rounds: b.noofrounds,
    experience: {
      skillLevel: b.skillLevel,
      handicap: b.handicap?.toString() ?? null,
      caddieRequested: b.caddieRequested,
      caddie: b.caddie,
    },
    equipment: {
      bringsOwnClubs: b.bringsOwnClubs,
      items: b.equipment.map((e) => ({
        carrySetId: e.carrySetId,
        name: e.carrySet.carrysetname,
        quantity: e.quantity,
        unitPrice: money(e.unitPrice),
      })),
    },
    guest: {
      name: b.partyName,
      email: b.partyEmail,
      phone: b.partyPhone,
      nationality: b.nationality,
      idNumber: b.idNumber,
      specialRequest: b.specialRequest,
    },
    price: {
      currency: b.currency,
      courseFee: money(b.courseFee),
      equipmentFee: money(b.equipmentFee),
      total: money(b.totalPrice),
    },
    payment: payment && {
      id: payment.id,
      method: payment.method,
      status: payment.status,
      amount: money(payment.amount),
      gatewayTxnId: payment.gatewayTxnId,
      paidAt: payment.payment_date?.toISOString() ?? null,
    },
    createdAt: b.createdAt.toISOString(),
  };
};

export type BookingDTO = ReturnType<typeof toBookingDTO>;

export type PaginatedBookingsDTO = {
  results: BookingDTO[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};