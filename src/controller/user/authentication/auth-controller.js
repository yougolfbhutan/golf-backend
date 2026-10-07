"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authcontroller = void 0;
const response_handler_1 = require("../../../utils/response-handler/response-handler");
const validation_1 = require("../../../utils/validation/validation");
const customer_service_1 = __importDefault(require("../../../services/customer-services/authentication/customer-service"));
const arctic = __importStar(require("arctic"));
const google_1 = require("../../../utils/oauth/google");
const token_1 = require("../../../utils/token/token");
class Authcontroller {
    constructor() {
        this.service = new customer_service_1.default();
        this.createUser = this.createUser.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.createLogin = this.createLogin.bind(this);
        // this.logout = this.logout.bind(this);
        this.googleLogin = this.googleLogin.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
    }
    createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let salt = yield (0, validation_1.GenerateSalt)();
                const { customer_name, email, password, phone_number } = req.body;
                console.log("the details from user inputs la ", customer_name, email, password);
                const { data } = yield this.service.SignUp({
                    customer_name,
                    email,
                    password,
                    phone_number,
                    salt,
                });
                if (data) {
                    return res.json(data);
                }
                else {
                    console.log("hello");
                }
            }
            catch (error) {
                // console.error("Error Unique error:", error);
                console.log("Error from backend ", error === null || error === void 0 ? void 0 : error.message);
                const statusCode = (error === null || error === void 0 ? void 0 : error.statusCode) || 500;
                const message = (error === null || error === void 0 ? void 0 : error.message) || "An unexpected error occurred";
                console.log("message error", message);
                return res.status(statusCode).json({
                    success: false,
                    error: message,
                });
                // return ApiResponse.error(res, message, statusCode);
            }
        });
    }
    createLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield this.service.SignIn({ email, password });
                if (!result) {
                    return response_handler_1.ApiResponse.error(res, "Invalid login credentials", 401);
                }
                const { data } = result;
                const { accessToken, refreshToken } = data;
                res.cookie("accessToken", accessToken, token_1.ACCESS_COOKIE_OPTIONS);
                res.cookie("refreshToken", refreshToken, token_1.REFRESH_COOKIE_OPTIONS);
                // strip refreshToken before sending JSON — cookie only, never in body
                const { refreshToken: _omit } = data, safeData = __rest(data, ["refreshToken"]);
                return response_handler_1.ApiResponse.success(res, "Successfully logged in", 200, safeData);
            }
            catch (error) {
                console.log(error, "Sign in Error ");
                return response_handler_1.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rawRefreshToken = req.cookies.refreshToken;
                const result = yield this.service.RefreshAccessToken(rawRefreshToken);
                const { data } = result;
                const { accessToken, refreshToken } = data;
                res.cookie("accessToken", accessToken, token_1.ACCESS_COOKIE_OPTIONS);
                res.cookie("refreshToken", refreshToken, token_1.REFRESH_COOKIE_OPTIONS);
                return response_handler_1.ApiResponse.success(res, "Token refreshed", 200, { accessToken });
            }
            catch (error) {
                console.log(error, "Refresh Error ");
                return response_handler_1.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 401);
            }
        });
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
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const result = yield this.service.forgotPassword({
                    email,
                });
                if (result.success) {
                    return res.status(200).json(result);
                }
                else {
                    return res.status(401).json(result);
                }
            }
            catch (error) {
                return response_handler_1.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    //reset password
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, password } = req.body;
                const result = yield this.service.resetPassword({
                    token,
                    password,
                });
                return response_handler_1.ApiResponse.success(res, result.message, 200);
            }
            catch (error) {
                console.log(error, "Govinda you have error");
                return response_handler_1.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
    //Google login
    googleLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const state = arctic.generateState();
                const codeVerifier = arctic.generateCodeVerifier();
                const url = yield google_1.google.createAuthorizationURL(state, codeVerifier, [
                    "openid",
                    "profile",
                    "email",
                ]);
                const cookieConfig = {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax", // ✅ now matches "lax"
                };
                res.cookie("google_oauth_state", state, cookieConfig);
                res.cookie("google_code_verifier", codeVerifier, cookieConfig);
                res.redirect(url.toString());
            }
            catch (error) {
                console.error("Error in googleLogin:", error);
                return response_handler_1.ApiResponse.error(res, error.message || "An unexpected error occurred", 500);
            }
        });
    }
}
exports.Authcontroller = Authcontroller;
