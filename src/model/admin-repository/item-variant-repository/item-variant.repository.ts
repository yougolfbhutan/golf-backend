import crypto from "crypto";
import { Prisma, PrismaClient } from "../../../../generated/prisma";
import { APIError, STATUS_CODES } from "../../../custom-error/app-error";
import type {
  ItemVariantAttributes,
  ItemVariantUpdateAttributes,
} from "../../../interface/admin/item-variant/item-variant";
import { assertVariantRules, buildVariantKey } from "../../../utils/item-variant/item-variant-rules";

const prisma = new PrismaClient();
const toBool = (v: unknown) => v === true || v === "true";
const clean = (s: string) =>
  s.toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/(^-|-$)/g, "");

class ItemVariantRepository {
  async createItemVariant(input: ItemVariantAttributes) {
    try {
      const itemId = Number(input.itemId);
      const item = await prisma.item.findUnique({
        where: { id: itemId },
        include: { category: true },
      });
      if (!item) {
        throw new APIError("NOT_FOUND", STATUS_CODES.NOT_FOUND, "Item not found", true);
      }

      const fields = {
        tier: input.tier ?? null,
        audience: input.audience ?? null,
        color: input.color?.trim() || null,
        size: input.size?.trim() || null,
        hand: input.hand ?? null,
        packQuantity: Number(input.packQuantity) || 1,
      };
      assertVariantRules(item.category.name, fields);

      const variantKey = buildVariantKey({ itemId, ...fields });
      const stockQty = Number(input.stockQty) || 0;

      return await prisma.itemVariant.upsert({
        where: { variantKey },
        // Same variant already exists: only add stock
        update: { stockQty: { increment: stockQty } },
        create: {
          itemId,
          variantKey,
          sku: this.generateSku(item.name, fields),
          ...fields,
          price: Number(input.price),
          stockQty,
          availability:
            input.availability !== undefined ? toBool(input.availability) : true,
          attributes: input.attributes,
          urls: input.urls?.length
            ? { create: input.urls.map((url, sortOrder) => ({ url, sortOrder })) }
            : undefined,
        },
        include: { urls: { orderBy: { sortOrder: "asc" } } },
      });
    } catch (err) {
      throw this.mapError(err, "Unable to create item variant");
    }
  }

async updateItemVariant(id: number, input: ItemVariantUpdateAttributes) {
  try {
    return await prisma.$transaction(async (tx) => {
      const current = await tx.itemVariant.findUnique({
        where: { id },
        include: { item: { include: { category: true } } },
      });
      if (!current) {
        throw new APIError("NOT_FOUND", STATUS_CODES.NOT_FOUND, "Variant not found", true);
      }

      // Merge incoming changes over current values, then re-validate
      const merged = {
        tier: input.tier !== undefined ? input.tier : current.tier,
        audience: input.audience !== undefined ? input.audience : current.audience,
        color: input.color !== undefined ? input.color?.trim() || null : current.color,
        size: input.size !== undefined ? input.size?.trim() || null : current.size,
        hand: input.hand !== undefined ? input.hand : current.hand,
        packQuantity:
          input.packQuantity !== undefined
            ? Number(input.packQuantity) || 1
            : current.packQuantity,
      };
      assertVariantRules(current.item.category.name, merged);

      const variantKey = buildVariantKey({ itemId: current.itemId, ...merged });

      // Stock is ADDED. Send a negative number to remove stock.
      const delta = input.stockQty !== undefined ? Number(input.stockQty) || 0 : 0;

      // Does another variant already have these exact options?
      const duplicate = await tx.itemVariant.findFirst({
        where: { variantKey, NOT: { id } },
        select: { id: true, stockQty: true },
      });

      let targetId = id;
      let stockToAdd = delta;

      if (duplicate) {
        // Merge into the existing variant instead of creating a duplicate
        const usedInBookings = await tx.bookingItem.count({
          where: { itemVariantId: id },
        });
        if (usedInBookings > 0) {
          throw new APIError(
            "API_ERROR",
            STATUS_CODES.BAD_REQUEST,
            "These options match another variant, but this one is used in bookings and can't be merged.",
            true,
          );
        }

        targetId = duplicate.id;
        stockToAdd = current.stockQty + delta; // carry this variant's stock over

        if (duplicate.stockQty + stockToAdd < 0) {
          throw new APIError("API_ERROR", STATUS_CODES.BAD_REQUEST,
            "Stock can't go below zero", true);
        }

        // Remove the now-redundant row (its images and cart items cascade)
        await tx.itemVariant.delete({ where: { id } });
      } else if (current.stockQty + delta < 0) {
        throw new APIError("API_ERROR", STATUS_CODES.BAD_REQUEST,
          "Stock can't go below zero", true);
      }

      // Only replace images when new ones were uploaded
      if (input.urls && input.urls.length > 0) {
        await tx.itemVariantUrl.deleteMany({ where: { itemVariantId: targetId } });
        await tx.itemVariantUrl.createMany({
          data: input.urls.map((url, sortOrder) => ({
            url,
            itemVariantId: targetId,
            sortOrder,
          })),
        });
      }

      return tx.itemVariant.update({
        where: { id: targetId },
        data: {
          // On a merge the option fields and key already match the target
          ...(!duplicate && { ...merged, variantKey }),
          ...(input.price !== undefined && { price: Number(input.price) }),
          ...(stockToAdd !== 0 && { stockQty: { increment: stockToAdd } }),
          ...(input.availability !== undefined && {
            availability: toBool(input.availability),
          }),
          ...(input.attributes !== undefined && { attributes: input.attributes }),
        },
        include: { urls: { orderBy: { sortOrder: "asc" } } },
      });
    });
  } catch (err) {
    throw this.mapError(err, "Unable to update item variant");
  }
}

