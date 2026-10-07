// import { Request, Response, NextFunction } from "express";
// import { ApiResponse } from "../../../../utils/response-handler/response-handler";

// export class GolfCourseBooking {
//   public service = new BookingService();
//   constructor() {
//     this.bookingGolfCourse = this.bookingGolfCourse.bind(this);
//     this.cancelBooking = this.cancelBooking.bind(this);
//   }
//   async bookingGolfCourse(
//     req: Request,
//     res: Response,
//     next: NextFunction,
//   ): Promise<any> {
//     try {
//       // const user = (req as any).user;

//       // if (!user?.id) {
//       //   return ApiResponse.error(res, "Unauthorized: Missing user ID", 401);
//       // }
//       // const customerId = Number(user.id);
//       const golfCourseId = Number(req.params.golfCourseId);
//       const carrySetId = Number(req.params.carrySetId);
//       const { date } = req.body;
//       console.log("req.body",req.body)
//       const { data } = await this.service.createCourseBooking({
//         // customerId,
//         golfCourseId,
//         carrySetId,
//         date,
//       });
//       return ;
//     } catch (error: any) {
//       return ApiResponse.error(
//         res,
//         error instanceof Error ? error.message : "An unexpected error occurred",
//         500,
//       );
//     }
//   }
//   async cancelBooking(
//     req: Request,
//     res: Response,
//     next: NextFunction,
//   ): Promise<any> {
//     try {
//       const BookingId = Number(req.params.BookingId);
//       const {PartyEmail,partyName,partyPhone} = req.body
//       const result = await this.service.cancelBookingService(BookingId, {PartyEmail,partyName,partyPhone});
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
// }
