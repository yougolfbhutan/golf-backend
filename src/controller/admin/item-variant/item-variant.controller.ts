import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../utils/response-handler/response-handler";
import UploadImportantFiles from "../upload-golf-course/constants";
import ItemVariantService from "../../../services/admin-services/item-variant/item-variant.services";
const blankToNull = (v: any) => (v === "" ? null : v);

const optionalNumber = (v: any) =>
  v === undefined || v === "" ? undefined : Number(v)
// multipart forms send JSON fields as strings
const parseJson = (v: any) => {
  if (typeof v !== "string") return v;
  try {
    return JSON.parse(v);
  } catch {
    throw Object.assign(new Error("attributes must be valid JSON"), { statusCode: 400 });
  }
};
export class ItemVariantController {
  // public service = new UploadImportantFiles.AdminService();
  public service = new ItemVariantService();
  constructor() {
    this.createItemVariant = this.createItemVariant.bind(this);
    this.deleteItemVariant = this.deleteItemVariant.bind(this);
    this.updateItemVariant = this.updateItemVariant.bind(this);
    this.getItemVariant = this.getItemVariant.bind(this);
  }
  async createItemVariant(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
        const {
      itemId, tier, audience, color, size, hand,
      packQuantity, price, stockQty, availability, attributes,
    } = req.body;
    console.log("req.body", req.body);
      const cloudinaryUrls = req.body.cloudinaryUrls;
      if (cloudinaryUrls.length === 0) {
        return UploadImportantFiles.APIError;
        // return res.status(500).send("Internal Server Error");
      }
      let Availability;
      if (availability == "true") {
        Availability = true;
      } else {
        Availability = false;
      }
       const { data } = await this.service.createItemVariant({
      itemId,
      tier: blankToNull(tier),
      audience: blankToNull(audience),
      color: blankToNull(color),
      size: blankToNull(size),
      hand: blankToNull(hand),
      packQuantity,
      price,
      stockQty,
      availability, // the repository converts "true"/true safely
      attributes: parseJson(attributes),
      urls: cloudinaryUrls,
    });

      return ApiResponse.success(res, "Souvenir added successfully", 200, data);
    } catch (error: any) {
      return UploadImportantFiles.ApiResponse.error(
        res,
        error instanceof Error ? error.message : "An unexpected error occurred",
        500,
      );
    }
  }
  async deleteItemVariant(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const ItemVariantId = Number(req.params.id); // ✅ retrieve the ID from the URL
      const { data } =
        await this.service.deleteItemVariantService(ItemVariantId);
      return ApiResponse.success(
        res,
        "Deleted ItemVariant Successfully",
        200,
        data,
      );
    } catch (error: any) {
      return UploadImportantFiles.ApiResponse.error(
        res,
        error instanceof Error ? error.message : "An unexpected error occurred",
        500,
      );
    }
  }

  async updateItemVariant(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return ApiResponse.error(res, "Invalid variant id", 400);
    }

    const {
      tier, audience, color, size, hand,
      packQuantity, price, stockQty, availability, attributes,
    } = req.body;

    const { data } = await this.service.updateItemVariant(id, {
      // option fields (these were missing before)
      tier: blankToNull(tier),
      audience: blankToNull(audience),
      hand: blankToNull(hand),
      color: blankToNull(color),
      size: blankToNull(size),

      // numbers
      packQuantity: optionalNumber(packQuantity),
      price: optionalNumber(price),
      stockQty: optionalNumber(stockQty), // added to the current stock (see note below)

      // others
      availability, // repository turns "true"/true into a boolean
      attributes: attributes === undefined ? undefined : parseJson(attributes),
      urls: req.body.cloudinaryUrls, // only replaced if new images were uploaded
    });

    return ApiResponse.success(res, "Variant updated successfully", 200, data);
  } catch (error: any) {
    return ApiResponse.error(
      res,
      error instanceof Error ? error.message : "An unexpected error occurred",
      error?.statusCode ?? 500,
    );
  }
}
  async getItemVariant(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100); // cap it so nobody requests 1M rows
      const { data } = await this.service.getItemVariantService({
        page,
        limit,
      });
      return ApiResponse.success(
        res,
        "ItemVariant retrieved successfully",
        200,
        data,
      );
    } catch (error: any) {
      return UploadImportantFiles.ApiResponse.error(
        res,
        error instanceof Error ? error.message : "An unexpected error occurred",
        500,
      );
    }
  }
}
