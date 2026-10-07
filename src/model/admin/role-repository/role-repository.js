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
exports.RolePermissionRepository = void 0;
const client_1 = require("../../../../generated/prisma/client");
const app_error_1 = require("../../../custom-error/app-error");
const prisma = new client_1.PrismaClient();
class RolePermissionRepository {
    findRoleAndPermission(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield prisma.customer.findUnique({
                    where: {
                        id: user, // also fixed: was hardcoded to 1, ignoring the `user` param
                    },
                    include: {
                        roles: {
                            include: {
                                role: {
                                    include: {
                                        permissions: {
                                            include: {
                                                permission: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                return userData;
            }
            catch (err) {
                console.error("Error finding role and permission:", err);
                throw new app_error_1.APIError("API Error", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Unable to find role and permission");
            }
        });
    }
}
exports.RolePermissionRepository = RolePermissionRepository;
