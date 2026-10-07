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
const payment_repository_1 = __importDefault(require("../../../model/admin-repository/payment-repository/payment.repository"));
const validation_1 = require("../../../utils/validation/validation");
class PaymentService {
    constructor() {
        this.repository = new payment_repository_1.default();
    }
    createPayment(userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { BookingId, paymentAmount, paymentDate, PaymentMethod, journalNumber, referenceNumber, } = userInputs;
            // console.log("Inputs", userInputs);
            try {
                const payment = yield this.repository.createPayment({
                    BookingId,
                    paymentAmount,
                    paymentDate,
                    PaymentMethod,
                    journalNumber,
                    referenceNumber,
                });
                return (0, validation_1.FormateData)({
                    status: 200,
                    data: payment,
                    message: "success message",
                });
            }
            catch (error) {
                return (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    getPayment(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit }) {
            try {
                const { paymentDetails, total } = yield this.repository.getPayment({
                    page,
                    limit,
                });
                return (0, validation_1.FormateData)({
                    status: 200,
                    data: {
                        paymentDetails,
                        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
                    },
                    message: "successfully fetched Payment data",
                });
            }
            catch (error) {
                return (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
}
exports.default = PaymentService;
