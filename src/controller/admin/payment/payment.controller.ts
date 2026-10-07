import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../utils/response-handler/response-handler";
import UploadImportantFiles from "../upload-golf-course/constants";
import PaymentService from "../../../services/admin-services/payment/payment.service";

export class PaymentController {
  public service = new PaymentService();
  constructor() {
    this.createPayment = this.createPayment.bind(this);
    this.getPayment = this.getPayment.bind(this);
    // this.getPayment = this.getPayment.bind(this);
    // this.updatePayment = this.updatePayment.bind(this);
  }
  async createPayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const {
        BookingId,
        paymentAmount,
        paymentDate,
        PaymentMethod,
        journalNumber,
        referenceNumber,
      } = req.body;
      const { data } = await this.service.createPayment({
        BookingId,
        paymentAmount,
        paymentDate,
        PaymentMethod,
        journalNumber,
        referenceNumber,
      });
      return ApiResponse.success(
        res,
        "Payment created successfully",
        200,
        data,
      );
    } catch (error: any) {
      console.log("Error in createPayment:", error);
      return UploadImportantFiles.ApiResponse.error(
        res,
        error instanceof Error ? error.message : "An unexpected error occurred",
        500,
      );
    }
  }

  async getPayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
      const result = await this.service.getPayment({ page, limit });

      if (!result) {
        return ApiResponse.error(res, "Failed to retrieve payment", 401);
      }
      return ApiResponse.success(
        res,
        "ItemVariant retrieved successfully",
        200,
        result,
      );
    } catch (error: any) {
      console.log("error", error);
      return ApiResponse.error(
        res,
        error instanceof Error ? error.message : "An unexpected error occurred",
        500,
      );
    }
  }

  //   async cancelBooking(
  //     req: Request,
  //     res: Response,
  //     next: NextFunction,
  //   ): Promise<any> {
  //     try {
  //       const BookingId = Number(req.params.BookingId);
  //       const { partyEmail, partyName, partyPhone } = req.body;
  //       const result = await this.service.cancelBookingService(BookingId, {
  //         partyEmail,
  //         partyName,
  //         partyPhone,
  //       });
  //       if (!result) {
  //         return ApiResponse.error(res, "Invalid login credentials", 401);
  //       }

  //       const { data } = result;
  //       //   return res.json(data);
  //       return ApiResponse.success(res, "Successfully logged in", 200, data);
  //     } catch (error: any) {
  //       return ApiResponse.error(
  //         res,
  //         error instanceof Error ? error.message : "An unexpected error occurred",
  //         500,
  //       );
  //     }
  //   }
}
