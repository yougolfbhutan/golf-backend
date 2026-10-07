import type { SouvenirAttributes } from "../../../interface/admin/souvier/souvier.interface";
import { errorHandler } from "../../../middleware/errorHandler/common-errror-handler";
import SouvenirRepository from "../../../model/admin-repository/souvier-repository/souvier.repository";
import { FormateData } from "../../../utils/validation/validation";

class SouvenirService {
  repository: SouvenirRepository;
  constructor() {
    this.repository = new SouvenirRepository();
  }
  async createSouvenir(userInputs: SouvenirAttributes) {
    try {
      const { name,description, categoryId } =
        userInputs;
      const souvenir = await this.repository.createSouvenir({
        name,
       description,
        categoryId,
        // urls,
      });
      return FormateData({
        status: 200,
        data: souvenir,
        message: "success message",
      });
    } catch (error: unknown) {
      return errorHandler(error);
    }
  }
  async deleteSouvenirService(id: number) {
    try {
      const existingSouvenir = await this.repository.deleteSouvenir(id);
      return FormateData({ existingSouvenir });
    } catch (error: unknown) {
      return errorHandler(error);
    }
  }
  async updateSouvenirService(id: number, updateData: SouvenirAttributes) {
    try {
      const updateSouvenir = await this.repository.updateSouvenir(id, updateData);
      return FormateData({
        status: 200,
        data: updateSouvenir,
        message: "Souvenir updated successfully",
      });
    } catch (error: unknown) {
      throw errorHandler(error);
    }
  }
    async getSouvenirsService(page: number, limit: number) {
      try {
        const { souvenirs, total } = await this.repository.getSouvenirs({ page, limit });
        return FormateData({ souvenirs, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
      } catch (error: unknown) {
        throw errorHandler(error);
      }
    }
}

export default SouvenirService;
