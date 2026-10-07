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
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../../../generated/prisma");
const app_error_1 = require("../../../custom-error/app-error");
const prisma = new prisma_1.PrismaClient();
class GetCarrysetCaddieRepository {
    getCarrysetCaddie() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allData = yield prisma.carrySet.findMany({
                    include: {
                        caddie: true,
                        urls: true,
                        peopleCategory: true,
                        roundType: true,
                    },
                });
                // flatten urls[] -> single url string (first image, if any)
                return allData.map((_a) => {
                    var _b, _c;
                    var { urls } = _a, rest = __rest(_a, ["urls"]);
                    return (Object.assign(Object.assign({}, rest), { url: (_c = (_b = urls[0]) === null || _b === void 0 ? void 0 : _b.url) !== null && _c !== void 0 ? _c : null }));
                });
            }
            catch (error) {
                throw new app_error_1.APIError(String(error), app_error_1.STATUS_CODES.INTERNAL_ERROR, "Didnt get any data");
            }
        });
    }
}
exports.default = GetCarrysetCaddieRepository;
