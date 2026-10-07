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
exports.ItemVariantController = void 0;
const response_handler_1 = require("../../../utils/response-handler/response-handler");
const constants_1 = __importDefault(require("../upload-golf-course/constants"));
const item_variant_services_1 = __importDefault(require("../../../services/admin-services/item-variant/item-variant.services"));
class ItemVariantController {
    constructor() {
        // public service = new UploadImportantFiles.AdminService();
        this.service = new item_variant_services_1.default();
        this.createItemVariant = this.createItemVariant.bind(this);
        this.deleteItemVariant = this.deleteItemVariant.bind(this);
        this.updateItemVariant = this.updateItemVariant.bind(this);
        this.getItemVariant = this.getItemVariant.bind(this);
    }
    createItemVariant(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { size, color, itemId, packQuantity, price, stockQty, availability, } = req.body; // <-- array of numbers, e.g. [1, 2, 3]
                const cloudinaryUrls = req.body.cloudinaryUrls;
                if (cloudinaryUrls.length === 0) {
                    return constants_1.default.APIError;
                    // return res.status(500).send("Internal Server Error");
                }
                let Availability;
                if (availability == "true") {
                    Availability = true;
                }
                else {
                    Availability = false;
                }
                const { data } = yield this.service.createItemVariant({
                    availability: Availability,
                    size,
                    color,
                    itemId,
                    packQuantity,
                    price,
                    stockQty,
                    urls: cloudinaryUrls, // <-- pass the array of numbers to the service
                });
                return response_handler_1.ApiResponse.success(res, "Souvenir added successfully", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    deleteItemVariant(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ItemVariantId = Number(req.params.id); // ✅ retrieve the ID from the URL
                const { data } = yield this.service.deleteItemVariantService(ItemVariantId);
                return response_handler_1.ApiResponse.success(res, "Deleted ItemVariant Successfully", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    updateItemVariant(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sku = req.params.id; // ⚠️ string, don't Number() this
                const { color, size, packQuantity, price, stockQty, availability, attributes, } = req.body;
                const cloudinaryUrls = req.body.cloudinaryUrls;
                //   if (cloudinaryUrls.length === 0) {
                //     return UploadImportantFiles.APIError;
                //     // return res.status(500).send("Internal Server Error");
                //   }
                const { data } = yield this.service.updateItemVariant(sku, {
                    color,
                    size,
                    packQuantity,
                    price,
                    stockQty,
                    availability,
                    attributes,
                    urls: cloudinaryUrls,
                });
                return response_handler_1.ApiResponse.success(res, "Variant updated successfully", 200, data);
            }
            catch (error) {
                return response_handler_1.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    getItemVariant(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Math.max(Number(req.query.page) || 1, 1);
                const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100); // cap it so nobody requests 1M rows
                const { data } = yield this.service.getItemVariantService({
                    page,
                    limit,
                });
                return response_handler_1.ApiResponse.success(res, "ItemVariant retrieved successfully", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
}
exports.ItemVariantController = ItemVariantController;
