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
class CaddieRepository {
    createCaddie(input) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("dorji jatsho", input.urls);
            try {
                const caddie = yield prisma.caddie.create({
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
            }
            catch (err) {
                console.log("afszvczx");
                throw new app_error_1.APIError(String(err), app_error_1.STATUS_CODES.INTERNAL_ERROR, "Unable to Create Customer");
            }
        });
    }
    deleteCaddie(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const CarrySet = yield prisma.caddie.delete({
                    where: {
                        id: input,
                    },
                });
                return (0, validation_1.FormateData)({ CarrySet });
            }
            catch (err) {
                throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "No Carry Set to delete", true);
            }
        });
    }
    updateCaddie(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const CarrySet = yield prisma.caddie.update({
                    where: {
                        id: id,
                    },
                    data: updateData,
                });
                return (0, validation_1.FormateData)({ CarrySet });
            }
            catch (err) {
                throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "No Carry Set to delete", true);
            }
        });
    }
    getCaddies(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit }) {
            try {
                const skip = (page - 1) * limit;
                const [caddies, total] = yield Promise.all([
                    prisma.caddie.findMany({
                        skip,
                        take: limit,
                        // orderBy: { createdAt: "desc" }, // pick a stable sort, otherwise pagination order isn't guaranteed
                    }),
                    prisma.caddie.count(),
                ]);
                return { caddies, total };
            }
            catch (err) {
                throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Unable to retrieve caddies", true);
            }
        });
    }
}
exports.default = CaddieRepository;
