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
exports.SouvenirController = void 0;
const response_handler_1 = require("../../../utils/response-handler/response-handler");
const constants_1 = __importDefault(require("../upload-golf-course/constants"));
const souvenir_services_1 = __importDefault(require("../../../services/admin-services/souvenir/souvenir.services"));
class SouvenirController {
    constructor() {
        // public service = new UploadImportantFiles.AdminService();
        this.service = new souvenir_services_1.default();
        this.createSouvenir = this.createSouvenir.bind(this);
        this.deleteSouvenir = this.deleteSouvenir.bind(this);
        this.updateSouvenir = this.updateSouvenir.bind(this);
        this.getSouvenirs = this.getSouvenirs.bind(this);
    }
    createSouvenir(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description, categoryId } = req.body; // <-- array of numbers, e.g. [1, 2, 3]
                const { data } = yield this.service.createSouvenir({
                    name,
                    description,
                    categoryId,
                });
                return response_handler_1.ApiResponse.success(res, "Souvenir added successfully", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    deleteSouvenir(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const souvenirId = Number(req.params.id); // ✅ retrieve the ID from the URL
                const { data } = yield this.service.deleteSouvenirService(souvenirId);
                return response_handler_1.ApiResponse.success(res, "Deleted Souvenir Successfully", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    updateSouvenir(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const souvenirId = Number(req.params.id); // ✅ retrieve the ID from the URL
                const { name, description, categoryId } = req.body; // <-- array of numbers, e.g. [1, 2, 3]
                // const cloudinaryUrls = req.body.cloudinaryUrls;
                // if (cloudinaryUrls.length === 0) {
                //   return UploadImportantFiles.APIError;
                //   // return res.status(500).send("Internal Server Error");
                // }
                // let Availability;
                // if (availability == "true") {
                //   Availability = true;
                // } else {
                //   Availability = false;
                // }
                const { data } = yield this.service.updateSouvenirService(souvenirId, {
                    name,
                    description,
                    categoryId,
                });
                return response_handler_1.ApiResponse.success(res, "Souvenir updated successfully", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    getSouvenirs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Math.max(Number(req.query.page) || 1, 1);
                const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100); // cap it so nobody requests 1M rows
                const { data } = yield this.service.getSouvenirsService(page, limit);
                return response_handler_1.ApiResponse.success(res, "Souvenirs retrieved successfully", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
}
exports.SouvenirController = SouvenirController;
