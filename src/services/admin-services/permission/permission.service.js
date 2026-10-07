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
const permission_repository_1 = __importDefault(require("../../../model/admin-repository/permission-repository/permission.repository"));
const validation_1 = require("../../../utils/validation/validation");
class PermissionService {
    constructor() {
        this.repository = new permission_repository_1.default();
    }
    createPermission(userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { permission_name } = userInputs;
            // console.log("Inputs", userInputs);
            try {
                const caddie = yield this.repository.createPermission({
                    permission_name
                });
                return (0, validation_1.FormateData)({
                    status: 200,
                    data: caddie,
                    message: "success message",
                });
            }
            catch (error) {
                return (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    deletePermissionService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("deletePermissionService", id);
            try {
                const existingCustomer = yield this.repository.deletePermission(id);
                return (0, validation_1.FormateData)({ existingCustomer });
            }
            catch (error) {
                throw (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    updatePermissionService(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("updatePermissionService", id, updateData);
            try {
                const existingCustomer = yield this.repository.updatePermission(id, updateData);
                return (0, validation_1.FormateData)({ existingCustomer });
            }
            catch (error) {
                throw (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    // service.ts
    getPermissionService(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit }) {
            try {
                const { permissions, total } = yield this.repository.getPermission({ page, limit });
                return {
                    permissions,
                    meta: {
                        page,
                        limit,
                        total,
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
exports.default = PermissionService;
