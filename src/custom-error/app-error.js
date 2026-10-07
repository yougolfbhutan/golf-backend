"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS_CODES = exports.ValidationError = exports.BadRequestError = exports.APIError = exports.AppError = void 0;
const STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UN_AUTHORISED: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
};
exports.STATUS_CODES = STATUS_CODES;
class AppError extends Error {
    constructor(errorAttr) {
        super(errorAttr.description);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = errorAttr.name;
        this.statusCode = errorAttr.statusCode;
        this.isOperational = errorAttr.isOperational;
        this.errorStack = errorAttr.errorStack;
        this.logError = errorAttr.loggingErrorResponse;
        Error.captureStackTrace(this);
    }
}
exports.AppError = AppError;
//api Specific Errors
class APIError extends AppError {
    constructor(name, statusCode = STATUS_CODES.INTERNAL_ERROR, description = "Internal Server Error", isOperational = true) {
        super({ name, statusCode, description, isOperational });
    }
}
exports.APIError = APIError;
//400
class BadRequestError extends AppError {
    constructor(description = "Bad request", logingErrorResponse) {
        super({
            name: "BAD_REQUEST",
            statusCode: STATUS_CODES.BAD_REQUEST,
            description,
            isOperational: true,
            loggingErrorResponse: logingErrorResponse,
        });
    }
}
exports.BadRequestError = BadRequestError;
//400
class ValidationError extends AppError {
    constructor(description = "Validation Error", errorStack) {
        super({
            name: "BAD REQUEST",
            statusCode: STATUS_CODES.BAD_REQUEST,
            description,
            isOperational: true,
            errorStack
        });
    }
}
exports.ValidationError = ValidationError;
