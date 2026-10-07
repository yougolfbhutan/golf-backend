import type { CartItemWithVariant, BookingOrderItemDTO, BookingWithRelations, BookingListItemDTO } from "./booking-dto";


function toMoneyString(value: unknown): string {
  // Prisma Decimal has toString(); guard for plain numbers/strings too.
  return typeof value === "object" && value !== null && "toString" in value
    ? (value as { toString(): string }).toString()
    : String(value);
}

export function toBookingOrderItemDTO(cartItem: CartItemWithVariant): BookingOrderItemDTO {
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
    image: variant.urls[0]?.url ?? null,
  };
}

export function toBookingListItemDTO(b: BookingWithRelations): BookingListItemDTO {
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
          items: (b.order.cart?.items ?? []).map(toBookingOrderItemDTO),
        }
      : null,
  };
}