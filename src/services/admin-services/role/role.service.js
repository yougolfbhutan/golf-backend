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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_errror_handler_1 = require("../../../middleware/errorHandler/common-errror-handler");
const role_repository_1 = __importDefault(require("../../../model/admin-repository/role-repository/role.repository"));
const validation_1 = require("../../../utils/validation/validation");
class RoleService {
    constructor() {
        this.repository = new role_repository_1.default();
    }
    createRole(userInputs_1) {
        return __awaiter(this, arguments, void 0, function* (userInputs, permissionIds = []) {
            // console.log("Inputs", userInputs);
            try {
                const role = yield this.repository.createRole(userInputs, permissionIds);
                return (0, validation_1.FormateData)({
                    status: 200,
                    data: role,
                    message: "success message",
                });
            }
            catch (error) {
                return (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    deleteRoleService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingCustomer = yield this.repository.deleteRole(id);
                return (0, validation_1.FormateData)({ existingCustomer });
            }
            catch (error) {
                throw (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    updateRoleService(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const role = yield this.repository.updateRole(id, updateData);
                return (0, validation_1.FormateData)({
                    status: 200,
                    data: role,
                    message: "Role updated successfully",
                });
            }
            catch (error) {
                throw (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    getRoleService(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { roles, total } = yield this.repository.getRole(page, limit);
                return {
                    roles,
                    pagination: {
                        total,
                        page,
                        limit,
                        totalPages: Math.ceil(total / limit),
                    },
                };
            }
            catch (error) {
                throw (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
}
exports.default = RoleService;
