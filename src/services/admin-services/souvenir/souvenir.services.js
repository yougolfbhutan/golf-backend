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
const souvier_repository_1 = __importDefault(require("../../../model/admin-repository/souvier-repository/souvier.repository"));
const validation_1 = require("../../../utils/validation/validation");
class SouvenirService {
    constructor() {
        this.repository = new souvier_repository_1.default();
    }
    createSouvenir(userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description, categoryId } = userInputs;
                const souvenir = yield this.repository.createSouvenir({
                    name,
                    description,
                    categoryId,
                    // urls,
                });
                return (0, validation_1.FormateData)({
                    status: 200,
                    data: souvenir,
                    message: "success message",
                });
            }
            catch (error) {
                return (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    deleteSouvenirService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingSouvenir = yield this.repository.deleteSouvenir(id);
                return (0, validation_1.FormateData)({ existingSouvenir });
            }
            catch (error) {
                return (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    updateSouvenirService(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateSouvenir = yield this.repository.updateSouvenir(id, updateData);
                return (0, validation_1.FormateData)({
                    status: 200,
                    data: updateSouvenir,
                    message: "Souvenir updated successfully",
                });
            }
            catch (error) {
                throw (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    getSouvenirsService(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { souvenirs, total } = yield this.repository.getSouvenirs({ page, limit });
                return (0, validation_1.FormateData)({ souvenirs, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
            }
            catch (error) {
                throw (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
}
exports.default = SouvenirService;
