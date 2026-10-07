import { Request, Response, NextFunction } from "express";
import PermissionService from "../../../services/admin-services/permission/permission.service";
import { ApiResponse } from "../../../utils/response-handler/response-handler";
import UploadImportantFiles from "../upload-golf-course/constants";
import UserService from "../../../services/admin-services/user-services";

export class CreateUserController {
  // public service = new UploadImportantFiles.AdminService();
  public service = new UserService();
  constructor() {
    this.createUser = this.createUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.getUsers = this.getUsers.bind(this);
  }
  async createUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { customer_name,email,password,phone_number,roles,permissions } = req.body;

      const { data } = await this.service.createUser({
        customer_name,
        email,
        password,
        phone_number,
        roles,
        permissions
      });

      return ApiResponse.success(
        res,
        "User added successfully",
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
  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const userId = Number(req.params.id); // ✅ retrieve the ID from the URL
      const { data } = await this.service.deleteUserService(userId);
      return ApiResponse.success(res, "User deleted successfully", 200, data);
    } catch (error: any) {
      return UploadImportantFiles.ApiResponse.error(
        res,
        error instanceof Error ? error.message : "An unexpected error occurred",
        500,
      );
    }
  }
  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const userId = Number(req.params.id); // ✅ retrieve the ID from the URL
      const { data } = await this.service.updateUserService(
        userId,
        req.body,
      );
      return ApiResponse.success(
        res,
        "User updated successfully",
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
  async getUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
      const { users, meta } = await this.service.getUsersService({
        page,
        limit,
      });
      return ApiResponse.success(
        res,
        "Users retrieved successfully",
        200,
        {
          data: users,
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
