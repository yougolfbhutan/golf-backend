import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../response-handler/response-handler";
import { RolePermissionRepository } from "../../model/admin/role-repository/role-repository";

export const checkPermission = (requirePermission: string) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        return ApiResponse.error(res, "Not authenticated", 401);
      }

      const rolePermissionRepo = new RolePermissionRepository();
      const customerData = await rolePermissionRepo.findRoleAndPermission(user.id);

      const userPermissions =
        customerData?.roles.flatMap(
          (cr) => cr.role?.permissions?.map((rp) => rp.permission.permission_name) ?? []
        ) ?? [];

      console.log("userPermissions", userPermissions);

      if (userPermissions.includes(requirePermission)) {
        return next();
      }

      return ApiResponse.error(res, "Insufficient permissions", 403);
    } catch (error: any) {
      console.error("checkPermission error:", error);
      return ApiResponse.error(
        res,
        error instanceof Error ? error.message : "An unexpected error occurred",
        403
      );
    }
  };
};
