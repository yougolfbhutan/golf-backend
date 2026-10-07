"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../../../generated/prisma");
const app_error_1 = require("../../../custom-error/app-error");
const validation_1 = require("../../../utils/validation/validation");
// import { FormateData } from "../../../utils/validation/validation";
// Customer
const prisma = new prisma_1.PrismaClient();
class ItemVariantRepository {
    createItemVariant(input) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const itemId = Number(input.itemId);
                // Match on itemId + color + size to find the SAME variant
                const existing = yield prisma.itemVariant.findFirst({
                    where: {
                        itemId,
                        color: input.color,
                        size: input.size,
                    },
                });
                if (existing) {
                    // Found the same variant — keep its id, only bump stockQty
                    const updated = yield prisma.itemVariant.update({
                        where: { id: existing.id },
                        data: {
                            stockQty: { increment: Number(input.stockQty) || 0 },
                        },
                        include: {
                            urls: { orderBy: { sortOrder: "asc" } },
                        },
                    });
                    return updated;
                }
                // No match — create a new variant with a new id/SKU
                const sku = yield this.generateSku(itemId, input.color, input.size);
                const variant = yield prisma.itemVariant.create({
                    data: {
                        availability: input.availability,
                        itemId,
                        sku,
                        color: input.color,
                        size: input.size,
                        packQuantity: Number(input.packQuantity) || 1,
                        price: input.price,
                        stockQty: Number(input.stockQty) || 0,
                        attributes: input.attributes,
                        urls: ((_a = input.urls) === null || _a === void 0 ? void 0 : _a.length)
                            ? {
                                create: input.urls.map((url, index) => ({
                                    url,
                                    sortOrder: index,
                                })),
                            }
                            : undefined,
                    },
                    include: {
                        urls: { orderBy: { sortOrder: "asc" } },
                    },
                });
                return variant;
            }
            catch (err) {
                console.error("Prisma createItemVariant error:", err);
                throw new app_error_1.APIError(String(err), app_error_1.STATUS_CODES.INTERNAL_ERROR, "Unable to Create Item Variant");
            }
        });
    }
    generateSku(itemId, color, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield prisma.item.findUniqueOrThrow({
                where: { id: Number(itemId) },
            });
            const namePart = item.name
                .toUpperCase()
                .replace(/[^A-Z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")
                .slice(0, 15);
            const colorPart = color ? color.toUpperCase().slice(0, 3) : "";
            const sizePart = size ? size.toUpperCase().replace(/\s+/g, "") : "";
            const base = [namePart, colorPart, sizePart].filter(Boolean).join("-");
            const suffix = Date.now().toString(36).toUpperCase().slice(-5);
            return `${base}-${suffix}`;
        });
    }
    deleteItemVariant(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Souvenir = yield prisma.itemVariant.delete({
                    where: {
                        id: input,
                    },
                });
                return (0, validation_1.FormateData)({ Souvenir });
            }
            catch (err) {
                throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "No Permission to delete", true);
            }
        });
    }
    updateItemVariant(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const idNum = Number(id);
                const { color, size, packQuantity, price, stockQty, availability, attributes, urls } = input;
                const variant = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    yield tx.itemVariant.update({
                        where: { id: idNum },
                        data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (color !== undefined && { color })), (size !== undefined && { size })), (packQuantity !== undefined && { packQuantity: Number(packQuantity) })), (price !== undefined && { price: Number(price) })), { availability: availability === true || availability === "true" }), (attributes !== undefined && { attributes })), (stockQty !== undefined && { stockQty: { increment: Number(stockQty) } })),
                    });
                    const current = yield tx.itemVariant.findUniqueOrThrow({ where: { id: idNum } });
                    if (urls !== undefined) {
                        yield tx.itemVariantUrl.deleteMany({ where: { itemVariantId: current.id } });
                        if (urls.length > 0) {
                            yield tx.itemVariantUrl.createMany({
                                data: urls.map((url, index) => ({ url, itemVariantId: current.id, sortOrder: index })),
                            });
                        }
                    }
                    return tx.itemVariant.findUnique({
                        where: { id: idNum },
                        include: { urls: { orderBy: { sortOrder: "asc" } } },
                    });
                }));
                return variant;
            }
            catch (err) {
                if (err.code === "P2025") {
                    throw new app_error_1.APIError("NOT_FOUND", app_error_1.STATUS_CODES.NOT_FOUND, "Variant not found", true);
                }
                throw new app_error_1.APIError(String(err), app_error_1.STATUS_CODES.INTERNAL_ERROR, "Unable to update variant", true);
            }
        });
    }
    getItemVarirant(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit }) {
            try {
                const [itemVariants, total] = yield Promise.all([
                    prisma.itemVariant.findMany({
                        include: {
                            urls: { orderBy: { sortOrder: "asc" } },
                            item: { select: { name: true, description: true } },
                        },
                        orderBy: { id: "asc" },
                        skip: (page - 1) * limit,
                        take: limit,
                    }),
                    prisma.itemVariant.count(),
                ]);
                return { itemVariants, total };
            }
            catch (err) {
                console.error("Prisma getAllVariants error:", err);
                throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Failed to fetch variants", true);
            }
        });
    }
}
exports.default = ItemVariantRepository;
