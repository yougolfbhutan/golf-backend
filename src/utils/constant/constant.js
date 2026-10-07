"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractItemController = exports.getCarrysetCaddieController = exports.authController = exports.bookingController = void 0;
const booking_controller_1 = require("../../controller/admin/booking-controller/booking.controller");
const auth_controller_1 = require("../../controller/user/authentication/auth-controller");
const extract_items_controller_1 = require("../../controller/user/extract-items/extract-items.controller");
const get_carryset_caddie_controller_1 = require("../../controller/user/get-carryset-caddie/get-carryset-caddie.controller");
// import { GolfCourseBooking } from "../../controller/user/booking/golf-course-booking/golfcourse-booking";
// import { GetCarrysetController } from "../../controller/user/extract-carryset/extract-carryset";
// import { GetGolfCourseController } from "../../controller/user/extract-golfcourse/extract-golfcourse";
// export const golfCourseBooking = new GolfCourseBooking()
exports.bookingController = new booking_controller_1.BookingController();
exports.authController = new auth_controller_1.Authcontroller();
exports.getCarrysetCaddieController = new get_carryset_caddie_controller_1.GetCarrysetCaddieController();
exports.extractItemController = new extract_items_controller_1.ExtractItemController();
// export const getGolfCourseController= new GetGolfCourseController()
// export const getCarrysetController = new GetCarrysetController()
