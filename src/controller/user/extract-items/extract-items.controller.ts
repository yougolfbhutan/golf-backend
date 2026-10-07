import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../utils/response-handler/response-handler";
import UploadImportantFiles from "../../admin/upload-golf-course/constants";
import ExtractItemService from "../../../services/customer-services/extract-item/extract-item.services";

export class ExtractItemController {
  // public service = new UploadImportantFiles.AdminService();
  public service = new ExtractItemService();
  constructor() {
    this.extractItem = this.extractItem.bind(this);
  }
  async extractItem(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { data } = await this.service.extractItemService();
      return ApiResponse.success(
        res,
        "ItemVariant retrieved successfully",
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
