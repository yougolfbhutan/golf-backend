"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Secret_Key = process.env.ACCESS_TOKEN_SECRET;
const generateAccessToken = ({ id, email, customer_name, roles, permissions, }) => {
    return jsonwebtoken_1.default.sign({
        id,
        email,
        customer_name,
        roles,
        permissions,
    }, Secret_Key, { expiresIn: "12m" });
};
exports.generateAccessToken = generateAccessToken;
