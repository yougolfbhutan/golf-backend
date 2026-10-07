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
exports.checkPermission = void 0;
const response_handler_1 = require("../response-handler/response-handler");
const role_repository_1 = require("../../model/admin/role-repository/role-repository");
const checkPermission = (requirePermission) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const user = req.user;
            if (!(user === null || user === void 0 ? void 0 : user.id)) {
                return response_handler_1.ApiResponse.error(res, "Not authenticated", 401);
            }
            const rolePermissionRepo = new role_repository_1.RolePermissionRepository();
            const customerData = yield rolePermissionRepo.findRoleAndPermission(user.id);
            const userPermissions = (_a = customerData === null || customerData === void 0 ? void 0 : customerData.roles.flatMap((cr) => { var _a, _b, _c; return (_c = (_b = (_a = cr.role) === null || _a === void 0 ? void 0 : _a.permissions) === null || _b === void 0 ? void 0 : _b.map((rp) => rp.permission.permission_name)) !== null && _c !== void 0 ? _c : []; })) !== null && _a !== void 0 ? _a : [];
            console.log("userPermissions", userPermissions);
            if (userPermissions.includes(requirePermission)) {
                return next();
            }
            return response_handler_1.ApiResponse.error(res, "Insufficient permissions", 403);
        }
        catch (error) {
            console.error("checkPermission error:", error);
            return response_handler_1.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 403);
        }
    });
};
exports.checkPermission = checkPermission;
