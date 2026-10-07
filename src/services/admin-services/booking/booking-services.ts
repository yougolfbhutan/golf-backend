import type { BookingStatus } from "../../../../generated/prisma";
import type { CreateBookingInput } from "../../../interface/booking/golfcourse-booking";
import { errorHandler } from "../../../middleware/errorHandler/common-errror-handler";
import BookingRepository from "../../../model/admin-repository/booking-repository/booking-repository";
import {
  sendCustomerConfirmation,
  sendAdminNotification,
  sendBookingApprovedEmail,
} from "../../../utils/mailer/bookingemailtemplates/booking-email-templates";
import { FormateData } from "../../../utils/validation/validation";

class BookingService {
  repository: BookingRepository;
  constructor() {
    this.repository = new BookingRepository();
  }

  async createBooking(input: CreateBookingInput) {
    try {
      // const validated = await createBookingSchema.validate(input, {
      //   abortEarly: false,
      //   stripUnknown: true,
      // });
      const { booking } = await this.repository.createBooking(
input,      );

      // Adjust these fields to what your email templates expect
      const emailData = {
        partyName: booking.partyName,
        partyEmail: booking.partyEmail,
        partyPhone: booking.partyPhone,
        teeTime: booking.teeTime,
        totalPrice: booking.totalPrice.toString(),
        bookingId: booking.id,
        reference: booking.reference,
      };

      // The booking is already saved, so a failed email must not fail the request
      const results = await Promise.allSettled([
        sendCustomerConfirmation(emailData as any),
        sendAdminNotification(emailData as any),
      ]);
      results.forEach((r) => {
        if (r.status === "rejected") console.error("Booking email failed:", r.reason);
      });

      return FormateData({ booking });
    } catch (error: unknown) {
      throw error; // controller maps ValidationError -> 400, APIError -> its status
    }
  }

  async approveBooking(id: number) {
    try {
      const { booking } = await this.repository.approveBooking(id);

      const [res] = await Promise.allSettled([
        sendBookingApprovedEmail({
          partyName: booking.partyName,
          partyEmail: booking.partyEmail,
          totalPrice: booking.totalPrice.toString(),
          bookingId: booking.id,
        } as any),
      ]);
      if (res.status === "rejected") console.error("Approval email failed:", res.reason);

      return FormateData({ booking });
    } catch (error: unknown) {
      throw errorHandler(error);
    }
  }

  async cancelBooking(id: number) {
    try {
      const { booking } = await this.repository.cancelBooking(id);
      return FormateData({ booking });
    } catch (error: unknown) {
      throw errorHandler(error);
    }
  }

  // async getOrderBooking(params: { page: number; limit: number; status?: BookingStatus }) {
  //   try {
  //     const { results, meta } = await this.repository.getOrderBook(params);
  //     return FormateData({ results, meta }); // meta already has page, limit, total, totalPages
  //   } catch (error: unknown) {
  //     throw errorHandler(error);
  //   }
  // }
}

export default BookingService;