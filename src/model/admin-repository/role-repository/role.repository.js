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
class RoleRepository {
    createRole(input_1) {
        return __awaiter(this, arguments, void 0, function* (input, permissionIds = []) {
            try {
                const role = yield prisma.role.create({
                    data: {
                        role_name: input,
                        permissions: {
                            create: permissionIds.map((permissionId) => ({
                                permission: { connect: { id: permissionId } },
                            })),
                        },
                    },
                    include: {
                        permissions: { include: { permission: true } },
                    },
                });
                return role;
            }
            catch (err) {
                console.log("afszvczx");
                throw new app_error_1.APIError(String(err), app_error_1.STATUS_CODES.INTERNAL_ERROR, "Unable to Create Role");
            }
        });
    }
    deleteRole(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Role = yield prisma.role.delete({
                    where: {
                        id: input,
                    },
                });
                return (0, validation_1.FormateData)({ Role });
            }
            catch (err) {
                throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "No Permission to delete", true);
            }
        });
    }
    updateRole(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { role_name, permission_ids } = input;
                const role = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    // 1. Update role_name if provided
                    const updatedRole = yield tx.role.update({
                        where: { id },
                        data: Object.assign({}, (role_name !== undefined && { role_name })),
                    });
                    // 2. If permission_ids provided, replace the whole set
                    if (permission_ids !== undefined) {
                        yield tx.rolePermission.deleteMany({
                            where: { roleId: id },
                        });
                        if (permission_ids.length > 0) {
                            yield tx.rolePermission.createMany({
                                data: permission_ids.map((permissionId) => ({
                                    roleId: id,
                                    permissionId,
                                })),
                                skipDuplicates: true,
                            });
                        }
                    }
                    // 3. Return role with fresh permissions attached
                    return tx.role.findUnique({
                        where: { id },
                        include: { permissions: { include: { permission: true } } },
                    });
                }));
                return role;
            }
            catch (err) {
                if (err.code === "P2025") {
                    throw new app_error_1.APIError("NOT_FOUND", app_error_1.STATUS_CODES.NOT_FOUND, "Role not found", true);
                }
                throw new app_error_1.APIError(String(err), app_error_1.STATUS_CODES.INTERNAL_ERROR, "Unable to update role", true);
            }
        });
    }
    getRole(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const [roles, total] = yield prisma.$transaction([
                    prisma.role.findMany({
                        skip,
                        take: limit,
                        include: {
                            permissions: {
                                include: { permission: true },
                            },
                        },
                    }),
                    prisma.role.count(),
                ]);
                return { roles, total };
            }
            catch (err) {
                console.error("Prisma getRole error:", err);
                throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Failed to fetch Roles", true);
            }
        });
    }
}
exports.default = RoleRepository;
