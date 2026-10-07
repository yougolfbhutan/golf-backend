import { PrismaClient, Customer } from "../../../../generated/prisma";
import { APIError, STATUS_CODES } from "../../../custom-error/app-error";
import { CaddieAttributes } from "../../../interface/admin/caddie/caddie-interface";
import { FormateData } from "../../../utils/validation/validation";
// Customer
const prisma = new PrismaClient();

class RoleRepository {
  async createRole(
    input: string,
    permissionIds: number[] = [],
  ): Promise<any | string> {
    try {
      const role = await prisma.role.create({
        data: {
          role_name: input,
          permissions: {
            create: permissionIds.map((permissionId) => ({
              permission: { connect: { id: permissionId } },
            })),
          },
        },
        include: {
          permissions: { include: { permission: true } },
        },
      });
      return role;
    } catch (err) {
      console.log("afszvczx");
      throw new APIError(
        String(err),
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Role",
      );
    }
  }
  async deleteRole(input: number): Promise<any | null> {
    try {
      const Role = await prisma.role.delete({
        where: {
          id: input,
        },
      });
      return FormateData({ Role });
    } catch (err) {
      throw new APIError(
        "API_ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "No Permission to delete",
        true,
      );
    }
  }
  async updateRole(
    id: number,
    input: { role_name?: string; permission_ids?: number[] },
  ): Promise<any> {
    try {
      const { role_name, permission_ids } = input;

      const role = await prisma.$transaction(async (tx) => {
        // 1. Update role_name if provided
        const updatedRole = await tx.role.update({
          where: { id },
          data: {
            ...(role_name !== undefined && { role_name }),
          },
        });

        // 2. If permission_ids provided, replace the whole set
        if (permission_ids !== undefined) {
          await tx.rolePermission.deleteMany({
            where: { roleId: id },
          });

          if (permission_ids.length > 0) {
            await tx.rolePermission.createMany({
              data: permission_ids.map((permissionId) => ({
                roleId: id,
                permissionId,
              })),
              skipDuplicates: true,
            });
          }
        }

        // 3. Return role with fresh permissions attached
        return tx.role.findUnique({
          where: { id },
          include: { permissions: { include: { permission: true } } },
        });
      });

      return role;
    } catch (err: any) {
      if (err.code === "P2025") {
        throw new APIError(
          "NOT_FOUND",
          STATUS_CODES.NOT_FOUND,
          "Role not found",
          true,
        );
      }
      throw new APIError(
        String(err),
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to update role",
        true,
      );
    }
  }
  async getRole(page: number, limit: number) {
  try {
    const skip = (page - 1) * limit;

    const [roles, total] = await prisma.$transaction([
      prisma.role.findMany({
        skip,
        take: limit,
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      }),
      prisma.role.count(),
    ]);

    return { roles, total };
  } catch (err) {
    console.error("Prisma getRole error:", err);
    throw new APIError(
      "API_ERROR",
      STATUS_CODES.INTERNAL_ERROR,
      "Failed to fetch Roles",
      true,
    );
  }
}
}

export default RoleRepository;
