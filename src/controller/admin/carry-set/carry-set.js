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
exports.UploadCarrySet = void 0;
const response_handler_1 = require("../../../utils/response-handler/response-handler");
const constants_1 = __importDefault(require("../upload-golf-course/constants"));
const admin_add_carry_set_1 = __importDefault(require("../../../services/admin-services/add-carry-set/admin-add-carry-set"));
class UploadCarrySet {
    constructor() {
        // public service = new UploadImportantFiles.AdminService();
        this.service = new admin_add_carry_set_1.default();
        this.addCarrySet = this.addCarrySet.bind(this);
        this.deleteCarrySet = this.deleteCarrySet.bind(this);
        this.updateCarrySet = this.updateCarrySet.bind(this);
        this.getCarrySet = this.getCarrySet.bind(this);
    }
    addCarrySet(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { carrysetname, caddieId, peopleId, roundId, availability } = req.body;
                const cloudinaryUrls = req.body.cloudinaryUrls;
                if (cloudinaryUrls.length === 0) {
                    return constants_1.default.APIError;
                    // return res.status(500).send("Internal Server Error");
                }
                const { data } = yield this.service.addCarrySetService({
                    carrysetname,
                    availability: availability,
                    urls: cloudinaryUrls,
                    caddieId: caddieId,
                    peopleId,
                    roundId
                });
                return response_handler_1.ApiResponse.success(res, "Carry set added successfully", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    deleteCarrySet(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const carrySetId = Number(req.params.id); // ✅ retrieve the ID from the URL
                const { data } = yield this.service.deleteCarrySetService(carrySetId);
                return response_handler_1.ApiResponse.success(res, "Deleted Carry Set Successfully", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    updateCarrySet(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const carrySetId = Number(req.params.id); // ✅ retrieve the ID from the URL
                console.log("carrySetId", carrySetId, req.body);
                const { data } = yield this.service.updateCarrySetService(carrySetId, req.body);
                return response_handler_1.ApiResponse.success(res, "Carry set updated successfully", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    getCarrySet(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Math.max(Number(req.query.page) || 1, 1);
                const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
                const { data } = yield this.service.getCarrySetService({ page, limit });
                return response_handler_1.ApiResponse.success(res, "Carry set retrieved successfully", 200, {
                    carrySets: data.carrySets,
                    meta: data.meta,
                });
            }
            catch (error) {
                const statusCode = (error === null || error === void 0 ? void 0 : error.statusCode) || 500;
                const message = error instanceof Error ? error.message : "An unexpected error occurred";
                return response_handler_1.ApiResponse.error(res, message, statusCode);
            }
        });
    }
}
exports.UploadCarrySet = UploadCarrySet;
