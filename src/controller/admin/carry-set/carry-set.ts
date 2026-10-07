import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../utils/response-handler/response-handler";
import UploadImportantFiles from "../upload-golf-course/constants";
import AddCarrySet from "../../../services/admin-services/add-carry-set/admin-add-carry-set";

export class UploadCarrySet {
  // public service = new UploadImportantFiles.AdminService();
  public service = new AddCarrySet();
  constructor() {
    this.addCarrySet = this.addCarrySet.bind(this);
    this.deleteCarrySet = this.deleteCarrySet.bind(this);
    this.updateCarrySet = this.updateCarrySet.bind(this);
    this.getCarrySet = this.getCarrySet.bind(this);
  }
  async addCarrySet(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const {
        golfsetname,
        tier,
        handedness,
        audience,
        price,
        description,
        availability,
      } = req.body;
      const cloudinaryUrls = req.body.cloudinaryUrls;
      if (cloudinaryUrls.length === 0) {
        return UploadImportantFiles.APIError;
        // return res.status(500).send("Internal Server Error");
      }
      const { data } = await this.service.addCarrySetService({
        golfsetname,
        tier,
        handedness,
        audience,
        price,
        description,
        availability,
        urls: cloudinaryUrls,
      });

      return ApiResponse.success(
        res,
        "Carry set added successfully",
        200,
        data,
      );
    } catch (error: any) {
      return UploadImportantFiles.ApiResponse.error(
        res,
        error instanceof Error ? error.message : "An unexpected error occurred",
        500,
      );
    }
  }
  async deleteCarrySet(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const carrySetId = Number(req.params.id); // ✅ retrieve the ID from the URL
      const { data } = await this.service.deleteCarrySetService(carrySetId);
      return ApiResponse.success(
        res,
        "Deleted Carry Set Successfully",
        200,
        data,
      );
    } catch (error: any) {
      return UploadImportantFiles.ApiResponse.error(
        res,
        error instanceof Error ? error.message : "An unexpected error occurred",
        500,
      );
    }
  }
  async updateCarrySet(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const carrySetId = Number(req.params.id); // ✅ retrieve the ID from the URL
      console.log("carrySetId", carrySetId, req.body);
      const { data } = await this.service.updateCarrySetService(
        carrySetId,
        req.body,
      );
      return ApiResponse.success(
        res,
        "Carry set updated successfully",
        200,
        data,
      );
    } catch (error: any) {
      return UploadImportantFiles.ApiResponse.error(
        res,
        error instanceof Error ? error.message : "An unexpected error occurred",
        500,
      );
    }
  }
  async getCarrySet(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);

      const { data } = await this.service.getCarrySetService({ page, limit });

      return ApiResponse.success(res, "Carry set retrieved successfully", 200, {
        carrySets: data.carrySets,
        meta: data.meta,
      });
    } catch (error: any) {
      const statusCode = error?.statusCode || 500;
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      return ApiResponse.error(res, message, statusCode);
    }
  }
}
