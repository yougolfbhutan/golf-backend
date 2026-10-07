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
// Customer
const prisma = new prisma_1.PrismaClient();
class SouvenirRepository {
    createSouvenir(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const souvenirItem = yield prisma.item.create({
                    data: {
                        name: input.name,
                        description: input.description,
                        categoryId: Number(input.categoryId),
                    },
                });
                return souvenirItem;
            }
            catch (err) {
                console.error("Prisma createSouvenir error:", err);
                throw new app_error_1.APIError(String(err), app_error_1.STATUS_CODES.INTERNAL_ERROR, "Unable to Create Souvenir");
            }
        });
    }
    deleteSouvenir(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Souvenir = yield prisma.item.delete({
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
    updateSouvenir(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description, categoryId } = input;
                const item = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    // 1. Update scalar fields if provided
                    yield tx.item.update({
                        where: { id },
                        data: Object.assign(Object.assign(Object.assign({}, (name !== undefined && { name })), (description !== undefined && { description: description })), (categoryId !== undefined && { categoryId: Number(categoryId) })),
                    });
                    // 3. Return item with fresh urls + category attached
                    return tx.item.findUnique({
                        where: { id },
                    });
                }));
                return item;
            }
            catch (err) {
                console.error("Prisma updateSouvenir error:", err);
                if (err.code === "P2025") {
                    throw new app_error_1.APIError("NOT_FOUND", app_error_1.STATUS_CODES.NOT_FOUND, "Souvenir not found", true);
                }
                throw new app_error_1.APIError(String(err), app_error_1.STATUS_CODES.INTERNAL_ERROR, "Unable to update souvenir", true);
            }
        });
    }
    getSouvenirs(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit }) {
            try {
                const skip = (page - 1) * limit;
                const [souvenirs, total] = yield Promise.all([
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
            }
            catch (err) {
                console.error("Prisma getSouvenirs error:", err);
                throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Failed to fetch Souvenirs", true);
            }
        });
    }
}
exports.default = SouvenirRepository;
