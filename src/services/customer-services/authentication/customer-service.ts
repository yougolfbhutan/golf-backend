import {
  forgotPasswordAttributes,
  resetPasswordAttributes,
  SignInAttributes,
} from "../../../interface/signin/signin-interface";
import nodemailer from "nodemailer";
import { DatabaseRegisterSttributes } from "../../../interface/SignUp/signup-interface";
import { errorHandler } from "../../../middleware/errorHandler/common-errror-handler";
import customerRepository from "../../../model/customer/customer-repository/customer-repository";
import { generateAccessToken } from "../../../token/acesstoken";
import { generateRefreshToken } from "../../../token/refresh_token";
import { generateResetPasswordToken } from "../../../token/reset-password-token";
import {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  ValidatePassword,
} from "../../../utils/validation/validation";
import loginCutomerSchema, {
  loginGoogleCutomerSchema,
  UpdateCustomerPassword,
} from "../../../utils/Validator/customer/login-customer";
import registerCutomerSchema from "../../../utils/Validator/customer/regiester-customer";
import jwt from "jsonwebtoken";
import { APIError, STATUS_CODES } from "../../../custom-error/app-error";
import { generateRawRefreshToken, getRefreshExpiry, hashToken } from "../../../utils/token/token";
interface ResetTokenPayload {
  id: number;
  email: string;
  iat: number;
  exp: number;
}

