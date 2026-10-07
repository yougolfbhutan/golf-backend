import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../utils/response-handler/response-handler";
import UploadImportantFiles from "../upload-golf-course/constants";
import RoleService from "../../../services/admin-services/role/role.service";

export class RoleController {
  // public service = new UploadImportantFiles.AdminService();
  public service = new RoleService();
  constructor() {
    this.createRole = this.createRole.bind(this);
    this.deleteRole = this.deleteRole.bind(this);
    this.updateRole = this.updateRole.bind(this);
      this.getRoles = this.getRoles.bind(this);
  }
  async createRole(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { role_name, permission_ids } = req.body; // <-- array of numbers, e.g. [1, 2, 3]

      const { data } = await this.service.createRole(
        role_name,
        permission_ids,
      );

      return ApiResponse.success(res, "Role added successfully", 200, data);
    } catch (error: any) {
      return UploadImportantFiles.ApiResponse.error(
        res,
        error instanceof Error ? error.message : "An unexpected error occurred",
        500,
      );
    }
  }
    async deleteRole(
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<any> {
      try {
        const roleId = Number(req.params.id); // ✅ retrieve the ID from the URL
        const { data } = await this.service.deleteRoleService(roleId);
        return ApiResponse.success(res, "Deleted Successuflly", 200, data);
      } catch (error: any) {
        return UploadImportantFiles.ApiResponse.error(
          res,
          error instanceof Error ? error.message : "An unexpected error occurred",
          500,
        );
      }
    }
    async updateRole(
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<any> {
      try {
        const roleId = Number(req.params.id); // ✅ retrieve the ID from the URL
    const { role_name, permission_ids } = req.body;
         const { data } = await this.service.updateRoleService(roleId, {
      role_name,
      permission_ids,
    });
        return ApiResponse.success(
          res,
          "Role updated successfully",
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
   async getRoles(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await this.service.getRoleService(page, limit);

    return ApiResponse.success(
      res,
      "Roles retrieved successfully",
      200,
      data,
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
