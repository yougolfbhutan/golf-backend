import { APIError, STATUS_CODES } from "../../custom-error/app-error";

type Fields = {
  tier?: string | null;
  audience?: string | null;
  color?: string | null;
  size?: string | null;
  hand?: string | null;
};

// Keys are lowercase ItemCategory names. Adjust to match your data.
const RULES: Record<string, { required: (keyof Fields)[]; forbidden: (keyof Fields)[] }> = {
  balls:      { required: ["tier"],                       forbidden: ["audience", "color", "size", "hand"] },
  gloves:     { required: ["audience", "size", "hand"],   forbidden: [] },
  caps:       { required: ["audience", "color"],          forbidden: ["tier", "hand"] },
  pants:      { required: ["audience", "color", "size"],  forbidden: ["tier", "hand"] },
  "t-shirts": { required: ["audience", "color", "size"],  forbidden: ["tier", "hand"] },
};

export function assertVariantRules(categoryName: string, v: Fields) {
  const rule = RULES[categoryName.trim().toLowerCase()];
  if (!rule) return; // unknown category: no rules

  const missing = rule.required.filter((f) => !v[f]);
  if (missing.length) {
    throw new APIError("VALIDATION_ERROR", STATUS_CODES.BAD_REQUEST,
      `${categoryName} requires: ${missing.join(", ")}`, true);
  }
  const notAllowed = rule.forbidden.filter((f) => v[f]);
  if (notAllowed.length) {
    throw new APIError("VALIDATION_ERROR", STATUS_CODES.BAD_REQUEST,
      `${categoryName} must not have: ${notAllowed.join(", ")}`, true);
  }
}

export const buildVariantKey = (v: {
  itemId: number;
  tier: string | null;
  audience: string | null;
  color: string | null;
  size: string | null;
  hand: string | null;
  packQuantity: number;
}) =>
  [
    v.itemId,
    v.tier ?? "",
    v.audience ?? "",
    (v.color ?? "").toLowerCase(),
    (v.size ?? "").toUpperCase(),
    v.hand ?? "",
    v.packQuantity,
  ].join("|");