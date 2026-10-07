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
exports.PaymentController = void 0;
const response_handler_1 = require("../../../utils/response-handler/response-handler");
const constants_1 = __importDefault(require("../upload-golf-course/constants"));
const payment_service_1 = __importDefault(require("../../../services/admin-services/payment/payment.service"));
class PaymentController {
    constructor() {
        this.service = new payment_service_1.default();
        this.createPayment = this.createPayment.bind(this);
        this.getPayment = this.getPayment.bind(this);
        // this.getPayment = this.getPayment.bind(this);
        // this.updatePayment = this.updatePayment.bind(this);
    }
    createPayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { BookingId, paymentAmount, paymentDate, PaymentMethod, journalNumber, referenceNumber, } = req.body;
                const { data } = yield this.service.createPayment({
                    BookingId,
                    paymentAmount,
                    paymentDate,
                    PaymentMethod,
                    journalNumber,
                    referenceNumber,
                });
                return response_handler_1.ApiResponse.success(res, "Payment created successfully", 200, data);
            }
            catch (error) {
                console.log("Error in createPayment:", error);
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    getPayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Math.max(Number(req.query.page) || 1, 1);
                const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
                const result = yield this.service.getPayment({ page, limit });
                if (!result) {
                    return response_handler_1.ApiResponse.error(res, "Failed to retrieve payment", 401);
                }
                return response_handler_1.ApiResponse.success(res, "ItemVariant retrieved successfully", 200, result);
            }
            catch (error) {
                console.log("error", error);
                return response_handler_1.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
}
exports.PaymentController = PaymentController;