  async deleteItemVariant(id: number) {
    try {
      return await prisma.itemVariant.delete({ where: { id } });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2003"
      ) {
        throw new APIError(
          "API_ERROR",
          STATUS_CODES.BAD_REQUEST,
          "This variant is used in bookings and can't be deleted. Mark it unavailable instead.",
          true,
        );
      }
      throw this.mapError(err, "Unable to delete item variant");
    }
  }

  async getItemVariants({ page, limit }: { page: number; limit: number }) {
    try {
      const [itemVariants, total] = await Promise.all([
        prisma.itemVariant.findMany({
          include: {
            urls: { orderBy: { sortOrder: "asc" } },
            item: {
              select: {
                name: true,
                description: true,
                category: { select: { id: true, name: true } },
              },
            },
          },
          orderBy: { id: "asc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.itemVariant.count(),
      ]);
      return { itemVariants, total };
    } catch (err) {
      throw this.mapError(err, "Failed to fetch item variants");
    }
  }

  // SKU is capped at 50 chars (VarChar(50)): 43 + "-" + 6 random hex
  private generateSku(
    itemName: string,
    v: {
      tier: string | null;
      audience: string | null;
      color: string | null;
      size: string | null;
      hand: string | null;
    },
  ): string {
    const base = [
      clean(itemName).slice(0, 15),
      v.tier === "premium" ? "PRM" : v.tier === "standard" ? "STD" : "",
      v.audience ? v.audience.slice(0, 3).toUpperCase() : "",
      v.color ? clean(v.color).slice(0, 3) : "",
      v.size ? clean(v.size) : "",
      v.hand === "left" ? "LH" : v.hand === "right" ? "RH" : "",
    ]
      .filter(Boolean)
      .join("-")
      .slice(0, 43);

    return `${base}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  }

  private mapError(err: unknown, fallback: string): APIError {
    if (err instanceof APIError) return err;
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return new APIError("NOT_FOUND", STATUS_CODES.NOT_FOUND, "Variant not found", true);
      }
      if (err.code === "P2002") {
        return new APIError(
          "API_ERROR",
          STATUS_CODES.BAD_REQUEST,
          "A variant with these options already exists",
          true,
        );
      }
    }
    console.error(fallback, err);
    return new APIError("API_ERROR", STATUS_CODES.INTERNAL_ERROR, fallback, true);
  }
}

export default ItemVariantRepository;