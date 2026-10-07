import dotenv from "dotenv";
import multer, { Multer } from "multer";
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";
import sharp from "sharp";
import { Request, Response, NextFunction } from "express";
import schema from "../Validator/admin/file-upload";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

interface CloudinaryFile extends Express.Multer.File {
  buffer: Buffer;
}

const storage = multer.memoryStorage();
export const upload: Multer = multer({ storage: storage });

export const uploadToCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const files: CloudinaryFile[] = (req.files as CloudinaryFile[]) || [];

    // No new files sent (e.g. user is only editing other fields) — skip upload
    if (files.length === 0) {
      return next();
    }

    // Only validate/upload when files are actually present
    await schema.validate({ files: files.map((file) => file.originalname) });

    const cloudinaryUrls: string[] = [];

    for (const file of files) {
      const resizedBuffer: Buffer = await sharp(file.buffer)
        .resize({ width: 800, height: 600 })
        .toBuffer();

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "image",
        } as any,
        (
          err: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          if (err) {
            console.error("Cloudinary upload error:", err);
            return next(err);
          }
          if (!result) {
            return next(new Error("Cloudinary upload result is undefined"));
          }
          cloudinaryUrls.push(result.secure_url);

          if (cloudinaryUrls.length === files.length) {
            req.body.cloudinaryUrls = cloudinaryUrls;
            next();
          }
        }
      );
      uploadStream.end(resizedBuffer);
    }
  } catch (error: unknown) {
    console.error("uploadToCloudinary error:", error);
    return res.status(400).json({
      status: "fail",
      message: "Image upload failed",
    });
  }
};