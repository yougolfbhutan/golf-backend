import { errorHandler } from "../../../middleware/errorHandler/common-errror-handler";
import ExtractItemRepository from "../../../model/customer/extract-item/extract-item.repository";
import { FormateData } from "../../../utils/validation/validation";

class ExtractItemService {
  repository: ExtractItemRepository;
  constructor() {
    this.repository = new ExtractItemRepository();
  }
  async extractItemService() {
    try {
      const Souvenirs = await this.repository.getItemVarirant();
      return FormateData({ Souvenirs });
    } catch (error: unknown) {
      throw errorHandler(error);
    }
  }
}

export default ExtractItemService;