class CustomerService {
  repository: customerRepository;
  constructor() {
    this.repository = new customerRepository();
  }
  async SignUp(userInputs: DatabaseRegisterSttributes) {
    await registerCutomerSchema.validate(userInputs);
    const { customer_name, email, password, phone_number, salt } = userInputs;
    try {
      let userPassword = await GeneratePassword(password, salt);
      const existingCustomer = await this.repository.createCustomer({
        email,
        password: userPassword,
        customer_name,
        phone_number,
        salt,
      });
      return FormateData({
        status: 200,
        data: existingCustomer,
        message: "success message",
      });
    } catch (error: unknown) {
      return errorHandler(error);
    }
  }
async SignIn(userInputs: SignInAttributes) {
  await loginCutomerSchema.validate(userInputs);
  const { email, password } = userInputs;
  try {
    const existingCustomer = await this.repository.FindCustomer({ email });

    if (!existingCustomer) {
      throw new APIError("API Error", STATUS_CODES.BAD_REQUEST, "Invalid email or password");
    }

    const validPassword = await ValidatePassword(
      password,
      existingCustomer.password,
      existingCustomer.salt,
    );

    if (!validPassword) {
      throw new APIError("API Error", STATUS_CODES.BAD_REQUEST, "Invalid email or password");
    }

    const roles = existingCustomer.roles
      .map((cr) => cr.role?.role_name)
      .filter((name): name is string => Boolean(name));

    const permissions = [
      ...new Set(
        existingCustomer.roles.flatMap(
          (cr) => cr.role?.permissions?.map((rp) => rp.permission.permission_name) ?? [],
        ),
      ),
    ];

    const accessToken = generateAccessToken({
      id: existingCustomer.id,
      email: existingCustomer.email,
      customer_name: existingCustomer.customer_name,
      roles,
      permissions,
    });

    // create the refresh token, hash it, save the HASH to the DB
    const rawRefreshToken = generateRawRefreshToken();
    await this.repository.SaveRefreshToken({
      customerId: existingCustomer.id,
      tokenHash: hashToken(rawRefreshToken),
      expiresAt: getRefreshExpiry(),
    });

    // rawRefreshToken goes to controller ONLY to be set as a cookie —
    // it must never be returned in the JSON body
    return FormateData({ accessToken, refreshToken: rawRefreshToken });
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}

async RefreshAccessToken(rawRefreshToken: string) {
  try {
    if (!rawRefreshToken) {
      throw new APIError("API Error", STATUS_CODES.UN_AUTHORISED, "No refresh token provided");
    }

    const tokenHash = hashToken(rawRefreshToken);
    const existing = await this.repository.FindRefreshToken(tokenHash);

    if (!existing) {
      throw new APIError("API Error", STATUS_CODES.BAD_REQUEST, "Invalid refresh token");
    }
    if (existing.revokedAt) {
      throw new APIError("API Error", STATUS_CODES.BAD_REQUEST, "Session revoked, please log in again");
    }
    if (existing.expiresAt < new Date()) {
      throw new APIError("API Error", STATUS_CODES.BAD_REQUEST, "Session expired, please log in again");
    }

    const customer = existing.customer;
    const roles = customer.roles
      .map((cr: any) => cr.role?.role_name)
      .filter((name: string): name is string => Boolean(name));
    const permissions = [
      ...new Set(
        customer.roles.flatMap(
          (cr: any) => cr.role?.permissions?.map((rp: any) => rp.permission.permission_name) ?? [],
        ),
      ),
    ];

    // rotate: kill old, create new — same customer
    const newRawRefreshToken = generateRawRefreshToken();
    await this.repository.RevokeRefreshToken(tokenHash);
    await this.repository.SaveRefreshToken({
      customerId: customer.id,
      tokenHash: hashToken(newRawRefreshToken),
      expiresAt: getRefreshExpiry(),
    });

    const accessToken = generateAccessToken({
      id: customer.id,
      email: customer.email,
      customer_name: customer.customer_name,
      roles,
      permissions,
    });

    return FormateData({ accessToken, refreshToken: newRawRefreshToken });
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}
  //forgot-password
  async forgotPassword(userInputs: forgotPasswordAttributes) {
    await loginGoogleCutomerSchema.validate(userInputs);
    const { email } = userInputs;

    try {
      const existingCustomer = await this.repository.FindCustomer({ email });
      if (!existingCustomer) {
        return { success: false, message: "User not found" };
      }
      const resetToken = generateResetPasswordToken(
        existingCustomer.id,
        existingCustomer.email,
      );
      const resetLink = `http://localhost:3000/page/reset-password?token=${encodeURIComponent(
        resetToken,
      )}`;

      const transporter = nodemailer.createTransport({
        service: "gmail", // You can use 'gmail' or any other service, or specify custom SMTP settings
        auth: {
          user: "ranaratnay1794@gmail.com", // Your email
          pass: "agcgclvdadegosqc", // Your email password or app password
        },
      });
      const mailOptions = {
        from: `"Rana Golf Bhutan" <ranaratnay1794@gmail.com>`,
        replyTo: "ranaratnay1794@gmail.com",
        to: existingCustomer.email,
        subject: "Rana Golf Bhutan — Reset Your Password",
        text: `Hello, click the link to reset your password: ${resetLink}`,
        html: `<p>Hello ${existingCustomer.customer_name},</p>
         <p>Click the link below to reset your password:</p>
         <a href="${resetLink}">Reset Password</a>
         <p>If you didn’t request this, ignore this email.</p>`,
      };
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
      } catch (err) {
        console.error("Error sending email:", err);
      }

      return {
        success: true,
        message: "Reset Password email sent successfully",
        resetLink,
      };
    } catch (error: unknown) {
      throw errorHandler(error); // Consolidated error handling
    }
  }

  //resetpassword
  async resetPassword(userInputs: resetPasswordAttributes) {
    await UpdateCustomerPassword.validate(userInputs);
    const { token, password } = userInputs;
    console.log(
      "Secret key being used:",
      process.env.RESET_PASSWORD_TOKEN,
      password,
      token,
    );

    try {
      if (!token) {
        throw new Error("Token is required");
      }

      let decoderesetToken;
      try {
        decoderesetToken = jwt.verify(
          token,
          process.env.RESET_PASSWORD_TOKEN!,
        ) as ResetTokenPayload;
      } catch (jwtError) {
        console.error("JWT verification error:", jwtError);
        throw new Error("Invalid or malformed token");
      }

      const { id } = decoderesetToken as ResetTokenPayload;
      const salt = await GenerateSalt();

      const hashedPassword = await GeneratePassword(password, salt);
      const values = await this.repository.updateUserPassword({
        id,
        hashedPassword,
        salt,
      });
      if (values) {
        return {
          success: true,
          message: "Password is reset successfully ",
          values,
        };
      } else {
        console.log("Cannot get reset password");
      }
    } catch (error) {
      console.log("Service", error);
    }
  }
  //Google Login

  // async getUserWithOauthId(userInputs: getUserWithOauthIdAttributes) {
  //   await loginGoogleCutomerSchema.validate(userInputs);
  //   const { email, provider } = userInputs;
  //   const user = await this.repository.insertOauthDetails({
  //     provider,
  //     email,
  //   });

  //   return user;
  //   // } catch (error: unknown) {
  //   //   throw errorHandler(error); // Consolidated error handling
  //   // }
  // }
  // async linkUserWithOauth(userInputs: linkUserWithOauthAttributes) {
  //   // await loginGoogleCutomerSchema.validate(userInputs);
  //   const { userId, provider, providerAccountId } = userInputs;
  //   const user = await this.repository.linkUserwithOuath({
  //     userId,
  //     provider,
  //     providerAccountId,
  //   });

  // return user;
  // } catch (error: unknown) {
  //   throw errorHandler(error); // Consolidated error handling
  // }
  // }
  // async createUserWithOauth(userInputs: createUserWithOauthAttributes) {
  //   await loginGoogleCutomerSchema.validate(userInputs);
  //   const user = await this.repository.loginGoogleAuths(userInputs);
  //   return user;
  // }
  // // Logout method
  // async logout(userId?: string): Promise<boolean> {
  //   // Invalidate refresh tokens in database
  //   // Add user to blacklist
  //   // Log the logout event
  //   return true;
  // }
}
export default CustomerService;
