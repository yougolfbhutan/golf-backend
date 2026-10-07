import { PrismaClient } from "../../../../generated/prisma";
import { APIError, STATUS_CODES } from "../../../custom-error/app-error";
import type {
  ItemVariantAttributes,
  ItemVariantUpdateBySkuAttributes,
} from "../../../interface/admin/item-variant/item-variant";
import { FormateData } from "../../../utils/validation/validation";
// import { FormateData } from "../../../utils/validation/validation";
// Customer
const prisma = new PrismaClient();

class ExtractItemRepository {

  async getItemVarirant(): Promise<any | null> {
     try {
    const variants = await prisma.itemVariant.findMany({
      include: {
        item: { include: { category: true } },   // pulls in parent item's name + category
        urls: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { id: "asc" },
    });
    return variants;
  } catch (err) {
    console.error("Prisma getAllVariants error:", err);
    throw new APIError("API_ERROR", STATUS_CODES.INTERNAL_ERROR, "Failed to fetch variants", true);
  }
  }
}

export default ExtractItemRepository;
