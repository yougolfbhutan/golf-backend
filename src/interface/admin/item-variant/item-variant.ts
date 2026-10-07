import { Prisma, Tier, Audience, Handedness } from "../../../../generated/prisma";

export interface ItemVariantAttributes {
  itemId: number | string;
  tier?: Tier | null;
  audience?: Audience | null;
  color?: string | null;
  size?: string | null;
  hand?: Handedness | null;
  packQuantity?: number | string;
  price: number | string;
  stockQty?: number | string;
  availability?: boolean | string;
  attributes?: Prisma.InputJsonValue;
  urls?: string[];
}

export type ItemVariantUpdateAttributes = Partial<
  Omit<ItemVariantAttributes, "itemId">
>;
export interface ItemVariantUpdateBySkuAttributes {
  color?: string;
  size?: string;
  packQuantity?: number;
  price?: number;
  stockQty?: number;     // increments existing stock
  availability?: string | boolean;
  attributes?: Record<string, any>;
  urls?: string[];
}