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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_error_1 = require("../../../custom-error/app-error");
const prisma_1 = require("../../../../generated/prisma");
const validation_1 = require("../../../utils/validation/validation");
const prisma = new prisma_1.PrismaClient();
class UserRepository {
    createUser(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingRoles = yield prisma.role.findMany({
                    where: { id: { in: input.roles } },
                    select: { id: true },
                });
                const existingRoleIds = new Set(existingRoles.map((r) => r.id));
                const missingRoleIds = input.roles.filter((id) => !existingRoleIds.has(id));
                if (missingRoleIds.length > 0) {
                    throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.BAD_REQUEST, `Invalid role id(s): ${missingRoleIds.join(", ")}`, true);
                }
                const userdata = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    // 1. Create the customer + attach roles via CustomerRole
                    const customer = yield tx.customer.create({
                        data: {
                            customer_name: input.customer_name,
                            email: input.email,
                            password: input.password, // ⚠️ hash before this point — see note below
                            phone_number: input.phone_number,
                            roles: {
                                create: input.roles.map((roleId) => ({
                                    role: { connect: { id: roleId } },
                                })),
                            },
                        },
                    });
                    // 2. Attach permissions directly to THIS customer only.
                    //    Permissions no longer live on Role — this is per-user.
                    if ((_a = input.permissions) === null || _a === void 0 ? void 0 : _a.length) {
                        yield tx.customerPermission.createMany({
                            data: input.permissions.map((permissionId) => ({
                                customerId: customer.id,
                                permissionId,
                            })),
                            skipDuplicates: true,
                        });
                    }
                    // 3. Return the customer with roles + permissions populated
                    return tx.customer.findUnique({
                        where: { id: customer.id },
                        include: {
                            roles: { include: { role: true } },
                            permissions: { include: { permission: true } },
                        },
                    });
                }));
                return (0, validation_1.FormateData)({ userdata });
            }
            catch (err) {
                console.error("Prisma createUser error:", err);
                throw err instanceof app_error_1.APIError
                    ? err
                    : new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Unable to add User", true);
            }
        });
    }
    deleteUser(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userdata = yield prisma.customer.delete({
                    where: {
                        id: input,
                    },
                });
                return (0, validation_1.FormateData)({ userdata });
            }
            catch (err) {
                throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "No Permission to delete", true);
            }
        });
    }
    updateUser(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Validate role ids up front too, same as createUser
                if ((_a = updateData.roles) === null || _a === void 0 ? void 0 : _a.length) {
                    const existingRoles = yield prisma.role.findMany({
                        where: { id: { in: updateData.roles } },
                        select: { id: true },
                    });
                    const existingRoleIds = new Set(existingRoles.map((r) => r.id));
                    const missingRoleIds = updateData.roles.filter((rid) => !existingRoleIds.has(rid));
                    if (missingRoleIds.length > 0) {
                        throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.BAD_REQUEST, `Invalid role id(s): ${missingRoleIds.join(", ")}`, true);
                    }
                }
                const userdata = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const scalarData = {};
                    if (updateData.customer_name !== undefined)
                        scalarData.customer_name = updateData.customer_name;
                    if (updateData.email !== undefined)
                        scalarData.email = updateData.email;
                    if (updateData.phone_number !== undefined)
                        scalarData.phone_number = updateData.phone_number;
                    // hash with a NEW salt whenever password changes
                    if (updateData.password !== undefined &&
                        updateData.password.trim() !== "") {
                        const newSalt = yield (0, validation_1.GenerateSalt)();
                        scalarData.password = yield (0, validation_1.GeneratePassword)(updateData.password, newSalt);
                        scalarData.salt = newSalt; // must update salt alongside password!
                    }
                    yield tx.customer.update({
                        where: { id },
                        data: scalarData,
                    });
                    // 2. If roles were provided, replace the customer's role set
                    if (updateData.roles) {
                        yield tx.customerRole.deleteMany({ where: { customerId: id } });
                        if (updateData.roles.length) {
                            yield tx.customerRole.createMany({
                                data: updateData.roles.map((roleId) => ({
                                    customerId: id,
                                    roleId,
                                })),
                                skipDuplicates: true,
                            });
                        }
                    }
                    // 3. If permissions were provided, replace this customer's permission set.
                    //    Runs on an explicit empty array too, so clearing all permissions works.
                    if (updateData.permissions !== undefined) {
                        yield tx.customerPermission.deleteMany({ where: { customerId: id } });
                        if (updateData.permissions.length) {
                            yield tx.customerPermission.createMany({
                                data: updateData.permissions.map((permissionId) => ({
                                    customerId: id,
                                    permissionId,
                                })),
                                skipDuplicates: true,
                            });
                        }
                    }
                    // 4. Return the fully populated customer
                    return tx.customer.findUnique({
                        where: { id },
                        include: {
                            roles: { include: { role: true } },
                            permissions: { include: { permission: true } },
                        },
                    });
                }));
                return (0, validation_1.FormateData)({ userdata });
            }
            catch (err) {
                console.error("Prisma updateUser error:", err);
                throw err instanceof app_error_1.APIError
                    ? err
                    : new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Unable to update user", true);
            }
        });
    }
    getUsers(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit, }) {
            try {
                const skip = (page - 1) * limit;
                const [users, total] = yield Promise.all([
                    prisma.customer.findMany({
                        skip,
                        take: limit,
                        orderBy: { id: "desc" },
                        include: {
                            roles: { include: { role: true } },
                            permissions: { include: { permission: true } },
                        },
                    }),
                    prisma.customer.count(),
                ]);
                // flatten roles and permissions, strip sensitive fields
                const safeUsers = users.map((_a) => {
                    var { password, salt, roles, permissions } = _a, rest = __rest(_a, ["password", "salt", "roles", "permissions"]);
                    return (Object.assign(Object.assign({}, rest), { roles: roles.map((r) => ({
                            id: r.role.id,
                            name: r.role.role_name,
                        })), permissions: permissions.map((p) => ({
                            id: p.permission.id,
                            name: p.permission.permission_name,
                        })) }));
                });
                return {
                    users: safeUsers,
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                };
            }
            catch (err) {
                console.error("Prisma getUsers error:", err);
                throw new app_error_1.APIError("API_ERROR", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Failed to fetch Users", true);
            }
        });
    }
}
exports.default = UserRepository;
