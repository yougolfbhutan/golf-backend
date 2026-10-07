import { BookingController } from "../../controller/admin/booking-controller/booking.controller";
import { Authcontroller } from "../../controller/user/authentication/auth-controller";
import { ExtractItemController } from "../../controller/user/extract-items/extract-items.controller";
import { GetCarrysetCaddieController } from "../../controller/user/get-carryset-caddie/get-carryset-caddie.controller";
// import { GolfCourseBooking } from "../../controller/user/booking/golf-course-booking/golfcourse-booking";
// import { GetCarrysetController } from "../../controller/user/extract-carryset/extract-carryset";
// import { GetGolfCourseController } from "../../controller/user/extract-golfcourse/extract-golfcourse";

// export const golfCourseBooking = new GolfCourseBooking()


export const bookingController = new BookingController();

export const authController = new Authcontroller();
export const getCarrysetCaddieController = new GetCarrysetCaddieController()
export const extractItemController = new ExtractItemController()
// export const getGolfCourseController= new GetGolfCourseController()

// export const getCarrysetController = new GetCarrysetController()