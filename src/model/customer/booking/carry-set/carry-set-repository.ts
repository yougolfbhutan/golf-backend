// import { CarrySet, PrismaClient } from "../../../../../generated/prisma";
// import { APIError, STATUS_CODES } from "../../../../custom-error/app-error";

// const prisma = new PrismaClient();

// class FetchCarrySetRepository {
//  static async getCarrySet(): Promise<CarrySet[]> {
    
//     try {
//       const allData = await prisma.carrySet.findMany({
//          where:{ availibility:true},
//         select:{
//             id:true,
//             carrysettname:true,
//             availibility:true,
//             urls:{
//                 select:{
//                     url:true
//                 }
//             },
           
//         }
        
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

// export default FetchCarrySetRepository;
