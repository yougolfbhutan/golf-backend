// import { errorHandler } from "../../../middleware/errorHandler/common-errror-handler";
// import GetGolfCourseRepository from "../../../model/customer/get-golfcourse/get-golfcourse";
// import { FormateData } from "../../../utils/validation/validation";

// class GetGolfCourseService {
//   repository: GetGolfCourseRepository;
//   constructor() {
//     this.repository = new GetGolfCourseRepository();
//   }
//   async getGolfCourse() {
//     try {
//       const existingCustomer = await this.repository.getGolfCourse();
//       return FormateData({
//         status: 200,
//         data: existingCustomer,
//         message: "success message",
//       });
//     } catch (error: unknown) {
//       return errorHandler(error);
//     }
//   }
// }

// export default GetGolfCourseService;
