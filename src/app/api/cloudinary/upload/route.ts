import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "maple-consulting";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Security & Quota Guard: Max 10MB per file
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 10MB limit. Please compress image before uploading." },
        { status: 400 }
      );
    }

    // Security Guard: Whitelist image MIME types and file extensions (handles WhatsApp octet-stream downloads)
    const ALLOWED_MIME_TYPES = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
      "image/avif",
    ];
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
    const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "svg", "gif", "avif"];

    const isValidMime = file.type && ALLOWED_MIME_TYPES.includes(file.type);
    const isValidExt = ALLOWED_EXTENSIONS.includes(fileExt);

    if (!isValidMime && !isValidExt) {
      return NextResponse.json(
        { error: "Invalid file format. Only JPEG, PNG, WebP, SVG, and GIF images are allowed." },
        { status: 400 }
      );
    }

    // Determine normalized MIME type
    let mimeType = file.type;
    if (!mimeType || mimeType === "application/octet-stream" || !ALLOWED_MIME_TYPES.includes(mimeType)) {
      if (fileExt === "jpg" || fileExt === "jpeg") mimeType = "image/jpeg";
      else if (fileExt === "png") mimeType = "image/png";
      else if (fileExt === "webp") mimeType = "image/webp";
      else if (fileExt === "gif") mimeType = "image/gif";
      else if (fileExt === "svg") mimeType = "image/svg+xml";
      else mimeType = "image/jpeg";
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = `data:${mimeType};base64,${buffer.toString("base64")}`;

    const result = await uploadToCloudinary(base64Data, folder);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      url: result.secure_url,
      secure_url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Upload route error:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
