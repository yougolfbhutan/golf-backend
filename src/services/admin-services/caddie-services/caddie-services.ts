import { CaddieAttributes } from "../../../interface/admin/caddie/caddie-interface";
import { SignInAttributes } from "../../../interface/signin/signin-interface";
import { DatabaseRegisterSttributes } from "../../../interface/SignUp/signup-interface";
import { errorHandler } from "../../../middleware/errorHandler/common-errror-handler";
import { ACCESS_TOKEN } from "../../../middleware/token/token-access";
import CaddieRepository from "../../../model/admin/caddie-repository/caddie-repository";
import { FormateData } from "../../../utils/validation/validation";

class CaddieService {
  repository: CaddieRepository;
  constructor() {
    this.repository = new CaddieRepository();
  }
  async createCaddie(userInputs: CaddieAttributes) {
    const { caddiename, cidNo, phone_number } = userInputs;
    // console.log("Inputs", userInputs);
    try {
      const caddie = await this.repository.createCaddie({
        caddiename,
        cidNo,
        phone_number,
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
  async deleteCaddieService(id: number) {
    console.log("deleteCaddieService", id);
    try {
      const existingCustomer = await this.repository.deleteCaddie(id);
      return FormateData({ existingCustomer });
    } catch (error: unknown) {
      throw errorHandler(error);
    }
  }
  async updateCaddieService(id: number, updateData: Partial<CaddieAttributes>) {
    console.log("updateCaddieService", id, updateData);
    try {
      const existingCustomer = await this.repository.updateCaddie(
        id,
        updateData,
      );
      return FormateData({ existingCustomer });
    } catch (error: unknown) {
      throw errorHandler(error);
    }
  }
 async getCaddieService({ page, limit }: { page: number; limit: number }) {
  try {
    const { caddies, total } = await this.repository.getCaddies({ page, limit });
    return FormateData({
      caddies,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}
}

export default CaddieService;
