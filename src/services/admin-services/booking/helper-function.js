"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBooking = formatBooking;
function formatBooking(b) {
    return {
        id: b.id,
        date: b.date,
        status: b.status,
        party: {
            name: b.partyName,
            email: b.partyEmail,
            phone: b.partyPhone,
        },
        golfCourse: {
            id: b.golfCourse.id,
            name: b.golfCourse.name,
            price: b.golfCourse.price,
        },
        carrySet: {
            id: b.carrySet.id,
            name: b.carrySet.carrysetname,
            available: b.carrySet.availability,
        },
        order: {
            id: b.order.id,
            status: b.order.status,
            totalPrice: b.order.totalPrice,
            createdAt: b.order.createdAt,
            items: b.order.cart.items.map((item) => ({
                id: item.id,
                itemVariantId: item.itemVariantId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
            })),
        },
    };
}
