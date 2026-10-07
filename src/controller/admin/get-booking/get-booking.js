"use strict";
// import { Request, Response, NextFunction } from "express";
// import { ApiResponse } from "../../../utils/response-handler/response-handler";
// import BookingService from "../../../services/admin-services/booking/booking-services";
// export class GetBookingcontroller {
//   public service = new BookingService();
//   constructor() {
//     this.getBooking = this.getBooking.bind(this);
//   }
//   async getBooking(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<any> {
//     console.log("gey")
//     try {
//       const { data } = await this.service.getBooking();
//       if(data){
//         return res.json(data);
//       }else{
//         console.log("hello")
//       }
//     } catch (error: any) {
//       return ApiResponse.error(
//         res,
//         error instanceof Error ? error.message : "An unexpected error occurred",
//         500
//       );
//     }
//   }
// }
