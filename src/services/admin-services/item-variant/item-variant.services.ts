import type {
  ItemVariantAttributes,
  ItemVariantUpdateAttributes,
} from "../../../interface/admin/item-variant/item-variant";
import { errorHandler } from "../../../middleware/errorHandler/common-errror-handler";
import ItemVariantRepository from "../../../model/admin-repository/item-variant-repository/item-variant.repository";
import { FormateData } from "../../../utils/validation/validation";

class ItemVariantService {
  repository: ItemVariantRepository;
  constructor() {
    this.repository = new ItemVariantRepository();
  }
  async createItemVariant(input: ItemVariantAttributes) {
    try {
      const variant = await this.repository.createItemVariant(input);
      return FormateData({ variant });
    } catch (error: unknown) {
      throw errorHandler(error);
    }
  }
  async deleteItemVariantService(id: number) {
    try {
      const existingSouvenir = await this.repository.deleteItemVariant(id);
      return FormateData({ existingSouvenir });
    } catch (error: unknown) {
      return errorHandler(error);
    }
  }
 async updateItemVariant(id: number, input: ItemVariantUpdateAttributes) {
    try {
      const variant = await this.repository.updateItemVariant(id, input);
      return FormateData({ variant });
    } catch (error: unknown) {
      throw errorHandler(error);
    }
  }
  async getItemVariantService({ page, limit }: { page: number; limit: number }) {
    try {
      
      const { itemVariants, total } = await this.repository.getItemVariants({ page, limit });
      return FormateData({ itemVariants, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
    } catch (error: unknown) {
      throw errorHandler(error);
    }
  }
}

export default ItemVariantService;
