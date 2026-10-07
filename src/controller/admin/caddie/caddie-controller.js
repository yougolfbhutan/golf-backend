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
exports.CaddieController = void 0;
const response_handler_1 = require("../../../utils/response-handler/response-handler");
const caddie_services_1 = __importDefault(require("../../../services/admin-services/caddie-services/caddie-services"));
const constants_1 = __importDefault(require("../upload-golf-course/constants"));
class CaddieController {
    constructor() {
        this.service = new caddie_services_1.default();
        this.uploadCaddie = this.uploadCaddie.bind(this);
        this.deleteCaddie = this.deleteCaddie.bind(this);
        this.getCaddie = this.getCaddie.bind(this);
        this.updateCaddie = this.updateCaddie.bind(this);
    }
    uploadCaddie(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { caddiename, cidNo, phone_number } = req.body;
                console.log("req.body caddie", req.body);
                const { data } = yield this.service.createCaddie({
                    caddiename,
                    cidNo,
                    phone_number,
                });
                return response_handler_1.ApiResponse.success(res, "Caddie created successfully", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    deleteCaddie(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const carrySetId = Number(req.params.id); // ✅ retrieve the ID from the URL
                const { data } = yield this.service.deleteCaddieService(carrySetId);
                return response_handler_1.ApiResponse.success(res, "Deleted Successuflly", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    updateCaddie(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const carrySetId = Number(req.params.id); // ✅ retrieve the ID from the URL
                const { data } = yield this.service.updateCaddieService(carrySetId, req.body);
                return response_handler_1.ApiResponse.success(res, "Caddie updated successfully", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    getCaddie(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Math.max(Number(req.query.page) || 1, 1);
                const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100); // cap it so nobody requests 1M rows
                const { data } = yield this.service.getCaddieService({ page, limit });
                return response_handler_1.ApiResponse.success(res, "Caddie retrieved successfully", 200, { caddies: data.caddies, meta: data.meta });
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
}
exports.CaddieController = CaddieController;
