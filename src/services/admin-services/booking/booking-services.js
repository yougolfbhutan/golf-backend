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
const booking_repository_1 = __importDefault(require("../../../model/admin-repository/booking-repository/booking-repository"));
const booking_email_templates_1 = require("../../../utils/mailer/bookingemailtemplates/booking-email-templates");
const mailer_1 = require("../../../utils/mailer/email/mailer");
const validation_1 = require("../../../utils/validation/validation");
class BookingService {
    constructor() {
        this.repository = new booking_repository_1.default();
    }
    createBooking(userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { 
            // customerId,
            partyName, partyEmail, roundType, teeTime, teeOffDate, carrySetId, numberOfRounds, accessories, partyPhone, golfCourseName, specialRequest, } = userInputs;
            try {
                const booking = yield this.repository.createBooking({
                    // customerId,
                    partyName,
                    partyEmail,
                    roundType,
                    teeTime,
                    teeOffDate,
                    carrySetId,
                    numberOfRounds,
                    accessories,
                    partyPhone,
                    specialRequest,
                    golfCourseName,
                });
                const emailData = {
                    bookingId: booking.booking.id,
                    partyName,
                    golfCourseName,
                    teeOffDate,
                    golfPrice: Number(booking.breakdown.golfPrice),
                    accessoriesTotal: booking.breakdown.accessoriesTotal,
                    totalPrice: booking.totalPrice,
                };
                // Send both emails without blocking/failing the booking response
                this.sendBookingEmails(partyEmail, emailData);
                return (0, validation_1.FormateData)({
                    status: 200,
                    data: booking,
                    message: "successfully created booking",
                });
            }
            catch (error) {
                console.error("Error in createBooking:", error);
                return (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    sendBookingEmails(partyEmail, emailData) {
        const adminEmail = process.env.ADMIN_EMAIL;
        if (!adminEmail) {
            console.warn("ADMIN_EMAIL is not set — skipping admin notification email");
        }
        Promise.all([
            (0, mailer_1.sendMail)(partyEmail, `Booking #${emailData.bookingId} received — pending confirmation`, (0, booking_email_templates_1.buildCustomerEmail)(emailData)),
            adminEmail
                ? (0, mailer_1.sendMail)(adminEmail, `New booking #${emailData.bookingId} awaiting confirmation`, (0, booking_email_templates_1.buildAdminEmail)(emailData))
                : Promise.resolve(),
        ]).catch((mailErr) => {
            console.error("Failed to send booking emails:", mailErr);
        });
    }
    approveBookingAndOrder(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.approveBookingAndOrder(bookingId);
                return (0, validation_1.FormateData)({
                    status: 200,
                    data: result,
                    message: "Booking and order approved successfully",
                });
            }
            catch (error) {
                return (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    getOrderBooking(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit, status, }) {
            try {
                const { results, total } = yield this.repository.getOrderBooking({
                    page,
                    limit,
                    status,
                });
                return (0, validation_1.FormateData)({
                    status: 200,
                    data: {
                        results, // each item: { booking: {...}, order: {...} | null }
                        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
                    },
                    message: "successfully fetched booking and order data",
                });
            }
            catch (error) {
                return (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
}
exports.default = BookingService;
