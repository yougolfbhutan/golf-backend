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
const express_app_1 = __importDefault(require("./express-app"));
const StartServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    // Apply middleware and routes
    (0, express_app_1.default)(app);
    app
        .listen(4000, () => {
        console.log(`🚀 Server is running at http://localhost:${4000}`);
    })
        .on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.error(`❌ Port ${4000} is already in use.`);
        }
        else {
            console.error("❌ Server error:", err);
        }
    });
});
StartServer(); // Start the server
