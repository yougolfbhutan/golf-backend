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
const item_variant_repository_1 = __importDefault(require("../../../model/admin-repository/item-variant-repository/item-variant.repository"));
const validation_1 = require("../../../utils/validation/validation");
class ItemVariantService {
    constructor() {
        this.repository = new item_variant_repository_1.default();
    }
    createItemVariant(userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { size, color, itemId, packQuantity, price, stockQty, urls, availability } = userInputs;
                const souvenir = yield this.repository.createItemVariant({
                    size,
                    color,
                    itemId,
                    packQuantity,
                    price,
                    stockQty,
                    urls,
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
    deleteItemVariantService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingSouvenir = yield this.repository.deleteItemVariant(id);
                return (0, validation_1.FormateData)({ existingSouvenir });
            }
            catch (error) {
                return (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    updateItemVariant(sku, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedVariant = yield this.repository.updateItemVariant(sku, updateData);
                return (0, validation_1.FormateData)({
                    status: 200,
                    data: updatedVariant,
                    message: "Variant updated successfully",
                });
            }
            catch (error) {
                throw (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    getItemVariantService(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit }) {
            try {
                const { itemVariants, total } = yield this.repository.getItemVarirant({ page, limit });
                return (0, validation_1.FormateData)({ itemVariants, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
            }
            catch (error) {
                throw (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
}
exports.default = ItemVariantService;
