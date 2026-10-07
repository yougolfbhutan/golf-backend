import {
  $Enums,
  Prisma,
  PrismaClient,
  // providerEnum,
} from "../../../../generated/prisma";
import { APIError, STATUS_CODES } from "../../../custom-error/app-error";
import {
  createUserWithOauthAttributes,
  linkUserWithOauthAttributes,
} from "../../../interface/signin/signin-interface";
import { DatabaseRegisterSttributes } from "../../../interface/SignUp/signup-interface";
// Customer
const prisma = new PrismaClient();

class CaddieRepository {
  async createCaddie(
    input: DatabaseRegisterSttributes
  ): Promise<any | string> {
    console.log("inputs from user",input)
    let user = await prisma.customer.findUnique({
      where: {
        email: input.email,
      },
    });
    if (user) {
      throw new APIError(
        "User Already Exists",
        STATUS_CODES.BAD_REQUEST,
        "Duplicate Email"
      );
    }
    try {
      const customer = await prisma.customer.create({
        data: input,
      });
      return customer;
    } catch (err) {
      console.log(err)
      throw new APIError(
        String(err),
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Customer"
      );
    }
  }

  async FindCustomer({ email }: { email?: string }) {
    try {
      const existingCustomer = await prisma.customer.findFirst({
        where: { email }, // This is the correct way to pass the condition
      });
      return existingCustomer;
    } catch (err) {
      console.error("Error creating customer:", err); // Log the real error

      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Customer"
      );
    }
  }
   async updateUserPassword({ id, hashedPassword,salt }: { id: number; hashedPassword: string; salt:string}) {
    try {
      const UpdateCustomerPassword = await prisma.customer.update({
        where: { id },
        data:{password:hashedPassword,
          salt:salt
        } // This is the correct way to pass the condition
      });
      return UpdateCustomerPassword;
    } catch (err) {
      console.error("Error creating customer:", err); // Log the real error

      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Customer"
      );
    }
  }
  // async linkUserwithOuath(userData: linkUserWithOauthAttributes) {
  //   try {
  //     const user = await prisma.oauthAccountsTable.create({
  //       data: {
  //         userId: userData.userId,
  //         provider: userData.provider as providerEnum,
  //         providerAccountId: userData.providerAccountId,
  //       },
  //     });

  //     return user;
  //   } catch (err) {
  //     console.error("Error creating customer:", err); // Log the real error

  //     throw new APIError(
  //       "API Error",
  //       STATUS_CODES.INTERNAL_ERROR,
  //       "Unable to Find Customer"
  //     );
  //   }
  // }
  // async insertOauthDetails({
  //   provider,
  //   email,
  // }: {
  //   provider?: string;
  //   email: string;
  // }) {
  //   try {
  //     const user = await prisma.customer.findFirst({
  //       where: { email },
  //       include: {
  //         oauthAccount: {
  //           where: {
  //             provider: providerEnum.google, // Use the enum value
  //           },
  //           select: {
  //             providerAccountId: true,
  //             provider: true,
  //           },
  //         },
  //       },
  //     });

  //     return user;
  //   } catch (err) {
  //     console.error("Error creating customer:", err); // Log the real error

  //     throw new APIError(
  //       "API Error",
  //       STATUS_CODES.INTERNAL_ERROR,
  //       "Unable to Find Customer"
  //     );
  //   }
  // }
  // async loginGoogleAuths(userDatas: createUserWithOauthAttributes) {
  //   try {
  //     const user = await prisma.customer.create({
  //       data: {
  //         customer_name: userDatas.name,
  //         email: userDatas.email,
  //         // isEmailValid: true,
  //         oauthAccount: {
  //           // 👈 relation field name in your schema
  //           create: {
  //             provider: providerEnum.google,
  //             providerAccountId: userDatas.providerAccountId,
  //           },
  //         },
  //       },
  //       include: {
  //         oauthAccount: true, // return oauth info as well
  //       },
  //     });

  //     return user;
  //   } catch (err) {
  //     console.error("Error creating customer:", err); // Log the real error

  //     throw new APIError(
  //       "API Error",
  //       STATUS_CODES.INTERNAL_ERROR,
  //       "Unable to Find Customer"
  //     );
  //   }
  // }
}

export default CaddieRepository;
