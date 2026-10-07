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
class PermissionRepository {
    createPermission(input) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("inputs from user", input);
            try {
                const CarrySet = yield prisma.permission.create({
                    data: {
                        permission_name: input.permission_name,
                    },
                });
                return (0, validation_1.FormateData)({ CarrySet });
            }
            catch (err) {
                throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Unable to add Permission", true);
            }
        });
    }
    deletePermission(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const CarrySet = yield prisma.permission.delete({
                    where: {
                        id: input,
                    },
                });
                return (0, validation_1.FormateData)({ CarrySet });
            }
            catch (err) {
                throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "No Permission to delete", true);
            }
        });
    }
    updatePermission(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Permission = yield prisma.permission.update({
                    where: { id },
                    data: {
                        permission_name: updateData.permission_name,
                    },
                });
                return (0, validation_1.FormateData)({ Permission });
            }
            catch (err) {
                console.error("Prisma updatePermission error:", err);
                throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "No Permission to update", true);
            }
        });
    }
    getPermission(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit, }) {
            try {
                const skip = (page - 1) * limit;
                const [permissions, total] = yield Promise.all([
                    prisma.permission.findMany({ skip, take: limit }),
                    prisma.permission.count(),
                ]);
                console.log("permission data", permissions);
                return { permissions, total };
            }
            catch (err) {
                console.error("Prisma getPermission error:", err);
                throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Failed to fetch Permissions", true);
            }
        });
    }
}
exports.default = PermissionRepository;
