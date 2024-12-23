import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";



const uploadOnCloudinary = async (filePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
  try {
    if (!filePath) {
        throw new ApiError(400, "File path is required");
      }
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    return response;
  } catch (error) {
    throw new ApiError(
      500,
      `Error while uploading file to Cloudinary: ${error.message || "Unknown error"}`
    );
  } finally {
    
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (unlinkError) {
        console.error(`Failed to delete file: ${unlinkError.message}`);
      }
    }
  }
};

export { uploadOnCloudinary };
