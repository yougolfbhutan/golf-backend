"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../../../generated/prisma");
const app_error_1 = require("../../../custom-error/app-error");
const booking_dto_1 = require("./booking-dto");
const booking_mapper_1 = require("./booking.mapper");
/**
 * NOTES ON THE REAL INPUT TYPES (as provided):
 *
 * 1. AccessoryInput.itemId is ASSUMED to actually mean ItemVariant.id.
 *    It can't be Item.id anymore, since Item no longer carries
 *    price/stockQty/availability after the schema split — only
 *    ItemVariant does. If itemId is really meant to stay Item.id, the
 *    interface is missing a separate variant selector field and callers
 *    need to be able to pick e.g. size/color per accessory.
 *
 * 2. CancelBookingInputAttributes has no customerId field, so cancellation
 *    below is guest-style only (partyEmail + partyPhone match). A logged-in
 *    customer currently has no path to cancel their own booking through
 *    this function — add `customerId?: number` to the interface if that's
 *    meant to work.
 *
 * 3. CreateBookingInput.teeTime, .roundType, .numberOfRounds, and
 *    .specialRequest are accepted here but have NO column on the Booking
 *    model to persist to. They are currently silently dropped. roundType
 *    is arguably redundant (CarrySet already has roundTypeId), but
 *    teeTime / numberOfRounds / specialRequest need schema columns added
 *    if they're supposed to be stored.
 */
