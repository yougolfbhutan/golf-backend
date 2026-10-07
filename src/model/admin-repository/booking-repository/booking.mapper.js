"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBookingOrderItemDTO = toBookingOrderItemDTO;
exports.toBookingListItemDTO = toBookingListItemDTO;
function toMoneyString(value) {
    // Prisma Decimal has toString(); guard for plain numbers/strings too.
    return typeof value === "object" && value !== null && "toString" in value
        ? value.toString()
        : String(value);
}
function toBookingOrderItemDTO(cartItem) {
    var _a, _b;
    const variant = cartItem.itemVariant;
    const unitPrice = toMoneyString(cartItem.unitPrice);
    const subtotal = (Number(unitPrice) * cartItem.quantity).toFixed(2);
    return {
        sku: variant.sku,
        name: variant.item.name,
        category: variant.item.category.name,
        color: variant.color,
        size: variant.size,
        quantity: cartItem.quantity,
        unitPrice,
        subtotal,
        image: (_b = (_a = variant.urls[0]) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : null,
    };
}
function toBookingListItemDTO(b) {
    var _a, _b;
    return {
        id: b.id,
        date: b.date,
        status: b.status,
        party: {
            name: b.partyName,
            email: b.partyEmail,
            phone: b.partyPhone,
        },
        golfCourse: b.golfCourse
            ? {
                id: b.golfCourse.id,
                name: b.golfCourse.name,
                price: toMoneyString(b.golfCourse.price),
            }
            : null,
        carrySet: b.carrySet
            ? {
                id: b.carrySet.id,
                name: b.carrySet.carrysetname,
                available: b.carrySet.availability,
                caddieId: b.carrySet.caddieId,
                peopleCategoryId: b.carrySet.peopleCategoryId,
                roundTypeId: b.carrySet.roundTypeId,
                images: b.carrySet.urls.map((u) => u.url),
            }
            : null,
        order: b.order
            ? {
                id: b.order.id,
                status: b.order.status,
                totalPrice: toMoneyString(b.order.totalPrice),
                createdAt: b.order.createdAt,
                items: ((_b = (_a = b.order.cart) === null || _a === void 0 ? void 0 : _a.items) !== null && _b !== void 0 ? _b : []).map(toBookingOrderItemDTO),
            }
            : null,
    };
}
