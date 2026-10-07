// import { BookingInput } from "../../../../interface/booking/golfcourse-booking";
// import { errorHandler } from "../../../../middleware/errorHandler/common-errror-handler";
// import {
//   FormateData,
// } from "../../../../utils/validation/validation";
// import bookingGolfCourseSchema from "../../../../utils/Validator/customer/booking-golfcourse";
// import  { bookingIdSchema } from "../../../../utils/Validator/customer/cancel-booking";

// class CaddieService {
//   repository: GolfCourseBookingRepository;
//   constructor() {
//     this.repository = new GolfCourseBookingRepository();
//   }
//   async createCaddie(userInputs: BookingInput) {
//     await bookingGolfCourseSchema.validate(userInputs);

//     const {  golfCourseId, carrySetId, date } = userInputs;
//     try {
//       const existingCustomer = await this.repository.createGolfCourseBooking({
        
//         golfCourseId,
//         carrySetId,
//         date,
//       });
//       return FormateData({
//         status: 200,
//         data: existingCustomer,
//         message: "success message",
//       });
//     } catch (error: unknown) {
//       return errorHandler(error);
//     }
//   }
//   async cancelBookingService(bookingId: number) {
//     await bookingIdSchema.validate(bookingId);
//     try {
//       const cancelledBooking = await this.repository.cancelGolfCourseBooking(
//         bookingId
//       );

//       return FormateData({
//         status: 200,
//         data: cancelledBooking,
//         message: "Booking cancelled successfully",
//       });
//     } catch (error: unknown) {
//       return errorHandler(error); // ✅ Return, don't throw
//     }
//   }
// }

// export default CaddieService;
