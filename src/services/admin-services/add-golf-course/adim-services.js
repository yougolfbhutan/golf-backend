"use strict";
// import { GolfCourseAttributes } from "../../../interface/admin/upload-golf-course/admin-interface";
// import Adminepository from "../../../model/admin-repository/admin-repository";
// import uploadGolfCourseSchema from "../../../utils/Validator/admin/upload-golf-course-validator";
// import AdminServiceImportantFiles from "./admin-services-constants";
// class AdminService {
//   repository: Adminepository;
//   constructor() {
//     this.repository = AdminServiceImportantFiles.Adminepository;
//   }
//   async ResgisterGolfCourse(userUploadDetails: GolfCourseAttributes) {
//       await uploadGolfCourseSchema.validate(userUploadDetails)
//     const {
//       golf_course_name,
//       golf_course_location_name,
//       golf_course_location_description,
//     } = userUploadDetails;
//     try {
//       const existingCustomer = await this.repository.createGolfCourse({
//         golf_course_name,
//         golf_course_location_name,
//         golf_course_location_description,
//       });
//       return AdminServiceImportantFiles.FormateData({existingCustomer})
//     } catch (error) {
//       throw new AdminServiceImportantFiles.APIError("Data Not found");
//     }
//   }
// }
// export default AdminService;
