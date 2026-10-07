"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constant_1 = require("../../utils/constant/constant");
const userRouter = express_1.default.Router();
//AUTHENTICATION
userRouter.post("/customer/signup", constant_1.authController.createUser);
userRouter.post("/customer/signin", constant_1.authController.createLogin);
userRouter.post("/customer/forgot-password", constant_1.authController.forgotPassword);
userRouter.post("/customer/reset-password", constant_1.authController.resetPassword);
userRouter.get("/customer/google-login", constant_1.authController.googleLogin);
userRouter.post("/customer/auth/refreshToken", constant_1.authController.refreshToken);
// userRouter.post("/customer/logout", authController.logout);
//Booking
userRouter.post("/customer/booking", 
// ImportantFolder.VERIFY_TOKEN,
constant_1.bookingController.createBooking);
// userRouter.post(
//   "/customer/cancel-booking/:BookingId",
//   ImportantFolder.VERIFY_TOKEN,
//   // ImportantFolder.VERIFY_TOKEN,
//   ImportantFolder.checkPermission("cancel-booking"),
//   bookingController.cancelBooking,
// );
userRouter.get("/customer/get-carryset-caddie", 
// ImportantFolder.VERIFY_TOKEN,
constant_1.getCarrysetCaddieController.getCarrysetCaddie);
//extract Item for the customer 
userRouter.get("/customer/get-item", constant_1.extractItemController.extractItem);
// //extract all carrySet
// userRouter.get("/customer/get-carryset", getCarrysetController.getCarrySet);
exports.default = userRouter;
