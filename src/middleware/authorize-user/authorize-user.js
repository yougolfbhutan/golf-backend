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
const response_handler_1 = require("../../utils/response-handler/response-handler");
const common_errror_handler_1 = require("../errorHandler/common-errror-handler");
class RolePermissionHandler {
    static finalRolePermission(body) {
        throw new Error("Method not implemented.");
    }
    finalRolePermission(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.finalRolePermission(id);
                if (!result) {
                    throw new response_handler_1.ApiResponse();
                }
                return result;
            }
            catch (error) {
                throw (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
}
exports.default = RolePermissionHandler;
