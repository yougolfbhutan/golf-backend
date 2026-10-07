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
const prisma = new prisma_1.PrismaClient();
class PaymentRepository {
    createPayment(input) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("createPayment input:", input);
            try {
                return yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    // 1. Resolve the order (via booking, since Payment.orderId is required)
                    const booking = yield tx.booking.findUnique({
                        where: { id: input.BookingId },
                        include: {
                            order: {
                                include: { cart: { include: { items: true } } },
                            },
                        },
                    });
                    if (!booking)
                        throw new Error("Booking not found");
                    if (!booking.orderId || !booking.order) {
                        throw new Error("Booking has no associated order");
                    }
                    const order = booking.order;
                    // 2. Reject double payment on the same order
                    const existingPayment = yield tx.payment.findUnique({
                        where: { orderId: order.id },
                    });
                    if (existingPayment) {
                        throw new Error("This order has already been paid");
                    }
                    // 3. Recompute the golf/accessories split from source data
                    //    (never trust a client-sent total)
                    const golfPrice = yield tx.golfCourse.findUnique({
                        where: { id: booking.golfCourseId },
                        select: { price: true },
                    });
                    const golfPortion = golfPrice
                        ? new prisma_1.Prisma.Decimal(golfPrice.price)
                        : new prisma_1.Prisma.Decimal(0);
                    const accessoriesPortion = ((_b = (_a = order.cart) === null || _a === void 0 ? void 0 : _a.items) !== null && _b !== void 0 ? _b : []).reduce((sum, item) => sum.plus(item.unitPrice.times(item.quantity)), new prisma_1.Prisma.Decimal(0));
                    console.log("Golf Portion:", golfPortion.toString());
                    console.log("Accessories Portion:", accessoriesPortion.toString());
                    const computedTotal = golfPortion.plus(accessoriesPortion);
                    console.log("Computed Total:", computedTotal.toString());
                    console.log("Order Total Price:", order.totalPrice.toString());
                    if (!computedTotal.equals(order.totalPrice)) {
                        // Guards against stale/partial data — order total should always
                        // equal golf + accessories at this point
                        throw new Error("Order total does not match golf + accessories breakdown");
                    }
                    const amount = new prisma_1.Prisma.Decimal(input.paymentAmount);
                    if (!amount.equals(computedTotal)) {
                        throw new Error("Payment amount does not match order total");
                    }
                    // 4. Create the Payment
                    const payment = yield tx.payment.create({
                        data: {
                            amount,
                            method: input.PaymentMethod,
                            payment_date: new Date(input.paymentDate), // 👈 wrap it
                            status: "completed",
                            journal_no: input.journalNumber,
                            reference_no: input.referenceNumber,
                            orderId: order.id,
                        },
                    });
                    // 5. Create the AccountTransaction (voucher header)
                    const accountTransaction = yield tx.accountTransaction.create({
                        data: {
                            voucher_no: input.journalNumber,
                            voucher_amount: amount,
                            voucher_date: new Date(), // 👈 fixed
                            paymentId: payment.id,
                        },
                    });
                    // 6. Build the ledger lines: 1 debit + 1-2 credits
                    const zero = new prisma_1.Prisma.Decimal(0);
                    const lines = [
                        {
                            reference_no: input.referenceNumber,
                            dr: amount,
                            cr: zero,
                            accountType: "Cash", // or map from input.PaymentMethod if you track multiple cash/bank accounts
                            accountTransactionId: accountTransaction.id,
                        },
                        {
                            reference_no: input.referenceNumber,
                            dr: zero,
                            cr: golfPortion,
                            accountType: "Booked golf course",
                            accountTransactionId: accountTransaction.id,
                        },
                    ];
                    if (accessoriesPortion.greaterThan(0)) {
                        lines.push({
                            reference_no: input.referenceNumber,
                            dr: zero,
                            cr: accessoriesPortion,
                            accountType: "Purchased Item",
                            accountTransactionId: accountTransaction.id,
                        });
                    }
                    yield tx.accountTransactionDetails.createMany({ data: lines });
                    // 7. Mark order paid
                    yield tx.order.update({
                        where: { id: order.id },
                        data: { status: "paid" },
                    });
                    yield tx.booking.updateMany({
                        where: { orderId: order.id },
                        data: { status: "booked" }, // change to "paid" if you add it to the enum
                    });
                    return {
                        payment,
                        accountTransaction,
                        breakdown: { golfPortion, accessoriesPortion },
                    };
                }));
            }
            catch (err) {
                console.error("Error creating payment:", err);
                throw new app_error_1.APIError(String(err), app_error_1.STATUS_CODES.INTERNAL_ERROR, "Unable to create payment");
            }
        });
    }
    getPayment(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit }) {
            try {
                const skip = (page - 1) * limit;
                const [paymentDetails, total] = yield Promise.all([
                    prisma.payment.findMany({
                        select: {
                            accountTransaction: true,
                            order: true
                        },
                        skip,
                        take: limit,
                        orderBy: { id: "desc" },
                    }),
                    prisma.order.count(),
                ]);
                return { paymentDetails, total };
            }
            catch (error) {
                console.log("error", error);
                throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Unable to retrieve paymnents", true);
            }
        });
    }
}
exports.default = PaymentRepository;
