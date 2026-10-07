"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResetPasswordToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Reset_Password_key = process.env.RESET_PASSWORD_TOKEN;
const generateResetPasswordToken = (id, email) => {
    return jsonwebtoken_1.default.sign({
        id,
        email
    }, Reset_Password_key, { expiresIn: "10m" });
};
exports.generateResetPasswordToken = generateResetPasswordToken;
