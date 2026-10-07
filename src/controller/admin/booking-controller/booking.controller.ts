import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../utils/response-handler/response-handler";
import BookingService from "../../../services/admin-services/booking/booking-services";
import { BookingStatus } from "../../../../generated/prisma";

const statusOf = (e: any) =>
  e?.name === "ValidationError" ? 400 : e?.statusCode || 500;
const messageOf = (e: any) =>
  e?.name === "ValidationError"
    ? e.errors.join(", ")
    : e?.message ?? "An unexpected error occurred";

export class BookingController {
  public service = new BookingService();
  constructor() {
    this.createBooking = this.createBooking.bind(this);
    this.approveBooking = this.approveBooking.bind(this);
    this.cancelBooking = this.cancelBooking.bind(this);
    }

  async createBooking(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      // The service validates and strips unknown fields (including any totalPrice)
      const { data } = await this.service.createBooking(req.body);
      return ApiResponse.success(res, "Booking created successfully", 201, data);
    } catch (error: any) {
      return ApiResponse.error(res, messageOf(error), statusOf(error));
    }
  }

  async approveBooking(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id < 1) {
        return ApiResponse.error(res, "Invalid booking id", 400);
      }
      const { data } = await this.service.approveBooking(id);
      return ApiResponse.success(res, "Booking approved successfully", 200, data);
    } catch (error: any) {
      return ApiResponse.error(res, messageOf(error), statusOf(error));
    }
  }

  async cancelBooking(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id < 1) {
        return ApiResponse.error(res, "Invalid booking id", 400);
      }
      const { data } = await this.service.cancelBooking(id);
      return ApiResponse.success(res, "Booking cancelled successfully", 200, data);
    } catch (error: any) {
      return ApiResponse.error(res, messageOf(error), statusOf(error));
    }
  }

  // async getOrderBooking(req: Request, res: Response, next: NextFunction): Promise<any> {
  //   try {
  //     const page = Math.max(Number(req.query.page) || 1, 1);
  //     const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);

  //     let status: BookingStatus | undefined;
  //     if (req.query.status) {
  //       const raw = String(req.query.status);
  //       if (!Object.values(BookingStatus).includes(raw as BookingStatus)) {
  //         return ApiResponse.error(res, "Invalid status filter", 400);
  //       }
  //       status = raw as BookingStatus;
  //     }

  //     const { data } = await this.service.getOrderBooking({ page, limit, status });
  //     return ApiResponse.success(res, "Bookings retrieved successfully", 200, data);
  //   } catch (error: any) {
  //     return ApiResponse.error(res, messageOf(error), statusOf(error));
  //   }
  // }
}