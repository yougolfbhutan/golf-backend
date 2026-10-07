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
exports.ExtractItemController = void 0;
const response_handler_1 = require("../../../utils/response-handler/response-handler");
const constants_1 = __importDefault(require("../../admin/upload-golf-course/constants"));
const extract_item_services_1 = __importDefault(require("../../../services/customer-services/extract-item/extract-item.services"));
class ExtractItemController {
    constructor() {
        // public service = new UploadImportantFiles.AdminService();
        this.service = new extract_item_services_1.default();
        this.extractItem = this.extractItem.bind(this);
    }
    extractItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield this.service.extractItemService();
                return response_handler_1.ApiResponse.success(res, "ItemVariant retrieved successfully", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
}
exports.ExtractItemController = ExtractItemController;
