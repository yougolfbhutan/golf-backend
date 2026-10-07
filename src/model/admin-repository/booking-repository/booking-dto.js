"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingWithRelationsArgs = void 0;
const client_1 = require("../../../../generated/prisma/client");
exports.bookingWithRelationsArgs = client_1.Prisma.validator()({
    select: {
        id: true,
        date: true,
        status: true,
        customerId: true,
        partyName: true,
        partyEmail: true,
        partyPhone: true,
        golfCourseId: true,
        carrySetId: true,
        orderId: true,
        carrySet: {
            select: {
                id: true,
                carrysetname: true,
                availability: true,
                caddieId: true,
                peopleCategoryId: true,
                roundTypeId: true,
                urls: { select: { url: true } },
            },
        },
        golfCourse: {
            select: { id: true, name: true, price: true },
        },
        order: {
            select: {
                id: true,
                status: true,
                totalPrice: true,
                createdAt: true,
                customerId: true,
                cartId: true,
                cart: {
                    select: {
                        items: {
                            select: {
                                id: true,
                                unitPrice: true,
                                quantity: true,
                                itemVariant: {
                                    select: {
                                        id: true,
                                        sku: true,
                                        color: true,
                                        size: true,
                                        price: true,
                                        item: {
                                            select: {
                                                name: true,
                                                category: { select: { name: true } },
                                            },
                                        },
                                        urls: {
                                            select: { url: true },
                                            orderBy: { sortOrder: "asc" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
});
