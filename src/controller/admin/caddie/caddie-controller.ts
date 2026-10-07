import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../utils/response-handler/response-handler";
import CaddieService from "../../../services/admin-services/caddie-services/caddie-services";
import UploadImportantFiles from "../upload-golf-course/constants";

export class CaddieController {
  public service = new CaddieService();
  constructor() {
    this.uploadCaddie = this.uploadCaddie.bind(this);
    this.deleteCaddie = this.deleteCaddie.bind(this);
    this.getCaddie = this.getCaddie.bind(this);
    this.updateCaddie = this.updateCaddie.bind(this);
  }
  async uploadCaddie(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { caddiename, cidNo, phone_number } = req.body;
      console.log("req.body caddie", req.body);

      const { data } = await this.service.createCaddie({
        caddiename,
        cidNo,
        phone_number,
      });
      return ApiResponse.success(res, "Caddie created successfully", 200, data);
    } catch (error: any) {
      return UploadImportantFiles.ApiResponse.error(
        res,
        error instanceof Error ? error.message : "An unexpected error occurred",
        500,
      );
    }
  }

  async deleteCaddie(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const carrySetId = Number(req.params.id); // ✅ retrieve the ID from the URL

      const { data } = await this.service.deleteCaddieService(carrySetId);
      return ApiResponse.success(res, "Deleted Successuflly", 200, data);
    } catch (error: any) {
      return UploadImportantFiles.ApiResponse.error(
        res,
        error instanceof Error ? error.message : "An unexpected error occurred",
        500,
      );
    }
  }
  async updateCaddie(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const carrySetId = Number(req.params.id); // ✅ retrieve the ID from the URL

      const { data } = await this.service.updateCaddieService(
        carrySetId,
        req.body,
      );
      return ApiResponse.success(res, "Caddie updated successfully", 200, data);
    } catch (error: any) {
      return UploadImportantFiles.ApiResponse.error(
        res,
        error instanceof Error ? error.message : "An unexpected error occurred",
        500,
      );
    }
  }
  async getCaddie(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100); // cap it so nobody requests 1M rows

      const { data } = await this.service.getCaddieService({ page, limit });

      return ApiResponse.success(
        res,
        "Caddie retrieved successfully",
        200,
        { caddies: data.caddies, meta: data.meta }, // single 4th argument
      );
    } catch (error: any) {
      return UploadImportantFiles.ApiResponse.error(
        res,
        error instanceof Error ? error.message : "An unexpected error occurred",
        500,
      );
    }
  }
}
