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
const get_carryset_caddie_repository_1 = __importDefault(require("../../../model/customer/get-carryset-caddie/get-carryset-caddie.repository"));
const validation_1 = require("../../../utils/validation/validation");
class GetCarrysetCaddieService {
    constructor() {
        this.repository = new get_carryset_caddie_repository_1.default();
    }
    getCarrysetCaddie() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingCustomer = yield this.repository.getCarrysetCaddie();
                return (0, validation_1.FormateData)({
                    status: 200,
                    data: existingCustomer,
                    message: "success message",
                });
            }
            catch (error) {
                return (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
}
exports.default = GetCarrysetCaddieService;
