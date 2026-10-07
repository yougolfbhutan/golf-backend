"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const error_handler_1 = require("./error-handler");
const errorHandler = (error) => {
    var _a, _b, _c, _d;
    const status = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || error.status || error.statusCode || 500;
    const errorMessage = ((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || ((_d = error.data) === null || _d === void 0 ? void 0 : _d.message) || error.message || "An unexpected error occurred";
    switch (status) {
        case 500:
            throw new error_handler_1.DatabaseError(errorMessage);
        case 404:
            throw new error_handler_1.NotFoundError(errorMessage);
        case 401:
            throw new error_handler_1.UnauthorizedError(errorMessage);
        case 400:
            throw new error_handler_1.ValidationError(errorMessage);
        case 403:
            throw new error_handler_1.ForbiddenError(errorMessage);
        default:
            throw new Error(`Unhandled error: ${errorMessage}`);
    }
};
exports.errorHandler = errorHandler;
