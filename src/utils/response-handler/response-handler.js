"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static success(res, message, statusCode, data) {
        return res.status(statusCode).json({
            status: statusCode,
            message,
            data,
        });
    }
    static error(res, message, statusCode) {
        return res.status(statusCode).json({
            status: statusCode,
            message: message,
        });
    }
}
exports.ApiResponse = ApiResponse;
