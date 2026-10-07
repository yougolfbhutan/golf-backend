import { PrismaClient } from "../../../../generated/prisma";
import { APIError, STATUS_CODES } from "../../../custom-error/app-error";
import type { SouvenirAttributes } from "../../../interface/admin/souvier/souvier.interface";
import { FormateData } from "../../../utils/validation/validation";
// Customer
const prisma = new PrismaClient();

class SouvenirRepository {
  async createSouvenir(input: SouvenirAttributes): Promise<any | string> {
    try {
      const souvenirItem = await prisma.item.create({
        data: {
          name: input.name,
          description: input.description,
          categoryId: Number(input.categoryId),
        },
      });
      return souvenirItem;
    } catch (err) {
      console.error("Prisma createSouvenir error:", err);
      throw new APIError(
        String(err),
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Souvenir",
      );
    }
  }
  async deleteSouvenir(input: number): Promise<any | null> {
    try {
      const Souvenir = await prisma.item.delete({
        where: {
          id: input,
        },
      });
      return FormateData({ Souvenir });
    } catch (err) {
      throw new APIError(
        "API_ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "No Permission to delete",
        true,
      );
    }
  }
  async updateSouvenir(
    id: number,
    input: {
      name?: string;
      description: string;
      categoryId?: number;
      // urls?: string[];
    },
  ): Promise<any> {
    try {
      const { name, description, categoryId } = input;

      const item = await prisma.$transaction(async (tx) => {
        // 1. Update scalar fields if provided
        await tx.item.update({
          where: { id },
          data: {
            ...(name !== undefined && { name }),
            ...(description !== undefined && { description: description }),

            ...(categoryId !== undefined && { categoryId: Number(categoryId) }),
          },
        });

        // 3. Return item with fresh urls + category attached
        return tx.item.findUnique({
          where: { id },
        });
      });

      return item;
    } catch (err: any) {
      console.error("Prisma updateSouvenir error:", err);
      if (err.code === "P2025") {
        throw new APIError(
          "NOT_FOUND",
          STATUS_CODES.NOT_FOUND,
          "Souvenir not found",
          true,
        );
      }
      throw new APIError(
        String(err),
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to update souvenir",
        true,
      );
    }
  }
  async getSouvenirs({ page, limit }: { page: number; limit: number }) {
  try {
    const skip = (page - 1) * limit;
    const [souvenirs, total] = await Promise.all([
      prisma.item.findMany({
        include: {
          category: true,
          variants: {
            include: { urls: true },
          },
        },
        orderBy: { id: "asc" },
        skip,
        take: limit,
      }),
      prisma.item.count(),
    ]);

    return { souvenirs, total };
  } catch (err) {
    console.error("Prisma getSouvenirs error:", err);
    throw new APIError(
      "API_ERROR",
      STATUS_CODES.INTERNAL_ERROR,
      "Failed to fetch Souvenirs",
      true,
    );
  }
}
}

export default SouvenirRepository;
