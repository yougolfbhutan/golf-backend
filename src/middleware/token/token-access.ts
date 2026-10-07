import { NextFunction, Request, Response } from "express";
import {
  TokenResponse,
  UserCreationResponse,
} from "../../interface/token/token-interface";

import jwt, { JwtPayload } from "jsonwebtoken";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../errorHandler/error-handler";
import { ApiResponse } from "../../utils/response-handler/response-handler";
interface TokenPayload {
  id: number;
  email: string;
  customer_name: string;
  phone_number: string;
}
const INACTIVITY_TIMEOUT = 1000000 * 1000;
export const ACCESS_TOKEN = async (
  data: TokenPayload,
): Promise<TokenResponse> => {
  const payload = { ...data };

  const accessToken = jwt.sign(payload, process.env.JWT_TOKEN_SECRET!, {
    expiresIn: "24h",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_TOKEN_SECRET!, {
    expiresIn: "24h",
  });
  return { accessToken, refreshToken };
};

export const VERIFY_TOKEN = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const token = req.cookies?.accessToken; // this IS the token, no "Bearer" prefix to strip

    if (!token) {
      throw new ForbiddenError("Access denied. No token provided");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET!);
      (req as any).user = decoded;
      return next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return ApiResponse.error(res, "Access token expired", 401);
      }
      throw new UnauthorizedError(`${error}`);
    }
  } catch (error) {
    return ApiResponse.error(
      res,
      error instanceof Error ? error.message : "An unexpected error occurred",
      401,
    );
  }
};