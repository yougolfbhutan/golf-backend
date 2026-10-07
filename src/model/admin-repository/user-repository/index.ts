import { APIError, STATUS_CODES } from "../../../custom-error/app-error";
import { PrismaClient } from "../../../../generated/prisma";
import {
  FormateData,
  GeneratePassword,
  GenerateSalt,
} from "../../../utils/validation/validation";
import type { UserFormAttributes } from "../../../interface/admin/user-interface";

const prisma = new PrismaClient();

class UserRepository {
  async createUser(input: UserFormAttributes) {
    try {
      const existingRoles = await prisma.role.findMany({
        where: { id: { in: input.roles } },
        select: { id: true },
      });

      const existingRoleIds = new Set(existingRoles.map((r) => r.id));
      const missingRoleIds = input.roles.filter(
        (id) => !existingRoleIds.has(id),
      );

      if (missingRoleIds.length > 0) {
        throw new APIError(
          "API_ERROR",
          STATUS_CODES.BAD_REQUEST,
          `Invalid role id(s): ${missingRoleIds.join(", ")}`,
          true,
        );
      }

      const userdata = await prisma.$transaction(async (tx) => {
        // 1. Create the customer + attach roles via CustomerRole
        const customer = await tx.customer.create({
          data: {
            customer_name: input.customer_name,
            email: input.email,
            password: input.password, // ⚠️ hash before this point — see note below
            phone_number: input.phone_number,
            roles: {
              create: input.roles.map((roleId) => ({
                role: { connect: { id: roleId } },
              })),
            },
          },
        });

        // 2. Attach permissions directly to THIS customer only.
        //    Permissions no longer live on Role — this is per-user.
        if (input.permissions?.length) {
          await tx.customerPermission.createMany({
            data: input.permissions.map((permissionId) => ({
              customerId: customer.id,
              permissionId,
            })),
            skipDuplicates: true,
          });
        }

        // 3. Return the customer with roles + permissions populated
        return tx.customer.findUnique({
          where: { id: customer.id },
          include: {
            roles: { include: { role: true } },
            permissions: { include: { permission: true } },
          },
        });
      });

      return FormateData({ userdata });
    } catch (err) {
      console.error("Prisma createUser error:", err);
      throw err instanceof APIError
        ? err
        : new APIError(
            "API_ERROR",
            STATUS_CODES.INTERNAL_ERROR,
            "Unable to add User",
            true,
          );
    }
  }

  async deleteUser(input: number): Promise<any | null> {
    try {
      const userdata = await prisma.customer.delete({
        where: {
          id: input,
        },
      });
      return FormateData({ userdata });
    } catch (err) {
      throw new APIError(
        "API_ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "No Permission to delete",
        true,
      );
    }
  }

  async updateUser(
    id: number,
    updateData: UserFormAttributes,
  ): Promise<any | null> {
    try {
      // Validate role ids up front too, same as createUser
      if (updateData.roles?.length) {
        const existingRoles = await prisma.role.findMany({
          where: { id: { in: updateData.roles } },
          select: { id: true },
        });
        const existingRoleIds = new Set(existingRoles.map((r) => r.id));
        const missingRoleIds = updateData.roles.filter(
          (rid) => !existingRoleIds.has(rid),
        );
        if (missingRoleIds.length > 0) {
          throw new APIError(
            "API_ERROR",
            STATUS_CODES.BAD_REQUEST,
            `Invalid role id(s): ${missingRoleIds.join(", ")}`,
            true,
          );
        }
      }

      const userdata = await prisma.$transaction(async (tx) => {
        const scalarData: Record<string, any> = {};
        if (updateData.customer_name !== undefined)
          scalarData.customer_name = updateData.customer_name;
        if (updateData.email !== undefined)
          scalarData.email = updateData.email;
        if (updateData.phone_number !== undefined)
          scalarData.phone_number = updateData.phone_number;

        // hash with a NEW salt whenever password changes
        if (
          updateData.password !== undefined &&
          updateData.password.trim() !== ""
        ) {
          const newSalt = await GenerateSalt();
          scalarData.password = await GeneratePassword(
            updateData.password,
            newSalt,
          );
          scalarData.salt = newSalt; // must update salt alongside password!
        }

        await tx.customer.update({
          where: { id },
          data: scalarData,
        });

        // 2. If roles were provided, replace the customer's role set
        if (updateData.roles) {
          await tx.customerRole.deleteMany({ where: { customerId: id } });
          if (updateData.roles.length) {
            await tx.customerRole.createMany({
              data: updateData.roles.map((roleId) => ({
                customerId: id,
                roleId,
              })),
              skipDuplicates: true,
            });
          }
        }

        // 3. If permissions were provided, replace this customer's permission set.
        //    Runs on an explicit empty array too, so clearing all permissions works.
        if (updateData.permissions !== undefined) {
          await tx.customerPermission.deleteMany({ where: { customerId: id } });
          if (updateData.permissions.length) {
            await tx.customerPermission.createMany({
              data: updateData.permissions.map((permissionId) => ({
                customerId: id,
                permissionId,
              })),
              skipDuplicates: true,
            });
          }
        }

        // 4. Return the fully populated customer
        return tx.customer.findUnique({
          where: { id },
          include: {
            roles: { include: { role: true } },
            permissions: { include: { permission: true } },
          },
        });
      });

      return FormateData({ userdata });
    } catch (err) {
      console.error("Prisma updateUser error:", err);
      throw err instanceof APIError
        ? err
        : new APIError(
            "API_ERROR",
            STATUS_CODES.INTERNAL_ERROR,
            "Unable to update user",
            true,
          );
    }
  }

  async getUsers({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<any | null> {
    try {
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        prisma.customer.findMany({
          skip,
          take: limit,
          orderBy: { id: "desc" },
          include: {
            roles: { include: { role: true } },
            permissions: { include: { permission: true } },
          },
        }),
        prisma.customer.count(),
      ]);

      // flatten roles and permissions, strip sensitive fields
      const safeUsers = users.map(({ password, salt, roles, permissions, ...rest }) => ({
        ...rest,
        roles: roles.map((r) => ({
          id: r.role.id,
          name: r.role.role_name,
        })),
        permissions: permissions.map((p) => ({
          id: p.permission.id,
          name: p.permission.permission_name,
        })),
      }));

      return {
        users: safeUsers,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (err) {
      console.error("Prisma getUsers error:", err);
      throw new APIError(
        "API_ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Failed to fetch Users",
        true,
      );
    }
  }
}

export default UserRepository;