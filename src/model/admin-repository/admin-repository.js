"use strict";
// import { PrismaClient, Golf_Course } from "../../../generated/prisma";
// import { APIError, STATUS_CODES } from "../../custom-error/app-error";
// import { GolfCourseAttributes, GolfCourseResponseAttributes } from "../../interface/admin/upload-golf-course/admin-interface";
// import { FormateData } from "../../utils/validation/validation";
// const prisma = new PrismaClient();
// class Adminepository {
//   async createGolfCourse(
//     input: GolfCourseAttributes
//   ): Promise<GolfCourseResponseAttributes | null> {
//     try {
//       // console.log("hyhyhyhy", input);
//       // const Golf_Course = await prisma.golf_Course.create({
//       //   data: {
//       //     ...input,
//       //      urls: input.urls
//       // ? {
//       //     create: input.urls.map((url: string) => ({ url })),
//       //   }
//       // : undefined,
//       //   },
//       // });
//        const Golf_Course = await prisma.golf_Course.create({
//         data: 
//           input
//      } );
//       return FormateData({Golf_Course})
//     } catch (err) {
//       throw new APIError(
//         "API_ERROR",
//         STATUS_CODES.INTERNAL_ERROR,
//         "Unable to Create Customer",
//         true
//       );
//     }
//   }
// }
// export default Adminepository;
