"use strict";
// import { Request, Response, NextFunction } from "express";
// import { ApiResponse } from "../../../utils/response-handler/response-handler";
// import GetGolfCourseService from "../../../services/customer-services/get-golf-course/get-golfcourse";
// export class GetGolfCourseController {
//   public service = new GetGolfCourseService();
//   constructor() {
//     this.getGolfCOurse = this.getGolfCOurse.bind(this);
//   }
//   async getGolfCOurse(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<any> {
//     try {
//       const { data } = await this.service.getGolfCourse();
//       return res.json(data);
//     } catch (error: any) {
//       return ApiResponse.error(
//         res,
//         error instanceof Error ? error.message : "An unexpected error occurred",
//         500
//       );
//     }
//   }
// }
