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
const user_repository_1 = __importDefault(require("../../../model/admin-repository/user-repository"));
const validation_1 = require("../../../utils/validation/validation");
class UserService {
    constructor() {
        this.repository = new user_repository_1.default();
    }
    createUser(userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { customer_name, email, password, phone_number, roles, permissions } = userInputs;
            // console.log("Inputs", userInputs);
            try {
                const caddie = yield this.repository.createUser({
                    customer_name,
                    email,
                    password,
                    phone_number,
                    roles,
                    permissions
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
    deleteUserService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("deleteUserService", id);
            try {
                const existingCustomer = yield this.repository.deleteUser(id);
                return (0, validation_1.FormateData)({ existingCustomer });
            }
            catch (error) {
                throw (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    updateUserService(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("updateUserService", id, updateData);
            try {
                const existingCustomer = yield this.repository.updateUser(id, updateData);
                return (0, validation_1.FormateData)({ existingCustomer });
            }
            catch (error) {
                throw (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    //   // service.ts
    getUsersService(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit }) {
            try {
                const { users, total } = yield this.repository.getUsers({ page, limit });
                return {
                    users,
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
exports.default = UserService;
