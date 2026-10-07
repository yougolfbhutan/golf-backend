import { APIError, STATUS_CODES } from "../../../custom-error/app-error";
import { PrismaClient } from "../../../../generated/prisma";
import { FormateData } from "../../../utils/validation/validation";
import type { PermissionAttributes } from "../../../interface/admin/permission/permission";

const prisma = new PrismaClient();

class PermissionRepository {
  async createPermission(input: PermissionAttributes) {
    console.log("inputs from user", input);
    try {
      const CarrySet = await prisma.permission.create({
        data: {
          permission_name: input.permission_name,
        },
      });
      return FormateData({ CarrySet });
    } catch (err) {
      throw new APIError(
        "API_ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to add Permission",
        true,
      );
    }
  }
  async deletePermission(input: number): Promise<any | null> {
    try {
      const CarrySet = await prisma.permission.delete({
        where: {
          id: input,
        },
      });
      return FormateData({ CarrySet });
    } catch (err) {
      throw new APIError(
        "API_ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "No Permission to delete",
        true,
      );
    }
  }
  async updatePermission(
    id: number,
    updateData: {
      permission_name: string;
    },
  ): Promise<any | null> {
    try {
      const Permission = await prisma.permission.update({
        where: { id },
        data: {
          permission_name: updateData.permission_name,
        },
      });

      return FormateData({ Permission });
    } catch (err) {
      console.error("Prisma updatePermission error:", err);
      throw new APIError(
        "API_ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "No Permission to update",
        true,
      );
    }
  }
  async getPermission({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<any | null> {
    try {
      const skip = (page - 1) * limit;

      const [permissions, total] = await Promise.all([
        prisma.permission.findMany({ skip, take: limit }),
        prisma.permission.count(),
      ]);

      console.log("permission data",permissions)
      return { permissions, total };
    } catch (err) {
      console.error("Prisma getPermission error:", err);
      throw new APIError(
        "API_ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Failed to fetch Permissions",
        true,
      );
    }
  }
}

export default PermissionRepository;
