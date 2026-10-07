import { Response } from "express";
export class ApiResponse {
  static success(
    res: Response,
    message: string,
    statusCode: number,
    data?: object
  ): Response {
    return res.status(statusCode).json({
      status: statusCode,
      message,
      data,
    });
  }

  static error(res: Response, message: string, statusCode: number): Response {
    return res.status(statusCode).json({
      status: statusCode,
      message: message,
    });
  }
}
