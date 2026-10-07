"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_SECRET = exports.DB_URL = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== "prod") {
    const configFile = `./.env.${process.env.NODE_ENV}`;
    dotenv_1.default.config({ path: configFile });
}
else {
    dotenv_1.default.config();
}
exports.PORT = process.env.PORT;
exports.DB_URL = process.env.MONGODB_URI;
exports.APP_SECRET = process.env.APP_SECRET;
