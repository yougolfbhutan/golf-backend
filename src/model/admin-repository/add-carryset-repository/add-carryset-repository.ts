import { APIError, STATUS_CODES } from "../../../custom-error/app-error";
import { Prisma, PrismaClient } from "../../../../generated/prisma";
import { CarrySetAttributes } from "../../../interface/admin/upload-carry-set/upload-carry-set";

const prisma = new PrismaClient();

const toBool = (v: unknown) => v === true || v === "true";

class AddCarrySetRepository {
  async createCarrySet(input: CarrySetAttributes) {
    try {
      return await prisma.golfSet.create({
        data: {
          name: input.golfsetname,
          description: input.description,
          tier: input.tier,
          handedness: input.handedness,
          audience: input.audience,
          price: Number(input.price),
          availability:
            input.availability !== undefined ? toBool(input.availability) : true,
          urls: input.urls?.length
            ? { create: input.urls.map((url) => ({ url })) }
            : undefined,
        },
        include: { urls: true },
      });
    } catch (err) {
      console.error("Prisma createCarrySet error:", err);
      throw new APIError(
        "API_ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to add golf set",
        true,
      );
    }
  }

  async deleteCarrySet(id: number) {
    try {
      return await prisma.golfSet.delete({ where: { id } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2003") {
          throw new APIError(
            "API_ERROR",
            STATUS_CODES.INTERNAL_ERROR,
            "This set is used in bookings and can't be deleted. Mark it unavailable instead.",
            true,
          );
        }
        if (err.code === "P2025") {
          throw new APIError(
            "API_ERROR",
            STATUS_CODES.INTERNAL_ERROR,
            "Golf set not found",
            true,
          );
        }
      }
      console.error("Prisma deleteCarrySet error:", err);
      throw new APIError(
        "API_ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to delete golf set",
        true,
      );
    }
  }

  async updateCarrySet(id: number, updateData: Partial<CarrySetAttributes>) {
    try {
      const {
        golfsetname,
        description,
        tier,
        handedness,
        audience,
        price,
        availability,
        urls,
      } = updateData;

      // Only touch fields that were actually sent
      return await prisma.golfSet.update({
        where: { id },
        data: {
          ...(golfsetname !== undefined && { name: golfsetname }),
          ...(description !== undefined && { description }),
          ...(tier !== undefined && { tier }),
          ...(handedness !== undefined && { handedness }),
          ...(audience !== undefined && { audience }),
          ...(price !== undefined && { price: Number(price) }),
          ...(availability !== undefined && {
            availability: toBool(availability),
          }),
          ...(urls && {
            urls: {
              deleteMany: {},
              create: urls.map((url) => ({ url })),
            },
          }),
        },
        include: { urls: true },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        throw new APIError(
          "API_ERROR",
          STATUS_CODES.INTERNAL_ERROR,
          "Golf set not found",
          true,
        );
      }
      console.error("Prisma updateCarrySet error:", err);
      throw new APIError(
        "API_ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to update golf set",
        true,
      );
    }
  }

  async getCarrySet({ page, limit }: { page: number; limit: number }) {
    try {
      const skip = (page - 1) * limit;

      const [golfSets, total] = await Promise.all([
        prisma.golfSet.findMany({
          skip,
          take: limit,
          include: { urls: true },
          orderBy: { id: "desc" },
        }),
        prisma.golfSet.count(),
      ]);

      const carrySets = golfSets.map((s) => ({
        id: s.id,
        golfsetname: s.name,
        description: s.description,
        tier: s.tier,
        handedness: s.handedness,
        audience: s.audience,
        price: Number(s.price),
        availability: s.availability,
        urls: s.urls.map((u) => u.url),
      }));

      return { carrySets, total };
    } catch (err) {
      console.error("Prisma getCarrySet error:", err);
      throw new APIError(
        "API_ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Failed to fetch golf sets",
        true,
      );
    }
  }
}

export default AddCarrySetRepository;