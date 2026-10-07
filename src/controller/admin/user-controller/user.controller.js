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
exports.CreateUserController = void 0;
const response_handler_1 = require("../../../utils/response-handler/response-handler");
const constants_1 = __importDefault(require("../upload-golf-course/constants"));
const user_services_1 = __importDefault(require("../../../services/admin-services/user-services"));
class CreateUserController {
    constructor() {
        // public service = new UploadImportantFiles.AdminService();
        this.service = new user_services_1.default();
        this.createUser = this.createUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.getUsers = this.getUsers.bind(this);
    }
    createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { customer_name, email, password, phone_number, roles, permissions } = req.body;
                const { data } = yield this.service.createUser({
                    customer_name,
                    email,
                    password,
                    phone_number,
                    roles,
                    permissions
                });
                return response_handler_1.ApiResponse.success(res, "User added successfully", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = Number(req.params.id); // ✅ retrieve the ID from the URL
                const { data } = yield this.service.deleteUserService(userId);
                return response_handler_1.ApiResponse.success(res, "User deleted successfully", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = Number(req.params.id); // ✅ retrieve the ID from the URL
                const { data } = yield this.service.updateUserService(userId, req.body);
                return response_handler_1.ApiResponse.success(res, "User updated successfully", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Math.max(Number(req.query.page) || 1, 1);
                const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
                const { users, meta } = yield this.service.getUsersService({
                    page,
                    limit,
                });
                return response_handler_1.ApiResponse.success(res, "Users retrieved successfully", 200, {
                    data: users,
                    meta: meta,
                });
            }
            catch (error) {
                return response_handler_1.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
}
exports.CreateUserController = CreateUserController;
