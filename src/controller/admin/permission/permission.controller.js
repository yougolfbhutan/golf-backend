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
exports.CreatePermissionController = void 0;
const permission_service_1 = __importDefault(require("../../../services/admin-services/permission/permission.service"));
const response_handler_1 = require("../../../utils/response-handler/response-handler");
const constants_1 = __importDefault(require("../upload-golf-course/constants"));
class CreatePermissionController {
    constructor() {
        // public service = new UploadImportantFiles.AdminService();
        this.service = new permission_service_1.default();
        this.addPermission = this.addPermission.bind(this);
        this.deletePermission = this.deletePermission.bind(this);
        this.updatePermission = this.updatePermission.bind(this);
        this.getPermission = this.getPermission.bind(this);
    }
    addPermission(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { permission_name } = req.body;
                const { data } = yield this.service.createPermission({
                    permission_name,
                });
                return response_handler_1.ApiResponse.success(res, "Permission added successfully", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    deletePermission(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const permissionId = Number(req.params.id); // ✅ retrieve the ID from the URL
                const { data } = yield this.service.deletePermissionService(permissionId);
                return response_handler_1.ApiResponse.success(res, "Deleted Successuflly", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    updatePermission(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const permissionId = Number(req.params.id); // ✅ retrieve the ID from the URL
                console.log("permissionId", permissionId, req.body);
                const { data } = yield this.service.updatePermissionService(permissionId, req.body);
                return response_handler_1.ApiResponse.success(res, "Permission updated successfully", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    getPermission(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Math.max(Number(req.query.page) || 1, 1);
                const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
                const { permissions, meta } = yield this.service.getPermissionService({
                    page,
                    limit,
                });
                return response_handler_1.ApiResponse.success(res, "Permission retrieved successfully", 200, {
                    data: permissions,
                    meta: meta,
                });
            }
            catch (error) {
                return response_handler_1.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
}
exports.CreatePermissionController = CreatePermissionController;
