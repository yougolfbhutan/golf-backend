import { CarrySetAttributes } from "../../../interface/admin/upload-carry-set/upload-carry-set";
import { errorHandler } from "../../../middleware/errorHandler/common-errror-handler";
import AddCarrySetRepository from "../../../model/admin-repository/add-carryset-repository/add-carryset-repository";
import { FormateData } from "../../../utils/validation/validation";
import uploadCarrySetSchema from "../../../utils/Validator/admin/carry-set/carryset-validators";

class AddCarrySet {
  repository: AddCarrySetRepository;
  constructor() {
    this.repository = new AddCarrySetRepository();
  }
  async addCarrySetService(userUploadDetails: CarrySetAttributes) {
    await uploadCarrySetSchema.validate(userUploadDetails);
    const { golfsetname, tier, handedness, audience, price, description, urls } = userUploadDetails;
    try {
      const existingCustomer = await this.repository.createCarrySet({
        golfsetname,
        tier,
        handedness,
        audience,
        price,
        description,
        urls
      });
      return FormateData({ existingCustomer });
    } catch (error) {
      throw errorHandler(error);
    }
  }
  async deleteCarrySetService(id: number) {
    try {
      const existingCustomer = await this.repository.deleteCarrySet(id);
      return FormateData({ existingCustomer });
    } catch (error: unknown) {
      throw errorHandler(error);
    }
  }
  async updateCarrySetService(id: number, updateData: CarrySetAttributes) {
    try {
      const existingCustomer = await this.repository.updateCarrySet(
        id,
        updateData,
      );
      return FormateData({ existingCustomer });
    } catch (error: unknown) {
      throw errorHandler(error);
    }
  }
async getCarrySetService({ page, limit }: { page: number; limit: number }) {
  try {
    const { carrySets, total } = await this.repository.getCarrySet({ page, limit });
    return FormateData({
      carrySets,
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
export default AddCarrySet;
