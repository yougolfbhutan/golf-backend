"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERIFY_TOKEN = exports.ACCESS_TOKEN = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_handler_1 = require("../errorHandler/error-handler");
const response_handler_1 = require("../../utils/response-handler/response-handler");
const INACTIVITY_TIMEOUT = 1000000 * 1000;
const ACCESS_TOKEN = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = Object.assign({}, data);
    const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_TOKEN_SECRET, {
        expiresIn: "24h",
    });
    const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_TOKEN_SECRET, {
        expiresIn: "24h",
    });
    return { accessToken, refreshToken };
});
exports.ACCESS_TOKEN = ACCESS_TOKEN;
const VERIFY_TOKEN = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken; // this IS the token, no "Bearer" prefix to strip
        if (!token) {
            throw new error_handler_1.ForbiddenError("Access denied. No token provided");
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_TOKEN_SECRET);
            req.user = decoded;
            return next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return response_handler_1.ApiResponse.error(res, "Access token expired", 401);
            }
            throw new error_handler_1.UnauthorizedError(`${error}`);
        }
    }
    catch (error) {
        return response_handler_1.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 401);
    }
});
exports.VERIFY_TOKEN = VERIFY_TOKEN;
