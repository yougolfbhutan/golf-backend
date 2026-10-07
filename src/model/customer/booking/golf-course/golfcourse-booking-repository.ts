// import { PrismaClient } from "../../../../../generated/prisma";
// import { APIError, STATUS_CODES } from "../../../../custom-error/app-error";
// import { BookingCreatedResponseAttributes } from "../../../../interface/booking/extract-booking";
// import { BookingInput } from "../../../../interface/booking/golfcourse-booking";

// const prisma = new PrismaClient();

// class GolfCourseBookingRepository {
//   async createGolfCourseBooking(input: BookingInput): Promise<BookingCreatedResponseAttributes> {
//     const { date, golfCourseId, customerId, carrySetId } = input;
//     if (!date) {
//       throw new APIError(
//         "Missing date",
//         STATUS_CODES.BAD_REQUEST,
//         "Booking date is required"
//       );
//     }

//     const parsedDate = new Date(date);

//     if (isNaN(parsedDate.getTime())) {
//       throw new APIError(
//         "Invalid date format",
//         STATUS_CODES.BAD_REQUEST,
//         "Provided booking date is invalid"
//       );
//     }

//     const start = new Date(parsedDate);
//     start.setHours(0, 0, 0, 0);
//     const end = new Date(parsedDate);
//     end.setHours(23, 59, 59, 999);

//     const carrySet = await prisma.carrySet.findUnique({
//       where: {
//         id: input.carrySetId,
//       },
//     });
//     if (!carrySet) {
//       throw new APIError(
//         "Golf Ground does not exist",
//         STATUS_CODES.BAD_REQUEST,
//         "You have made wrong choice regarding the golf course"
//       );
//     }

//     if (!carrySet?.availibility) {
//       throw new APIError(
//         "Carry Set is not available",
//         STATUS_CODES.BAD_REQUEST,
//         "Sorry, carry set is not available"
//       );
//     }

//     const existingBooking = await prisma.booking_Golf_Course.findFirst({
//       where: {
//         booking_status: "booked",
//         date: {
//           gte: start,
//           lte: end,
//         },
//       },
//     });

//     if (existingBooking) {
//       throw new APIError(
//         "Slot already booked",
//         STATUS_CODES.BAD_REQUEST,
//         "Slot already booked - not available"
//       );
//     }

//     try {
//       const booking = await prisma.booking_Golf_Course.create({
//         data: {
//           booking_status: "booked",
//           date: new Date(date),
//           customer: {
//             connect: {
//               id: customerId,
//             },
//           },
//           golfCourse: {
//             connect: {
//               id: golfCourseId,
//             },
//           },
//           carrySet: {
//             connect: {
//               id: carrySetId,
//             },
//           },
//         },
//       });

//       await prisma.carrySet.update({
//         where: { id: carrySetId },
//         data: { availibility: false },
//       });

      
//       return booking;
//     } catch (error) {
//       throw new APIError(
//         String(error),
//         STATUS_CODES.INTERNAL_ERROR,
//         "Unable to book the golf course"
//       );
//     }
//   }

//   async cancelGolfCourseBooking(input: number): Promise<any | string> {
//     const bookingId = input;

//     try {
//       const booking = await prisma.booking_Golf_Course.findUnique({
//         where: { id: bookingId },
//         include: { carrySet: true },
//       });
//       if (!booking) {
//         throw new APIError("Booking not found", STATUS_CODES.NOT_FOUND);
//       }
//       if (booking.booking_status === "cancelled") {
//         throw new APIError(
//           "Booking already cancelled",
//           STATUS_CODES.BAD_REQUEST
//         );
//       }
//       const cancelledBooking = await prisma.booking_Golf_Course.update({
//         where: { id: bookingId },
//         data: { booking_status: "cancelled" },
//       });
//       if (booking.carrySetId) {
//         await prisma.carrySet.update({
//           where: { id: booking.carrySetId },
//           data: { availibility: true },
//         });
//       }

//       return cancelledBooking;
//     } catch (error: unknown) {
//       throw new APIError(
//         String(error),
//         STATUS_CODES.INTERNAL_ERROR,
//         "cannot Cancel the booking"
//       );
//     }
//   }
// }

// export default GolfCourseBookingRepository;
