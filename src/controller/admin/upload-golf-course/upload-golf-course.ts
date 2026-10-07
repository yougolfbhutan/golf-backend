import { Request, Response, NextFunction } from "express";
import UploadImportantFiles from "./constants";
import { ApiResponse } from "../../../utils/response-handler/response-handler";

export class UploadGolfCourse {
    // public service = new UploadImportantFiles.AdminService();

  constructor() {
    this.uploadGolfCourse = this.uploadGolfCourse.bind(this);
  }
  async uploadGolfCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      console.log('req.body',req.body)
      const {
        golf_course_name,
        golf_course_location_name,
        golf_course_location_description,
      } = req.body;

    
      // const {data} = await this.service.ResgisterGolfCourse({
      //    golf_course_name,
      //   golf_course_location_name,
      //   golf_course_location_description,
      // })
     return  ApiResponse.success(res, "Successfully logged in", 200);
    } catch (error: any) {
      return UploadImportantFiles.ApiResponse.error(
        res,
        error instanceof Error ? error.message : "An unexpected error occurred",
        500
      );
    }
  }

}
