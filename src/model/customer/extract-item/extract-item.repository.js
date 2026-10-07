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
// import { FormateData } from "../../../utils/validation/validation";
// Customer
const prisma = new prisma_1.PrismaClient();
class ExtractItemRepository {
    getItemVarirant() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const variants = yield prisma.itemVariant.findMany({
                    include: {
                        item: { include: { category: true } }, // pulls in parent item's name + category
                        urls: { orderBy: { sortOrder: "asc" } },
                    },
                    orderBy: { id: "asc" },
                });
                return variants;
            }
            catch (err) {
                console.error("Prisma getAllVariants error:", err);
                throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Failed to fetch variants", true);
            }
        });
    }
}
exports.default = ExtractItemRepository;
