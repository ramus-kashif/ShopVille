import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'

// Configuration
cloudinary.config({
  cloud_name: "dfgd5klry",
  api_key: "773887596779598",
  api_secret: "w3DWfCqu4SOguPfBsoUZMPP1lwE", // Click 'View API Keys' above to copy your API secret
});

const uploadImageOnCloudinary = async (filePath,folderName) => { 
    try {
        // uploading the image from server
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folderName,
        });
        // Deleting the image from server
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error("failed to delete image from server", error);
        }
        // console.log(result);
        return {
            secure_url: result.secure_url,
            public_id: result.public_id,
        };
    } catch (error) {
        throw new Error(error);
    }
    
}

const deleteImageFromCloudinary = async (public_id) => {
try {
    const result = await cloudinary.uploader.destroy(public_id);
    return result;
    
} catch (error) {
    throw new Error(error);
}
}

export { uploadImageOnCloudinary, deleteImageFromCloudinary };