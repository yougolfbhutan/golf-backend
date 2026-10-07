import {
  $Enums,
  Prisma,
  PrismaClient,
  // providerEnum,
} from "../../../../generated/prisma";
import { APIError, STATUS_CODES } from "../../../custom-error/app-error";
import { DatabaseRegisterSttributes } from "../../../interface/SignUp/signup-interface";
// Customer
const prisma = new PrismaClient();

class CustomerRepository {
  async createCustomer(
    input: DatabaseRegisterSttributes,
  ): Promise<any | string> {
    let user = await prisma.customer.findUnique({
      where: {
        email: input.email,
      },
    });
    if (user) {
      throw new APIError(
        "User Already Exists",
        STATUS_CODES.BAD_REQUEST,
        "Duplicate Email",
      );
    }
    try {
      const customer = await prisma.customer.create({
        data: input,
      });
      return customer;
    } catch (err) {
      console.log(err);
      throw new APIError(
        String(err),
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Customer",
      );
    }
  }

  async FindCustomer({ email }: { email: string }) {
    if (!email) {
      throw new APIError(
        "API Error",
        STATUS_CODES.BAD_REQUEST,
        "Email is required",
      );
    }
    try {
      const existingCustomer = await prisma.customer.findFirst({
        where: { email },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: { permission: true },
                  },
                },
              },
            },
          },
        },
      });
      return existingCustomer;
    } catch (err) {
      console.error("Error finding customer:", err);
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find customer",
      );
    }
  }
  async SaveRefreshToken({
  customerId,
  tokenHash,
  expiresAt,
}: {
  customerId: number;
  tokenHash: string;
  expiresAt: Date;
}) {
  try {
    return await prisma.refreshToken.create({
      data: { customerId, tokenHash, expiresAt },
    });
  } catch (err) {
    console.error("Error saving refresh token:", err);
    throw new APIError(
      "API Error",
      STATUS_CODES.INTERNAL_ERROR,
      "Unable to save refresh token",
    );
  }
}

async FindRefreshToken(tokenHash: string) {
  try {
    return await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        customer: {
          include: {
            roles: {
              include: {
                role: {
                  include: {
                    permissions: { include: { permission: true } },
                  },
                },
              },
            },
          },
        },
      },
    });
  } catch (err) {
    console.error("Error finding refresh token:", err);
    throw new APIError(
      "API Error",
      STATUS_CODES.INTERNAL_ERROR,
      "Unable to find refresh token",
    );
  }
}

async RevokeRefreshToken(tokenHash: string) {
  try {
    return await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  } catch (err) {
    console.error("Error revoking refresh token:", err);
    throw new APIError(
      "API Error",
      STATUS_CODES.INTERNAL_ERROR,
      "Unable to revoke refresh token",
    );
  }
}

async RevokeAllRefreshTokens(customerId: number) {
  try {
    return await prisma.refreshToken.updateMany({
      where: { customerId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  } catch (err) {
    console.error("Error revoking all refresh tokens:", err);
    throw new APIError(
      "API Error",
      STATUS_CODES.INTERNAL_ERROR,
      "Unable to revoke sessions",
    );
  }
}
  async updateUserPassword({
    id,
    hashedPassword,
    salt,
  }: {
    id: number;
    hashedPassword: string;
    salt: string;
  }) {
    try {
      const UpdateCustomerPassword = await prisma.customer.update({
        where: { id },
        data: { password: hashedPassword, salt: salt }, // This is the correct way to pass the condition
      });
      return UpdateCustomerPassword;
    } catch (err) {
      console.error("Error creating customer:", err); // Log the real error

      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Customer",
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

export default CustomerRepository;
