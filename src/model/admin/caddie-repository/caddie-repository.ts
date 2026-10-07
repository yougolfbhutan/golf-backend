import { PrismaClient, Customer } from "../../../../generated/prisma";
import { APIError, STATUS_CODES } from "../../../custom-error/app-error";
import { CaddieAttributes } from "../../../interface/admin/caddie/caddie-interface";
import { FormateData } from "../../../utils/validation/validation";
// Customer
const prisma = new PrismaClient();

class CaddieRepository {
  async createCaddie(input: CaddieAttributes): Promise<any | string> {
    console.log("dorji jatsho", input.urls);
    try {
      const caddie = await prisma.caddie.create({
        data: {
          caddiename: input.caddiename,
          cidNo: input.cidNo,
          phone_number: input.phone_number,
          //   urls: input.urls
          //     ? {
          //         create: input.urls.map((url: string) => ({ url })),
          //       }
          //     : undefined,
        },
      });
      return caddie;
    } catch (err) {
      console.log("afszvczx");
      throw new APIError(
        String(err),
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Customer",
      );
    }
  }

  async deleteCaddie(input: number): Promise<any | null> {
    try {
      const CarrySet = await prisma.caddie.delete({
        where: {
          id: input,
        },
      });
      return FormateData({ CarrySet });
    } catch (err) {
      throw new APIError(
        "API_ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "No Carry Set to delete",
        true,
      );
    }
  }
  async updateCaddie(
    id: number,
    updateData: Partial<CaddieAttributes>,
  ): Promise<any | null> {
    try {
      const CarrySet = await prisma.caddie.update({
        where: {
          id: id,
        },
        data: updateData,
      });

      return FormateData({ CarrySet });
    } catch (err) {
      throw new APIError(
        "API_ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "No Carry Set to delete",
        true,
      );
    }
  }
  async getCaddies({ page, limit }: { page: number; limit: number }) {
    try {
      const skip = (page - 1) * limit;

      const [caddies, total] = await Promise.all([
        prisma.caddie.findMany({
          skip,
          take: limit,
          // orderBy: { createdAt: "desc" }, // pick a stable sort, otherwise pagination order isn't guaranteed
        }),
        prisma.caddie.count(),
      ]);

        return { caddies, total };

    } catch (err) {
      throw new APIError(
        "API_ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to retrieve caddies",
        true,
      );
    }
  }
}

export default CaddieRepository;
