"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACCESS_COOKIE_OPTIONS = exports.REFRESH_COOKIE_OPTIONS = exports.REFRESH_EXPIRES_MS = exports.ACCESS_SECRET = void 0;
exports.generateAccessToken = generateAccessToken;
exports.generateRawRefreshToken = generateRawRefreshToken;
exports.hashToken = hashToken;
exports.getRefreshExpiry = getRefreshExpiry;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_SECRET = process.env.ACCESS_SECRET;
exports.ACCESS_SECRET = ACCESS_SECRET;
const REFRESH_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
exports.REFRESH_EXPIRES_MS = REFRESH_EXPIRES_MS;
function generateAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}
// refresh token is just a random string — NOT a JWT
// because we validate it against the database, not by decoding it
function generateRawRefreshToken() {
    return crypto_1.default.randomBytes(40).toString("hex");
}
function hashToken(rawToken) {
    return crypto_1.default.createHash("sha256").update(rawToken).digest("hex");
}
function getRefreshExpiry() {
    return new Date(Date.now() + REFRESH_EXPIRES_MS);
}
exports.REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days — matches DB expiry now
};
exports.ACCESS_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
};
