"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosError = exports.ServiceUnavailable = exports.InternalServerError = exports.ForbiddenError = exports.ValidationError = exports.UnauthorizedError = exports.BadRequestError = exports.NotFoundError = exports.DatabaseError = exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
exports.CustomError = CustomError;
class DatabaseError extends CustomError {
    constructor(message) {
        super(message, 500);
    }
}
exports.DatabaseError = DatabaseError;
class NotFoundError extends CustomError {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends CustomError {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends CustomError {
    constructor(message) {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ValidationError extends CustomError {
    constructor(message) {
        super(message, 400);
    }
}
exports.ValidationError = ValidationError;
class ForbiddenError extends CustomError {
    constructor(message) {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
class InternalServerError extends CustomError {
    constructor(message) {
        super(message, 500);
    }
}
exports.InternalServerError = InternalServerError;
class ServiceUnavailable extends CustomError {
    constructor(message) {
        super(message, 503);
    }
}
exports.ServiceUnavailable = ServiceUnavailable;
class AxiosError extends CustomError {
    constructor(message) {
        super(message, 500);
    }
}
exports.AxiosError = AxiosError;
