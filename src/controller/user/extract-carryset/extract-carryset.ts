// import { Request, Response, NextFunction } from "express";
// import { ApiResponse } from "../../../utils/response-handler/response-handler";
// import GetCarrysetService from "../../../services/customer-services/get-carryset/fetch-carryset";

// export class GetCarrysetController {
//   public service = new GetCarrysetService();
//   constructor() {
//     this.getCarrySet = this.getCarrySet.bind(this);
//   }
//   async getCarrySet(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<any> {
//     try {
//       const { data } = await this.service.fetchCarrySet();
//       console.log("dATA", data);
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
