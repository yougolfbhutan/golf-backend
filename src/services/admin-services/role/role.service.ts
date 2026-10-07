import type { RoleAttributes } from "../../../interface/admin/role/role.interface";
import { errorHandler } from "../../../middleware/errorHandler/common-errror-handler";
import RoleRepository from "../../../model/admin-repository/role-repository/role.repository";
import { FormateData } from "../../../utils/validation/validation";

class RoleService {
  repository: RoleRepository;
  constructor() {
    this.repository = new RoleRepository();
  }
  async createRole(userInputs: string,permissionIds: number[] = []) {
  
    // console.log("Inputs", userInputs);
    try {
      const role = await this.repository.createRole(
       userInputs,permissionIds
      );
      return FormateData({
        status: 200,
        data: role,
        message: "success message",
      });
    } catch (error: unknown) {
      return errorHandler(error);
    }
  }
  async deleteRoleService(id: number) {
    try {
      const existingCustomer = await this.repository.deleteRole(id);
      return FormateData({ existingCustomer });
    } catch (error: unknown) {
      throw errorHandler(error);
    }
  }
 async updateRoleService(id: number, updateData: RoleAttributes) {
  try {
    const role = await this.repository.updateRole(id, updateData);
    return FormateData({
      status: 200,
      data: role,
      message: "Role updated successfully",
    });
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}
 async getRoleService(page: number, limit: number) {
  try {
    const { roles, total } = await this.repository.getRole(page, limit);

    return {
      roles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}
}

export default RoleService;
