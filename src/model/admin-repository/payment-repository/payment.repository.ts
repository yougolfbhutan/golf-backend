import { PrismaClient, Prisma } from "../../../../generated/prisma";
import { APIError, STATUS_CODES } from "../../../custom-error/app-error";
import type { GetAttributes } from "../../../interface/getattributesinterface";
import type { PaymentAttributes } from "../../../interface/paymentt/payment.interface";

const prisma = new PrismaClient();

class PaymentRepository {
  async createPayment(input: PaymentAttributes) {
    console.log("createPayment input:", input);
    try {
      return await prisma.$transaction(async (tx) => {
        // 1. Resolve the order (via booking, since Payment.orderId is required)
        const booking = await tx.booking.findUnique({
          where: { id: input.BookingId },
          include: {
            order: {
              include: { cart: { include: { items: true } } },
            },
          },
        });

        if (!booking) throw new Error("Booking not found");
        if (!booking.orderId || !booking.order) {
          throw new Error("Booking has no associated order");
        }

        const order = booking.order;

        // 2. Reject double payment on the same order
        const existingPayment = await tx.payment.findUnique({
          where: { orderId: order.id },
        });
        if (existingPayment) {
          throw new Error("This order has already been paid");
        }

        // 3. Recompute the golf/accessories split from source data
        //    (never trust a client-sent total)
        const golfPrice = await tx.golfCourse.findUnique({
          where: { id: booking.golfCourseId },
          select: { price: true },
        });
        const golfPortion = golfPrice
          ? new Prisma.Decimal(golfPrice.price)
          : new Prisma.Decimal(0);

        const accessoriesPortion = (order.cart?.items ?? []).reduce(
          (sum, item) => sum.plus(item.unitPrice.times(item.quantity)),
          new Prisma.Decimal(0),
        );
        console.log("Golf Portion:", golfPortion.toString());
        console.log("Accessories Portion:", accessoriesPortion.toString());
        const computedTotal = golfPortion.plus(accessoriesPortion);
        console.log("Computed Total:", computedTotal.toString());
        console.log("Order Total Price:", order.totalPrice.toString());

        if (!computedTotal.equals(order.totalPrice)) {
          // Guards against stale/partial data — order total should always
          // equal golf + accessories at this point
          throw new Error(
            "Order total does not match golf + accessories breakdown",
          );
        }

        const amount = new Prisma.Decimal(input.paymentAmount);
        if (!amount.equals(computedTotal)) {
          throw new Error("Payment amount does not match order total");
        }

        // 4. Create the Payment
        const payment = await tx.payment.create({
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
        const accountTransaction = await tx.accountTransaction.create({
          data: {
            voucher_no: input.journalNumber,
            voucher_amount: amount,
            voucher_date: new Date(), // 👈 fixed
            paymentId: payment.id,
          },
        });

        // 6. Build the ledger lines: 1 debit + 1-2 credits
        const zero = new Prisma.Decimal(0);
        const lines: Prisma.AccountTransactionDetailsCreateManyInput[] = [
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

        await tx.accountTransactionDetails.createMany({ data: lines });

        // 7. Mark order paid
        await tx.order.update({
          where: { id: order.id },
          data: { status: "paid" },
        });

        await tx.booking.updateMany({
          where: { orderId: order.id },
          data: { status: "booked" }, // change to "paid" if you add it to the enum
        });

        return {
          payment,
          accountTransaction,
          breakdown: { golfPortion, accessoriesPortion },
        };
      });
    } catch (err) {
      console.error("Error creating payment:", err);
      throw new APIError(
        String(err),
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to create payment",
      );
    }
  }
  async getPayment({page,limit}:GetAttributes){
    try {
      const skip = (page - 1) * limit;

    const [paymentDetails,total]= await Promise.all([
      prisma.payment.findMany({
        select:{
          accountTransaction:true,
          order:true
        },
          skip,
        take: limit,
        orderBy: { id: "desc" },
      }),
           prisma.order.count(),

    ])

      return { paymentDetails, total };
    } catch (error) {
      console.log("error",error)
      throw new APIError(
      "API_ERROR",
      STATUS_CODES.INTERNAL_ERROR,
      "Unable to retrieve paymnents",
      true,
    );
    }
  }
}

export default PaymentRepository;
