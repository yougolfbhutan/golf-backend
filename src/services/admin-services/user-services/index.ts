import type { UserFormAttributes } from "../../../interface/admin/user-interface";
import { errorHandler } from "../../../middleware/errorHandler/common-errror-handler";
import UserRepository from "../../../model/admin-repository/user-repository";
import { FormateData } from "../../../utils/validation/validation";

class UserService {
  repository: UserRepository;
  constructor() {
    this.repository = new UserRepository();
  }
  async createUser(userInputs: UserFormAttributes) {
    const { customer_name,email,password,phone_number,roles,permissions } = userInputs;
    // console.log("Inputs", userInputs);
    try {
      const caddie = await this.repository.createUser({
        customer_name,
        email,
        password,
        phone_number,
        roles,
        permissions
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
  async deleteUserService(id: number) {
    console.log("deleteUserService", id);
    try {
      const existingCustomer = await this.repository.deleteUser(id);
      return FormateData({ existingCustomer });
    } catch (error: unknown) {
      throw errorHandler(error);
    }
  }
  async updateUserService(id: number, updateData: UserFormAttributes) {
    console.log("updateUserService", id, updateData);
    try {
      const existingCustomer = await this.repository.updateUser(
        id,
        updateData
      );
      return FormateData({ existingCustomer });
    } catch (error: unknown) {
      throw errorHandler(error);
    }
  }
//   // service.ts
async getUsersService({ page, limit }: { page: number; limit: number }) {
  try {
    const { users, total } = await this.repository.getUsers({ page, limit });
    return {
      users,
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

export default UserService;
