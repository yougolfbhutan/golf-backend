import express from "express";
import {
  authController,
  bookingController,
  extractItemController,
  getCarrysetCaddieController,
  // getCarrysetController,
  // getGolfCourseController,
  // golfCourseBooking,
} from "../../utils/constant/constant";
import ImportantFolder from "../protected-router/api-constant";

const userRouter = express.Router();
//AUTHENTICATION
userRouter.post("/customer/signup", authController.createUser);
userRouter.post("/customer/signin", authController.createLogin);
userRouter.post("/customer/forgot-password", authController.forgotPassword);
userRouter.post("/customer/reset-password", authController.resetPassword);
userRouter.get("/customer/google-login", authController.googleLogin);
userRouter.post("/customer/auth/refreshToken", authController.refreshToken);
// userRouter.post("/customer/logout", authController.logout);

//Booking
userRouter.post(
  "/customer/booking",
  // ImportantFolder.VERIFY_TOKEN,
  bookingController.createBooking,
);
// userRouter.post(
//   "/customer/cancel-booking/:BookingId",
//   ImportantFolder.VERIFY_TOKEN,
//   // ImportantFolder.VERIFY_TOKEN,
//   ImportantFolder.checkPermission("cancel-booking"),
//   bookingController.cancelBooking,
// );

userRouter.get(
  "/customer/get-carryset-caddie",
  // ImportantFolder.VERIFY_TOKEN,
  getCarrysetCaddieController.getCarrysetCaddie
);
//extract Item for the customer 

userRouter.get(
  "/customer/get-item",
  extractItemController.extractItem
);

// //extract all carrySet
// userRouter.get("/customer/get-carryset", getCarrysetController.getCarrySet);
export default userRouter;
