import { Request, Response, NextFunction } from "express";
import PermissionService from "../../../services/admin-services/permission/permission.service";
import { ApiResponse } from "../../../utils/response-handler/response-handler";
import UploadImportantFiles from "../upload-golf-course/constants";

export class CreatePermissionController {
  // public service = new UploadImportantFiles.AdminService();
  public service = new PermissionService();
  constructor() {
    this.addPermission = this.addPermission.bind(this);
    this.deletePermission = this.deletePermission.bind(this);
    this.updatePermission = this.updatePermission.bind(this);
    this.getPermission = this.getPermission.bind(this);
  }
  async addPermission(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { permission_name } = req.body;

      const { data } = await this.service.createPermission({
        permission_name,
      });

      return ApiResponse.success(
        res,
        "Permission added successfully",
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
  async deletePermission(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const permissionId = Number(req.params.id); // ✅ retrieve the ID from the URL
      const { data } = await this.service.deletePermissionService(permissionId);
      return ApiResponse.success(res, "Deleted Successuflly", 200, data);
    } catch (error: any) {
      return UploadImportantFiles.ApiResponse.error(
        res,
        error instanceof Error ? error.message : "An unexpected error occurred",
        500,
      );
    }
  }
  async updatePermission(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const permissionId = Number(req.params.id); // ✅ retrieve the ID from the URL
      console.log("permissionId", permissionId, req.body);
      const { data } = await this.service.updatePermissionService(
        permissionId,
        req.body,
      );
      return ApiResponse.success(
        res,
        "Permission updated successfully",
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
  async getPermission(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
      const { permissions, meta } = await this.service.getPermissionService({
        page,
        limit,
      });
      return ApiResponse.success(
        res,
        "Permission retrieved successfully",
        200,
        {
          data: permissions,
          meta: meta,
        },
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error instanceof Error ? error.message : "An unexpected error occurred",
        500,
      );
    }
  }
}
