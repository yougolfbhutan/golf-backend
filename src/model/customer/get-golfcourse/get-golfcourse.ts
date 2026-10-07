// import { PrismaClient,Golf_Course } from "../../../../generated/prisma";
// import { APIError, STATUS_CODES } from "../../../custom-error/app-error";
// import { BookingCreatedResponseAttributes } from "../../../interface/booking/extract-booking";

// const prisma = new PrismaClient();

// class GetGolfCourseRepository {
//   async getGolfCourse(): Promise<Golf_Course[]> {
    
//     try {
//       const allData = await prisma.golf_Course.findMany({
//         where:{}
//       })

//       return allData

      
      
//     } catch (error) {
//       throw new APIError(
//         String(error),
//         STATUS_CODES.INTERNAL_ERROR,
//         "Didnt get any data"
//       );
//     }
//   }

 
// }

// export default GetGolfCourseRepository;
