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
exports.RoleController = void 0;
const response_handler_1 = require("../../../utils/response-handler/response-handler");
const constants_1 = __importDefault(require("../upload-golf-course/constants"));
const role_service_1 = __importDefault(require("../../../services/admin-services/role/role.service"));
class RoleController {
    constructor() {
        // public service = new UploadImportantFiles.AdminService();
        this.service = new role_service_1.default();
        this.createRole = this.createRole.bind(this);
        this.deleteRole = this.deleteRole.bind(this);
        this.updateRole = this.updateRole.bind(this);
        this.getRoles = this.getRoles.bind(this);
    }
    createRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { role_name, permission_ids } = req.body; // <-- array of numbers, e.g. [1, 2, 3]
                const { data } = yield this.service.createRole(role_name, permission_ids);
                return response_handler_1.ApiResponse.success(res, "Role added successfully", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    deleteRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roleId = Number(req.params.id); // ✅ retrieve the ID from the URL
                const { data } = yield this.service.deleteRoleService(roleId);
                return response_handler_1.ApiResponse.success(res, "Deleted Successuflly", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    updateRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roleId = Number(req.params.id); // ✅ retrieve the ID from the URL
                const { role_name, permission_ids } = req.body;
                const { data } = yield this.service.updateRoleService(roleId, {
                    role_name,
                    permission_ids,
                });
                return response_handler_1.ApiResponse.success(res, "Role updated successfully", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    getRoles(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const data = yield this.service.getRoleService(page, limit);
                return response_handler_1.ApiResponse.success(res, "Roles retrieved successfully", 200, data);
            }
            catch (error) {
                return response_handler_1.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
}
exports.RoleController = RoleController;
