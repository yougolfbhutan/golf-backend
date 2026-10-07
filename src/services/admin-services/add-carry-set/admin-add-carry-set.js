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
const add_carryset_repository_1 = __importDefault(require("../../../model/admin-repository/add-carryset-repository/add-carryset-repository"));
const validation_1 = require("../../../utils/validation/validation");
const carryset_validators_1 = __importDefault(require("../../../utils/Validator/admin/carry-set/carryset-validators"));
class AddCarrySet {
    constructor() {
        this.repository = new add_carryset_repository_1.default();
    }
    addCarrySetService(userUploadDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            yield carryset_validators_1.default.validate(userUploadDetails);
            const { carrysetname, availability, urls, caddieId, peopleId, roundId } = userUploadDetails;
            console.log("Availability value in service:", availability);
            try {
                const existingCustomer = yield this.repository.createCarrySet({
                    carrysetname,
                    availability,
                    urls,
                    caddieId: caddieId,
                    peopleId, roundId
                });
                return (0, validation_1.FormateData)({ existingCustomer });
            }
            catch (error) {
                throw (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    deleteCarrySetService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingCustomer = yield this.repository.deleteCarrySet(id);
                return (0, validation_1.FormateData)({ existingCustomer });
            }
            catch (error) {
                throw (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    updateCarrySetService(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingCustomer = yield this.repository.updateCarrySet(id, updateData);
                return (0, validation_1.FormateData)({ existingCustomer });
            }
            catch (error) {
                throw (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    getCarrySetService(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit }) {
            try {
                const { carrySets, total } = yield this.repository.getCarrySet({ page, limit });
                return (0, validation_1.FormateData)({
                    carrySets,
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
exports.default = AddCarrySet;
