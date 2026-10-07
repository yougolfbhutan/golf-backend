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
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../../../generated/prisma");
const app_error_1 = require("../../../custom-error/app-error");
// Customer
const prisma = new prisma_1.PrismaClient();
class CaddieRepository {
    createCaddie(input) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("inputs from user", input);
            let user = yield prisma.customer.findUnique({
                where: {
                    email: input.email,
                },
            });
            if (user) {
                throw new app_error_1.APIError("User Already Exists", app_error_1.STATUS_CODES.BAD_REQUEST, "Duplicate Email");
            }
            try {
                const customer = yield prisma.customer.create({
                    data: input,
                });
                return customer;
            }
            catch (err) {
                console.log(err);
                throw new app_error_1.APIError(String(err), app_error_1.STATUS_CODES.INTERNAL_ERROR, "Unable to Create Customer");
            }
        });
    }
    FindCustomer(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email }) {
            try {
                const existingCustomer = yield prisma.customer.findFirst({
                    where: { email }, // This is the correct way to pass the condition
                });
                return existingCustomer;
            }
            catch (err) {
                console.error("Error creating customer:", err); // Log the real error
                throw new app_error_1.APIError("API Error", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Unable to Find Customer");
            }
        });
    }
    updateUserPassword(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, hashedPassword, salt }) {
            try {
                const UpdateCustomerPassword = yield prisma.customer.update({
                    where: { id },
                    data: { password: hashedPassword,
                        salt: salt
                    } // This is the correct way to pass the condition
                });
                return UpdateCustomerPassword;
            }
            catch (err) {
                console.error("Error creating customer:", err); // Log the real error
                throw new app_error_1.APIError("API Error", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Unable to Find Customer");
            }
        });
    }
}
exports.default = CaddieRepository;
