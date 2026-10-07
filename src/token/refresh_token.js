"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Secret_Key = process.env.REFRESH_TOKEN_SECRET;
const generateRefreshToken = (id) => {
    return jsonwebtoken_1.default.sign({
        id,
    }, Secret_Key, { expiresIn: "30m" });
};
exports.generateRefreshToken = generateRefreshToken;
