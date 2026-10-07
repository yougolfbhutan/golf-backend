import { number } from "yup";
import { Prisma } from "../../../../generated/prisma/client";

export const bookingWithRelationsArgs = Prisma.validator<Prisma.BookingDefaultArgs>()({
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

export type BookingWithRelations = Prisma.BookingGetPayload<typeof bookingWithRelationsArgs>;

// Narrow, explicit alias for a single cart item in the payload above —
// easier to read than deriving it via nested conditional types.
type BookingCart = NonNullable<NonNullable<BookingWithRelations["order"]>["cart"]>;
export type CartItemWithVariant = BookingCart["items"][number];

// ---- Clean output DTO ----
export interface BookingListItemDTO {
  id: number;
  date: Date;
  status: string;
  party: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  golfCourse: {
    id: number;
    name: string;
    price: string;
  } | null;
  carrySet: {
    id: number;
    name: string;
    available: boolean;
    caddieId: number;
    peopleCategoryId: number;
    roundTypeId: number;
    images: string[];
  } | null;
  order: {
    id: number;
    status: string;
    totalPrice: string;
    createdAt: Date;
    items: BookingOrderItemDTO[];
  } | null;
}

export interface BookingOrderItemDTO {
  sku: string;
  name: string;
  category: string;
  color: string | null;
  size: string | null;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  image: string | null;
}

export interface PaginatedBookingsDTO {
  results: BookingListItemDTO[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}