const prisma = new prisma_1.PrismaClient();
// Shared include shape for "what did they buy" — reused across
// createBooking / getBooking / cancelBooking so the item detail
// shape is identical everywhere and doesn't drift.
const cartItemsWithDetails = {
    items: {
        include: {
            itemVariant: {
                include: {
                    item: {
                        include: {
                            category: true, // ItemCategory: id, name
                        },
                    },
                    urls: true, // ItemVariantUrl[]: images, sortOrder
                },
            },
        },
    },
};
class BookingRepository {
    createBooking(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const golfCourse = yield tx.golfCourse.findUnique({
                    where: { name: input.golfCourseName },
                });
                if (!golfCourse) {
                    throw new Error("Golf course not found");
                }
                const lockedCarrySet = yield tx.$queryRaw `
  SELECT id, availability FROM CarrySet WHERE id = ${input.carrySetId} FOR UPDATE
`;
                const carrySet = lockedCarrySet[0];
                if (!carrySet)
                    throw new Error("Carry set not found");
                if (!carrySet.availability)
                    throw new Error("Carry set is not available");
                yield tx.carrySet.update({
                    where: { id: input.carrySetId },
                    data: { availability: false },
                });
                const accessories = (_a = input.accessories) !== null && _a !== void 0 ? _a : [];
                const variantIds = accessories.map((a) => a.itemId);
                const variants = variantIds.length
                    ? yield tx.itemVariant.findMany({ where: { id: { in: variantIds } } })
                    : [];
                if (variants.length !== variantIds.length) {
                    throw new Error("One or more accessory items were not found");
                }
                let accessoriesTotal = new prisma_1.Prisma.Decimal(0);
                for (const acc of accessories) {
                    const variant = variants.find((v) => v.id === acc.itemId);
                    if (!variant.availability) {
                        throw new Error(`Item variant "${variant.sku}" is currently unavailable`);
                    }
                    if (variant.stockQty < acc.quantity) {
                        throw new Error(`Not enough stock for "${variant.sku}"`);
                    }
                    accessoriesTotal = accessoriesTotal.plus(variant.price.times(acc.quantity));
                }
                const golfPrice = golfCourse.price;
                const totalPrice = golfPrice.plus(accessoriesTotal);
                // 3. Create the cart + cart items for accessories.
                // include pulls back the full "what did they buy" chain:
                // CartItem -> ItemVariant -> Item -> ItemCategory, plus image urls.
                const cart = yield tx.cart.create({
                    data: {
                        // customerId: input.customerId,
                        items: {
                            create: accessories.map((a) => {
                                const variant = variants.find((v) => v.id === a.itemId);
                                return {
                                    itemVariantId: a.itemId,
                                    quantity: a.quantity,
                                    unitPrice: variant.price, // snapshot price at time of booking
                                };
                            }),
                        },
                    },
                    include: cartItemsWithDetails,
                });
                // 4. Decrement stock for each accessory. The `stockQty: { gte: quantity }`
                // guard plus checking `updateMany`'s count catches the race where two
                // transactions both passed the check above but only one should win.
                for (const acc of accessories) {
                    const result = yield tx.itemVariant.updateMany({
                        where: { id: acc.itemId, stockQty: { gte: acc.quantity } },
                        data: { stockQty: { decrement: acc.quantity } },
                    });
                    if (result.count === 0) {
                        throw new Error("Stock changed before booking could be confirmed — please retry");
                    }
                }
                // 5. Create the order that ties the cart + booking total together
                const order = yield tx.order.create({
                    data: {
                        // customerId: input.customerId,
                        cartId: cart.id,
                        totalPrice,
                        status: prisma_1.OrderStatus.pending,
                    },
                });
                // 6. Create the booking itself, with golfCourse/carrySet populated
                // so the create response matches the shape getBooking() returns.
                const booking = yield tx.booking.create({
                    data: {
                        date: new Date(input.teeOffDate),
                        status: prisma_1.BookingStatus.pending,
                        // customerId: input.customerId,
                        carrySetId: input.carrySetId,
                        orderId: order.id,
                        golfCourseId: golfCourse.id,
                        partyName: input.partyName,
                        partyEmail: input.partyEmail,
                        partyPhone: input.partyPhone,
                    },
                    include: {
                        golfCourse: true,
                        carrySet: true,
                    },
                });
                return {
                    booking,
                    order,
                    cart, // items -> itemVariant -> item -> category, + image urls
                    totalPrice,
                    breakdown: {
                        golfPrice,
                        accessoriesTotal,
                    },
                };
            }));
        });
    }
    cancelOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield prisma.order.update({
                    where: { id },
                    data: { status: "cancelled" },
                    select: {
                        id: true,
                        status: true,
                        totalPrice: true,
                    },
                });
                return order;
            }
            catch (err) {
                if (err.code === "P2025") {
                    throw new app_error_1.APIError("NOT_FOUND", app_error_1.STATUS_CODES.NOT_FOUND, "Order not found", true);
                }
                throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Unable to cancel order", true);
            }
        });
    }
    approveBookingAndOrder(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    // 1. Fetch booking to get its orderId (and make sure it exists)
                    const existingBooking = yield tx.booking.findUnique({
                        where: { id: bookingId },
                        select: { id: true, orderId: true },
                    });
                    if (!existingBooking) {
                        throw new app_error_1.APIError("NOT_FOUND", app_error_1.STATUS_CODES.NOT_FOUND, "Booking not found", true);
                    }
                    if (!existingBooking.orderId) {
                        throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.BAD_REQUEST, // adjust to whatever code you use for 400
                        "Booking has no linked order to approve", true);
                    }
                    // 2. Approve the booking
                    const booking = yield tx.booking.update({
                        where: { id: bookingId },
                        data: { status: prisma_1.BookingStatus.booked },
                        select: {
                            id: true,
                            status: true,
                            date: true,
                            partyName: true,
                        },
                    });
                    // 3. Approve the linked order
                    const order = yield tx.order.update({
                        where: { id: existingBooking.orderId },
                        data: { status: prisma_1.OrderStatus.paid },
                        select: {
                            id: true,
                            status: true,
                            totalPrice: true,
                        },
                    });
                    return { booking, order };
                }));
            }
            catch (err) {
                if (err instanceof app_error_1.APIError)
                    throw err; // preserve NOT_FOUND / BAD_REQUEST thrown above
                if (err.code === "P2025") {
                    throw new app_error_1.APIError("NOT_FOUND", app_error_1.STATUS_CODES.NOT_FOUND, "Booking or order not found", true);
                }
                throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Unable to approve booking and order", true);
            }
        });
    }
    getOrderBooking(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit, status, }) {
            try {
                const skip = (page - 1) * limit;
                const where = status ? { status } : {};
                const [bookings, total] = yield Promise.all([
                    prisma.booking.findMany(Object.assign(Object.assign({ where }, booking_dto_1.bookingWithRelationsArgs), { skip, take: limit, orderBy: { id: "desc" } })),
                    prisma.booking.count({ where }),
                ]);
                const results = bookings.map(booking_mapper_1.toBookingListItemDTO);
                return {
                    results,
                    meta: {
                        page,
                        limit,
                        total,
                        totalPages: Math.ceil(total / limit),
                    },
                };
            }
            catch (err) {
                throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Unable to retrieve booking and order data", true);
            }
        });
    }
}
exports.default = BookingRepository;
