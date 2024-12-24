import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";



const uploadOnCloudinary = async (filePath) => {
   
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
