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
const caddie_repository_1 = __importDefault(require("../../../model/admin/caddie-repository/caddie-repository"));
const validation_1 = require("../../../utils/validation/validation");
class CaddieService {
    constructor() {
        this.repository = new caddie_repository_1.default();
    }
    createCaddie(userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { caddiename, cidNo, phone_number } = userInputs;
            // console.log("Inputs", userInputs);
            try {
                const caddie = yield this.repository.createCaddie({
                    caddiename,
                    cidNo,
                    phone_number,
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
    deleteCaddieService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("deleteCaddieService", id);
            try {
                const existingCustomer = yield this.repository.deleteCaddie(id);
                return (0, validation_1.FormateData)({ existingCustomer });
            }
            catch (error) {
                throw (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    updateCaddieService(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("updateCaddieService", id, updateData);
            try {
                const existingCustomer = yield this.repository.updateCaddie(id, updateData);
                return (0, validation_1.FormateData)({ existingCustomer });
            }
            catch (error) {
                throw (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    getCaddieService(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit }) {
            try {
                const { caddies, total } = yield this.repository.getCaddies({ page, limit });
                return (0, validation_1.FormateData)({
                    caddies,
                    meta: {
                        page,
                        limit,
                        total,
                        totalPages: Math.ceil(total / limit),
                    },
                });
            }
            catch (error) {
                throw (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
}
exports.default = CaddieService;
