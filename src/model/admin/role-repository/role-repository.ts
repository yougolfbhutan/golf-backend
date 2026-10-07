import { PrismaClient } from "../../../../generated/prisma/client";
import { APIError, STATUS_CODES } from "../../../custom-error/app-error";

import { errorHandler } from "../../../middleware/errorHandler/common-errror-handler";

const prisma = new PrismaClient();

export class RolePermissionRepository {
  async findRoleAndPermission(user: number) {
    try {
      const userData = await prisma.customer.findUnique({
        where: {
          id: user,   // also fixed: was hardcoded to 1, ignoring the `user` param
        },
        include: {
          roles: {                        // was "role" — must match schema field name
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return userData;
    } catch (err) {
      console.error("Error finding role and permission:", err);
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find role and permission",
      );
    }
  }
}
