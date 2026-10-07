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
const app_error_1 = require("../../../custom-error/app-error");
const prisma_1 = require("../../../../generated/prisma");
const validation_1 = require("../../../utils/validation/validation");
const prisma = new prisma_1.PrismaClient();
class AddCarrySetRepository {
    createCarrySet(input) {
        return __awaiter(this, void 0, void 0, function* () {
            let avail;
            try {
                const avail = input.availability === true || input.availability === "true";
                console.log("Availability value:", avail);
                const CarrySet = yield prisma.carrySet.create({
                    data: {
                        availability: avail,
                        carrysetname: input.carrysetname,
                        caddie: { connect: { id: Number(input.caddieId) } },
                        roundType: { connect: { id: Number(input.roundId) } },
                        peopleCategory: { connect: { id: Number(input.peopleId) } },
                        urls: input.urls
                            ? { create: input.urls.map((url) => ({ url })) }
                            : undefined,
                    },
                });
                return (0, validation_1.FormateData)({ CarrySet });
            }
            catch (err) {
                console.log("Prisma createCarrySet error:", err);
                throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Unable to add Carry Set", true);
            }
        });
    }
    deleteCarrySet(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const CarrySet = yield prisma.carrySet.delete({
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
    updateCarrySet(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { carrysetname, urls, caddieId, peopleId, roundId } = updateData;
                const CarrySet = yield prisma.carrySet.update({
                    where: { id },
                    data: Object.assign(Object.assign(Object.assign(Object.assign({ carrysetname: carrysetname, availability: updateData.availability === true ||
                            updateData.availability === "true" }, (caddieId !== undefined && { caddieId: Number(caddieId) })), (peopleId !== undefined && { peopleCategoryId: Number(peopleId) })), (roundId !== undefined && { roundTypeId: Number(roundId) })), (urls && {
                        urls: {
                            deleteMany: {},
                            create: urls.map((url) => ({ url })),
                        },
                    })),
                    include: { urls: true },
                });
                return (0, validation_1.FormateData)({ CarrySet });
            }
            catch (err) {
                console.log("Prisma updateCarrySet error:", err);
                throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "No Carry Set to update", true);
            }
        });
    }
    getCarrySet(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit, }) {
            try {
                const skip = (page - 1) * limit;
                const [carrySets, total] = yield Promise.all([
                    prisma.carrySet.findMany({
                        skip,
                        take: limit,
                        include: {
                            caddie: true,
                            urls: true,
                            peopleCategory: true,
                            roundType: true,
                        },
                        orderBy: {
                            id: "desc",
                        },
                    }),
                    prisma.carrySet.count(),
                ]);
                const formatted = carrySets.map((set) => ({
                    id: set.id,
                    carrysetname: set.carrysetname,
                    availability: set.availability,
                    caddie: set.caddie
                        ? {
                            id: set.caddie.id,
                            caddiename: set.caddie.caddiename,
                            cidNo: set.caddie.cidNo,
                            phone_number: set.caddie.phone_number,
                        }
                        : null,
                    peopleCategory: set.peopleCategory
                        ? {
                            id: set.peopleCategory.id,
                            peoplecategoryname: set.peopleCategory.peoplecategoryname,
                        }
                        : null,
                    roundType: set.roundType
                        ? {
                            id: set.roundType.id,
                            roundname: set.roundType.roundname,
                        }
                        : null,
                    urls: set.urls.map((u) => u.url),
                }));
                return { carrySets: formatted, total };
            }
            catch (err) {
                console.error("Prisma getCarrySet error:", err);
                throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Failed to fetch Carry Sets", true);
            }
        });
    }
}
exports.default = AddCarrySetRepository;
