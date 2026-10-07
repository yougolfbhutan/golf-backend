import { Request, Response, NextFunction, CookieOptions } from "express";
import { ApiResponse } from "../../../utils/response-handler/response-handler";
import { GenerateSalt } from "../../../utils/validation/validation";
import CustomerService from "../../../services/customer-services/authentication/customer-service";
import * as arctic from "arctic";
import { google } from "../../../utils/oauth/google";
import { generateAccessToken } from "../../../token/acesstoken";
import { generateRefreshToken } from "../../../token/refresh_token";
import { ACCESS_COOKIE_OPTIONS, REFRESH_COOKIE_OPTIONS } from "../../../utils/token/token";
interface GoogleClaims {
  sub: string;
  name: string;
  email: string;
  picture?: string;
}
export class Authcontroller {
  public service = new CustomerService();
  constructor() {
    this.createUser = this.createUser.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);

    this.resetPassword = this.resetPassword.bind(this);
    this.createLogin = this.createLogin.bind(this);
    // this.logout = this.logout.bind(this);
    this.googleLogin = this.googleLogin.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
  }
  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      let salt = await GenerateSalt();
      const { customer_name, email, password, phone_number } = req.body;
      console.log(
        "the details from user inputs la ",
        customer_name,
        email,
        password
      );
      const { data } = await this.service.SignUp({
        customer_name,
        email,
        password,
        phone_number,
        salt,
      });
      if (data) {
        return res.json(data);
      } else {
        console.log("hello");
      }
    } catch (error: any) {
      // console.error("Error Unique error:", error);
      console.log("Error from backend ", error?.message);
      const statusCode = error?.statusCode || 500;
      const message = error?.message || "An unexpected error occurred";
      console.log("message error", message);
      return res.status(statusCode).json({
        success: false,
        error: message,
      });
      // return ApiResponse.error(res, message, statusCode);
    }
  }
  async createLogin(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const { email, password } = req.body;
    const result = await this.service.SignIn({ email, password });

    if (!result) {
      return ApiResponse.error(res, "Invalid login credentials", 401);
    }

    const { data } = result;
    const { accessToken, refreshToken } = data;

    res.cookie("accessToken", accessToken, ACCESS_COOKIE_OPTIONS);
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    // strip refreshToken before sending JSON — cookie only, never in body
    const { refreshToken: _omit, ...safeData } = data;

    return ApiResponse.success(res, "Successfully logged in", 200, safeData);
  } catch (error: any) {
    console.log(error, "Sign in Error ");
    return ApiResponse.error(
      res,
      error instanceof Error ? error.message : "An unexpected error occurred",
      500
    );
  }
}

async refreshToken(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const rawRefreshToken = req.cookies.refreshToken;
    const result = await this.service.RefreshAccessToken(rawRefreshToken);

    const { data } = result;
    const { accessToken, refreshToken } = data;

    res.cookie("accessToken", accessToken, ACCESS_COOKIE_OPTIONS);
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    return ApiResponse.success(res, "Token refreshed", 200, { accessToken });
  } catch (error: any) {
    console.log(error, "Refresh Error ");
    return ApiResponse.error(
      res,
      error instanceof Error ? error.message : "An unexpected error occurred",
      401
    );
  }
}

// async logout(req: Request, res: Response, next: NextFunction): Promise<any> {
//   try {
//     const rawRefreshToken = req.cookies.refreshToken;
//     await this.service.Logout(rawRefreshToken);

//     res.clearCookie("accessToken");
//     res.clearCookie("refreshToken");

