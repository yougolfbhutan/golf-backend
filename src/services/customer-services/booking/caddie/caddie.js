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
const common_errror_handler_1 = require("../../../../middleware/errorHandler/common-errror-handler");
const golfcourse_booking_repository_1 = __importDefault(require("../../../../model/customer/booking/golf-course/golfcourse-booking-repository"));
const validation_1 = require("../../../../utils/validation/validation");
const booking_golfcourse_1 = __importDefault(require("../../../../utils/Validator/customer/booking-golfcourse"));
const cancel_booking_1 = require("../../../../utils/Validator/customer/cancel-booking");
class CaddieService {
    constructor() {
        this.repository = new golfcourse_booking_repository_1.default();
    }
    createCaddie(userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            yield booking_golfcourse_1.default.validate(userInputs);
            const { golfCourseId, carrySetId, date } = userInputs;
            try {
                const existingCustomer = yield this.repository.createGolfCourseBooking({
                    golfCourseId,
                    carrySetId,
                    date,
                });
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
    cancelBookingService(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield cancel_booking_1.bookingIdSchema.validate(bookingId);
            try {
                const cancelledBooking = yield this.repository.cancelGolfCourseBooking(bookingId);
                return (0, validation_1.FormateData)({
                    status: 200,
                    data: cancelledBooking,
                    message: "Booking cancelled successfully",
                });
            }
            catch (error) {
                return (0, common_errror_handler_1.errorHandler)(error); // ✅ Return, don't throw
            }
        });
    }
}
exports.default = CaddieService;
