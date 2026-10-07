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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const common_errror_handler_1 = require("../../../middleware/errorHandler/common-errror-handler");
const customer_repository_1 = __importDefault(require("../../../model/customer/customer-repository/customer-repository"));
const acesstoken_1 = require("../../../token/acesstoken");
const reset_password_token_1 = require("../../../token/reset-password-token");
const validation_1 = require("../../../utils/validation/validation");
const login_customer_1 = __importStar(require("../../../utils/Validator/customer/login-customer"));
const regiester_customer_1 = __importDefault(require("../../../utils/Validator/customer/regiester-customer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_error_1 = require("../../../custom-error/app-error");
const token_1 = require("../../../utils/token/token");
class CustomerService {
    constructor() {
        this.repository = new customer_repository_1.default();
    }
    SignUp(userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            yield regiester_customer_1.default.validate(userInputs);
            const { customer_name, email, password, phone_number, salt } = userInputs;
            try {
                let userPassword = yield (0, validation_1.GeneratePassword)(password, salt);
                const existingCustomer = yield this.repository.createCustomer({
                    email,
                    password: userPassword,
                    customer_name,
                    phone_number,
                    salt,
                });
                return (0, validation_1.FormateData)({
                    status: 200,
                    data: existingCustomer,
                    message: "success message",
                });
            }
            catch (error) {
                return (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    SignIn(userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            yield login_customer_1.default.validate(userInputs);
            const { email, password } = userInputs;
            try {
                const existingCustomer = yield this.repository.FindCustomer({ email });
                if (!existingCustomer) {
                    throw new app_error_1.APIError("API Error", app_error_1.STATUS_CODES.BAD_REQUEST, "Invalid email or password");
                }
                const validPassword = yield (0, validation_1.ValidatePassword)(password, existingCustomer.password, existingCustomer.salt);
                if (!validPassword) {
                    throw new app_error_1.APIError("API Error", app_error_1.STATUS_CODES.BAD_REQUEST, "Invalid email or password");
                }
                const roles = existingCustomer.roles
                    .map((cr) => { var _a; return (_a = cr.role) === null || _a === void 0 ? void 0 : _a.role_name; })
                    .filter((name) => Boolean(name));
                const permissions = [
                    ...new Set(existingCustomer.roles.flatMap((cr) => { var _a, _b, _c; return (_c = (_b = (_a = cr.role) === null || _a === void 0 ? void 0 : _a.permissions) === null || _b === void 0 ? void 0 : _b.map((rp) => rp.permission.permission_name)) !== null && _c !== void 0 ? _c : []; })),
                ];
                const accessToken = (0, acesstoken_1.generateAccessToken)({
                    id: existingCustomer.id,
                    email: existingCustomer.email,
                    customer_name: existingCustomer.customer_name,
                    roles,
                    permissions,
                });
                // create the refresh token, hash it, save the HASH to the DB
                const rawRefreshToken = (0, token_1.generateRawRefreshToken)();
                yield this.repository.SaveRefreshToken({
                    customerId: existingCustomer.id,
                    tokenHash: (0, token_1.hashToken)(rawRefreshToken),
                    expiresAt: (0, token_1.getRefreshExpiry)(),
                });
                // rawRefreshToken goes to controller ONLY to be set as a cookie —
                // it must never be returned in the JSON body
                return (0, validation_1.FormateData)({ accessToken, refreshToken: rawRefreshToken });
            }
            catch (error) {
                throw (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    RefreshAccessToken(rawRefreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!rawRefreshToken) {
                    throw new app_error_1.APIError("API Error", app_error_1.STATUS_CODES.UN_AUTHORISED, "No refresh token provided");
                }
                const tokenHash = (0, token_1.hashToken)(rawRefreshToken);
                const existing = yield this.repository.FindRefreshToken(tokenHash);
                if (!existing) {
                    throw new app_error_1.APIError("API Error", app_error_1.STATUS_CODES.BAD_REQUEST, "Invalid refresh token");
                }
                if (existing.revokedAt) {
                    throw new app_error_1.APIError("API Error", app_error_1.STATUS_CODES.BAD_REQUEST, "Session revoked, please log in again");
                }
                if (existing.expiresAt < new Date()) {
                    throw new app_error_1.APIError("API Error", app_error_1.STATUS_CODES.BAD_REQUEST, "Session expired, please log in again");
                }
                const customer = existing.customer;
                const roles = customer.roles
                    .map((cr) => { var _a; return (_a = cr.role) === null || _a === void 0 ? void 0 : _a.role_name; })
                    .filter((name) => Boolean(name));
                const permissions = [
                    ...new Set(customer.roles.flatMap((cr) => { var _a, _b, _c; return (_c = (_b = (_a = cr.role) === null || _a === void 0 ? void 0 : _a.permissions) === null || _b === void 0 ? void 0 : _b.map((rp) => rp.permission.permission_name)) !== null && _c !== void 0 ? _c : []; })),
                ];
                // rotate: kill old, create new — same customer
                const newRawRefreshToken = (0, token_1.generateRawRefreshToken)();
                yield this.repository.RevokeRefreshToken(tokenHash);
                yield this.repository.SaveRefreshToken({
                    customerId: customer.id,
                    tokenHash: (0, token_1.hashToken)(newRawRefreshToken),
                    expiresAt: (0, token_1.getRefreshExpiry)(),
                });
                const accessToken = (0, acesstoken_1.generateAccessToken)({
                    id: customer.id,
                    email: customer.email,
                    customer_name: customer.customer_name,
                    roles,
                    permissions,
                });
                return (0, validation_1.FormateData)({ accessToken, refreshToken: newRawRefreshToken });
            }
            catch (error) {
                throw (0, common_errror_handler_1.errorHandler)(error);
            }
        });
    }
    //forgot-password
    forgotPassword(userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            yield login_customer_1.loginGoogleCutomerSchema.validate(userInputs);
            const { email } = userInputs;
            try {
                const existingCustomer = yield this.repository.FindCustomer({ email });
                if (!existingCustomer) {
                    return { success: false, message: "User not found" };
                }
                const resetToken = (0, reset_password_token_1.generateResetPasswordToken)(existingCustomer.id, existingCustomer.email);
                const resetLink = `http://localhost:3000/page/reset-password?token=${encodeURIComponent(resetToken)}`;
                const transporter = nodemailer_1.default.createTransport({
                    service: "gmail", // You can use 'gmail' or any other service, or specify custom SMTP settings
                    auth: {
                        user: "ranaratnay1794@gmail.com", // Your email
                        pass: "agcgclvdadegosqc", // Your email password or app password
                    },
                });
                const mailOptions = {
                    from: `"Rana Golf Bhutan" <ranaratnay1794@gmail.com>`,
                    replyTo: "ranaratnay1794@gmail.com",
                    to: existingCustomer.email,
                    subject: "Rana Golf Bhutan — Reset Your Password",
                    text: `Hello, click the link to reset your password: ${resetLink}`,
                    html: `<p>Hello ${existingCustomer.customer_name},</p>
         <p>Click the link below to reset your password:</p>
         <a href="${resetLink}">Reset Password</a>
         <p>If you didn’t request this, ignore this email.</p>`,
                };
                try {
                    const info = yield transporter.sendMail(mailOptions);
                    console.log("Email sent:", info.response);
                }
                catch (err) {
                    console.error("Error sending email:", err);
                }
                return {
                    success: true,
                    message: "Reset Password email sent successfully",
                    resetLink,
                };
            }
            catch (error) {
                throw (0, common_errror_handler_1.errorHandler)(error); // Consolidated error handling
            }
        });
    }
    //resetpassword
    resetPassword(userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            yield login_customer_1.UpdateCustomerPassword.validate(userInputs);
            const { token, password } = userInputs;
            console.log("Secret key being used:", process.env.RESET_PASSWORD_TOKEN, password, token);
            try {
                if (!token) {
                    throw new Error("Token is required");
                }
                let decoderesetToken;
                try {
                    decoderesetToken = jsonwebtoken_1.default.verify(token, process.env.RESET_PASSWORD_TOKEN);
                }
                catch (jwtError) {
                    console.error("JWT verification error:", jwtError);
                    throw new Error("Invalid or malformed token");
                }
                const { id } = decoderesetToken;
                const salt = yield (0, validation_1.GenerateSalt)();
                const hashedPassword = yield (0, validation_1.GeneratePassword)(password, salt);
                const values = yield this.repository.updateUserPassword({
                    id,
                    hashedPassword,
                    salt,
                });
                if (values) {
                    return {
                        success: true,
                        message: "Password is reset successfully ",
                        values,
                    };
                }
                else {
                    console.log("Cannot get reset password");
                }
            }
            catch (error) {
                console.log("Service", error);
            }
        });
    }
}
exports.default = CustomerService;
