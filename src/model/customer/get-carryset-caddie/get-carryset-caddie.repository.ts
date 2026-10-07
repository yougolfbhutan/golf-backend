import { Prisma, PrismaClient, Tier, Audience, Handedness } from "../../../../generated/prisma";
import { APIError, STATUS_CODES } from "../../../custom-error/app-error";

const prisma = new PrismaClient();

const golfSetSelect = {
  id: true,
  name: true,
  description: true,
  tier: true,
  handedness: true,
  audience: true,
  price: true,
  urls: { select: { url: true }, take: 1 }, // GolfSetUrl has no sortOrder
} satisfies Prisma.GolfSetSelect;

export type GolfSetFilters = {
  tier?: Tier;
  audience?: Audience;
  handedness?: Handedness;
};

export type GolfSetResponse = {
  id: number;
  name: string;
  description: string | null;
  tier: Tier;
  handedness: Handedness;
  audience: Audience;
  price: number;
  url: string | null;
};

class GetCarrysetCaddieRepository {
  async getGolfSets(filters: GolfSetFilters = {}): Promise<GolfSetResponse[]> {
    try {
      const rows = await prisma.golfSet.findMany({
        where: { availability: true, ...filters },
        select: golfSetSelect,
        orderBy: [{ tier: "asc" }, { price: "asc" }],
      });

      return rows.map(({ urls, price, ...rest }) => ({
        ...rest,
        price: price.toNumber(),
        url: urls[0]?.url ?? null,
      }));
    } catch (error) {
      console.error("getGolfSets error:", error);
      throw new APIError(
        "API_ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Failed to load golf sets",
        true,
      );
    }
  }
}

export default GetCarrysetCaddieRepository;