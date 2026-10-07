import { CaddieAttributes } from "../../../interface/admin/caddie/caddie-interface";
import type { PermissionAttributes } from "../../../interface/admin/permission/permission";
import { errorHandler } from "../../../middleware/errorHandler/common-errror-handler";
import PermissionRepository from "../../../model/admin-repository/permission-repository/permission.repository";
import CaddieRepository from "../../../model/admin/caddie-repository/caddie-repository";
import { FormateData } from "../../../utils/validation/validation";

class PermissionService {
  repository: PermissionRepository;
  constructor() {
    this.repository = new PermissionRepository();
  }
  async createPermission(userInputs: PermissionAttributes) {
    const { permission_name } = userInputs;
    // console.log("Inputs", userInputs);
    try {
      const caddie = await this.repository.createPermission({
       permission_name
      });
      return FormateData({
        status: 200,
        data: caddie,
        message: "success message",
      });
    } catch (error: unknown) {
      return errorHandler(error);
    }
  }
  async deletePermissionService(id: number) {
    console.log("deletePermissionService", id);
    try {
      const existingCustomer = await this.repository.deletePermission(id);
      return FormateData({ existingCustomer });
    } catch (error: unknown) {
      throw errorHandler(error);
    }
  }
  async updatePermissionService(id: number, updateData: PermissionAttributes) {
    console.log("updatePermissionService", id, updateData);
    try {
      const existingCustomer = await this.repository.updatePermission(
        id,
        updateData
      );
      return FormateData({ existingCustomer });
    } catch (error: unknown) {
      throw errorHandler(error);
    }
  }
  // service.ts
async getPermissionService({ page, limit }: { page: number; limit: number }) {
  try {
    const { permissions, total } = await this.repository.getPermission({ page, limit });
    return {
      permissions,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}
}

export default PermissionService;
