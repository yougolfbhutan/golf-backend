import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../utils/response-handler/response-handler";
import UploadImportantFiles from "../upload-golf-course/constants";
import SouvenirService from "../../../services/admin-services/souvenir/souvenir.services";

export class SouvenirController {
  // public service = new UploadImportantFiles.AdminService();
  public service = new SouvenirService();
  constructor() {
    this.createSouvenir = this.createSouvenir.bind(this);
    this.deleteSouvenir = this.deleteSouvenir.bind(this);
    this.updateSouvenir = this.updateSouvenir.bind(this);
    this.getSouvenirs = this.getSouvenirs.bind(this);
  }
  async createSouvenir(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { name, description, categoryId } = req.body; // <-- array of numbers, e.g. [1, 2, 3]
      const { data } = await this.service.createSouvenir({
        name,
      description,
        categoryId,
      });

      return ApiResponse.success(res, "Souvenir added successfully", 200, data);
    } catch (error: any) {
      return UploadImportantFiles.ApiResponse.error(
        res,
        error instanceof Error ? error.message : "An unexpected error occurred",
        500,
      );
    }
  }
  async deleteSouvenir(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const souvenirId = Number(req.params.id); // ✅ retrieve the ID from the URL
      const { data } = await this.service.deleteSouvenirService(souvenirId);
      return ApiResponse.success(
        res,
        "Deleted Souvenir Successfully",
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

  async updateSouvenir(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const souvenirId = Number(req.params.id); // ✅ retrieve the ID from the URL
      const { name, description, categoryId } = req.body; // <-- array of numbers, e.g. [1, 2, 3]
      // const cloudinaryUrls = req.body.cloudinaryUrls;
      // if (cloudinaryUrls.length === 0) {
      //   return UploadImportantFiles.APIError;
      //   // return res.status(500).send("Internal Server Error");
      // }
      // let Availability;
      // if (availability == "true") {
      //   Availability = true;
      // } else {
      //   Availability = false;
      // }
      const { data } = await this.service.updateSouvenirService(souvenirId, {
        name,
        description,
        categoryId,
      });
      return ApiResponse.success(
        res,
        "Souvenir updated successfully",
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
    async getSouvenirs(
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<any> {
      try {
         const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100); // cap it so nobody requests 1M rows
        const { data } = await this.service.getSouvenirsService(page, limit);
        return ApiResponse.success(
          res,
          "Souvenirs retrieved successfully",
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
}
