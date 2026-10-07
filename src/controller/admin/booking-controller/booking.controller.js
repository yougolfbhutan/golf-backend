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
exports.BookingController = void 0;
const response_handler_1 = require("../../../utils/response-handler/response-handler");
const constants_1 = __importDefault(require("../upload-golf-course/constants"));
const booking_services_1 = __importDefault(require("../../../services/admin-services/booking/booking-services"));
const prisma_1 = require("../../../../generated/prisma");
class BookingController {
    constructor() {
        this.service = new booking_services_1.default();
        this.createBooking = this.createBooking.bind(this);
        this.approveBookingAndOrder = this.approveBookingAndOrder.bind(this);
        this.getOrderBooking = this.getOrderBooking.bind(this);
    }
    createBooking(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { 
                // customerId,
                partyName, partyEmail, // ← added
                roundType, teeTime, teeOffDate, golfCourseName, carrySetId, numberOfRounds, accessories, partyPhone, specialRequest, } = req.body;
                const { data } = yield this.service.createBooking({
                    // customerId,
                    partyName,
                    partyEmail,
                    roundType,
                    teeTime,
                    teeOffDate,
                    golfCourseName,
                    carrySetId,
                    numberOfRounds,
                    accessories,
                    partyPhone,
                    specialRequest,
                });
                return response_handler_1.ApiResponse.success(res, "Booking created successfully", 200, data);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    approveBookingAndOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingId = Number(req.params.id);
                if (!bookingId) {
                    return response_handler_1.ApiResponse.error(res, "Invalid booking id", 400);
                }
                const result = yield this.service.approveBookingAndOrder(bookingId);
                if (!result) {
                    return response_handler_1.ApiResponse.error(res, "Failed to approve booking and order", 401);
                }
                return response_handler_1.ApiResponse.success(res, "Booking and order approved successfully", 200, result);
            }
            catch (error) {
                return response_handler_1.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    getOrderBooking(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Math.max(Number(req.query.page) || 1, 1);
                const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
                let status;
                if (req.query.status) {
                    const raw = String(req.query.status);
                    if (!Object.values(prisma_1.BookingStatus).includes(raw)) {
                        return response_handler_1.ApiResponse.error(res, "Invalid status filter", 400);
                    }
                    status = raw;
                }
                const result = yield this.service.getOrderBooking({ page, limit, status });
                if (!result) {
                    return response_handler_1.ApiResponse.error(res, "Failed to retrieve bookings", 401);
                }
                const { data } = result;
                return response_handler_1.ApiResponse.success(res, "Booking and order data retrieved successfully", 200, data);
            }
            catch (error) {
                return response_handler_1.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
}
exports.BookingController = BookingController;