//     return ApiResponse.success(res, "Logged out successfully", 200, {});
//   } catch (error: any) {
//     return ApiResponse.error(res, "Logout failed", 500);
//   }
// }
  //forgot-password
  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { email } = req.body;

      const result = await this.service.forgotPassword({
        email,
      });

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(401).json(result);
      }
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error instanceof Error ? error.message : "An unexpected error occurred",
        500
      );
    }
  }

  //reset password
  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { token, password } = req.body;

     const result = await this.service.resetPassword({
        token,
        password,
      });
       return ApiResponse.success(res, result!.message, 200);
    } catch (error: any) {
      console.log(error, "Govinda you have error");
      return ApiResponse.error(
        res,
        error instanceof Error ? error.message : "An unexpected error occurred",
        500
      );
    }
  }
  //Google login
  async googleLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const state = arctic.generateState();
      const codeVerifier = arctic.generateCodeVerifier();
      const url = await google.createAuthorizationURL(state, codeVerifier, [
        "openid",
        "profile",
        "email",
      ]);

      const cookieConfig: CookieOptions = {
        httpOnly: true,
        secure: false,
        sameSite: "lax", // ✅ now matches "lax"
      };
      res.cookie("google_oauth_state", state, cookieConfig);
      res.cookie("google_code_verifier", codeVerifier, cookieConfig);

      res.redirect(url.toString());
    } catch (error: any) {
      console.error("Error in googleLogin:", error);
      return ApiResponse.error(
        res,
        error.message || "An unexpected error occurred",
        500
      );
    }
  }
  // async getGoogleLoginCallBack(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<any> {
  //   console.log("google vall back");
  //   const { state, code } = req.query;
  //   console.log("Dilip Rayamajhi", state);
  //   const {
  //     google_oauth_state: storedState,
  //     google_code_verifier: codeVerifier,
  //   } = req.cookies;

  //   if (
  //     !code ||
  //     !state ||
  //     !storedState ||
  //     !codeVerifier ||
  //     state !== storedState
  //   ) {
  //     console.log("Invalid OAuth state or missing parameters:", {
  //       code,
  //       state,
  //       storedState,
  //       codeVerifier,
  //     });
  //     return res
  //       .status(400)
  //       .json({ redirect: "/customer/signin", error: "Invalid OAuth state" });
  //   }

  //   try {
  //     console.log("Validating authorization code...");
  //     const tokens = await google.validateAuthorizationCode(
  //       code as string,
  //       codeVerifier
  //     );
  //     const claims = arctic.decodeIdToken(tokens.idToken()) as GoogleClaims;
  //     const { sub: googleUserId, name, email } = claims;

  //     let user = await this.service.getUserWithOauthId({
  //       provider: "google",
  //       email,
  //     });
  //     //if ghe user exists but the user is not linked with oauth

  //     if (user && !user.oauthAccount?.providerAccountId) {
  //       await this.service.linkUserWithOauth({
  //         userId: user.id,
  //         provider: "google",
  //         providerAccountId: googleUserId,
  //       });
  //     }
  //     if (!user) {
  //       user = await this.service.createUserWithOauth({
  //         name,
  //         email,
  //         provider: "google",
  //         providerAccountId: googleUserId,
  //       });
  //     }
  //     const acesstoken = generateAccessToken({
  //       id: user.id,
  //       email: user.email,
  //       customer_name: user.customer_name,
  //       role: user.roleId,
  //     });
  //     const refreshToken = generateRefreshToken(user.id);
  //     res.cookie("accessToken", acesstoken, {
  //       httpOnly: true, // Ensure the cookie cannot be accessed via JavaScript (security against XSS attacks)
  //       secure: true, // Set to true in production for HTTPS-only cookies
  //       maxAge: 15 * 60 * 1000, // 15 minutes in mileseconds
  //       sameSite: "strict", // Ensures the cookie is sent only with requests from the same site
  //     });
  //     res.cookie("refreshToken", refreshToken, {
  //       httpOnly: true,
  //       secure: true,
  //       maxAge: 24 * 60 * 60 * 1000, // 24 hours is mileseconds
  //       sameSite: "strict",
  //     });
  //     res.redirect("http://localhost:3000"); // Redirect to a success page
  //   } catch (error) {
  //     console.error("Error in getGoogleLoginCallBack:", error);
  //     return res.status(400).json({
  //       redirect: "http://localhost:3000/page/auth/login",
  //       error: "Invalid OAuth state",
  //     });
  //   }
  // }
  // Logout method
  // logout = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<any> => {
  //   try {
  //     // Clear cookies
  //     res.clearCookie("accessToken", {
  //       httpOnly: true,
  //       secure: true,
  //       sameSite: "strict",
  //     });
  //     res.clearCookie("refreshToken", {
  //       httpOnly: true,
  //       secure: true,
  //       sameSite: "strict",
  //     });

  //     const success = await this.service.logout();

  //     if (success) {
  //       return ApiResponse.success(
  //         res,
  //         "User logged out successfully",
  //         200,
  //         {}
  //       );
  //     }

  //     return ApiResponse.error(res, "Failed to log out", 500);
  //   } catch (error: unknown) {
  //     next(error);
  //   }
  // };
}
