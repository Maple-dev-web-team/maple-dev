import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export async function uploadToCloudinary(
  fileBase64: string,
  folder = "maple-consulting"
) {
  try {
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder,
      resource_type: "auto",
      transformation: [
        { quality: "auto:best" },
        { fetch_format: "auto" }
      ]
    });
    return {
      success: true,
      secure_url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Cloudinary upload error:", err);
    return {
      success: false,
      error: err.message || "Failed to upload image",
    };
  }
}

export async function deleteFromCloudinary(publicId: string) {
  try {
    if (!publicId) return { success: false, error: "No public_id provided" };
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: true, result };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Cloudinary delete error:", err);
    return { success: false, error: err.message };
  }
}

export function generateUploadSignature(folder = "maple-consulting") {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  if (!apiSecret) {
    throw new Error("Missing CLOUDINARY_API_SECRET");
  }

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    apiSecret
  );

  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder,
  };
}
