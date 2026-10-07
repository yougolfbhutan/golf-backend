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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser")); // Import cookie-parser
const admin_router_1 = __importDefault(require("./router/protected-router/admin-router"));
const user_router_1 = __importDefault(require("./router/common-router/user-router"));
const configureExpressApp = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.use((0, cors_1.default)({ origin: 'http://localhost:3000', credentials: true }));
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.urlencoded({ extended: true }));
    //api
    app.use("/", user_router_1.default);
    //adminapi
    app.use("/admin", admin_router_1.default);
});
exports.default = configureExpressApp;
