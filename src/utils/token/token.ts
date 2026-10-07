import crypto from "crypto";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET as string;
const REFRESH_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function generateAccessToken(payload: {
  id: number;
  email: string;
  customer_name: string;
  roles: string[];
  permissions: string[];
}) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}

// refresh token is just a random string — NOT a JWT
// because we validate it against the database, not by decoding it
export function generateRawRefreshToken(): string {
  return crypto.randomBytes(40).toString("hex");
}

export function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export function getRefreshExpiry(): Date {
  return new Date(Date.now() + REFRESH_EXPIRES_MS);
}

export { ACCESS_SECRET, REFRESH_EXPIRES_MS };


export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days — matches DB expiry now
};

export const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
  maxAge: 15 * 60 * 1000, // 15 minutes
};