import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../utils/response-handler/response-handler";
import { APIError, STATUS_CODES } from "../../../custom-error/app-error";
import { Tier, Audience, Handedness } from "../../../../generated/prisma";
import GetCarrysetCaddieService from "../../../services/customer-services/get-carryset-caddie/get-carryset-caddie.service";

// Returns undefined when the param is absent, throws a 400 when it's invalid
const parseEnum = <T extends string>(
  value: unknown,
  allowed: readonly T[],
  name: string,
): T | undefined => {
  if (value === undefined || value === "") return undefined;
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new APIError(
      "API_ERROR",
      STATUS_CODES.BAD_REQUEST,
      `Invalid ${name}. Allowed: ${allowed.join(", ")}`,
      true,
    );
  }
  return value as T;
};

export class GetCarrysetCaddieController {
  public service = new GetCarrysetCaddieService();
  constructor() {
    this.getCarrysetCaddie = this.getCarrysetCaddie.bind(this);
  }

  async getCarrysetCaddie(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const filters = {
        tier: parseEnum(req.query.tier, Object.values(Tier), "tier"),
        audience: parseEnum(req.query.audience, Object.values(Audience), "audience"),
        handedness: parseEnum(req.query.handedness, Object.values(Handedness), "handedness"),
      };

      // Drop undefined keys so Prisma doesn't see them in `where`
      const clean = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined),
      );

      const { data } = await this.service.getGolfSets(clean);
      return ApiResponse.success(res, "Golf sets retrieved successfully", 200, data);
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error?.message ?? "An unexpected error occurred",
        error?.statusCode || 500,
      );
    }
  }
}