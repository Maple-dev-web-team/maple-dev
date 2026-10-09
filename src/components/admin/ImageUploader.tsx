"use client";

import React, { useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, CheckCircle } from "lucide-react";

interface ImageUploaderProps {
  label: string;
  currentImageUrl?: string | null;
  currentPublicId?: string | null;
  folder?: string;
  onUploadSuccess: (data: { url: string; public_id: string }) => void;
  onRemove?: () => void;
  aspectRatio?: string;
  objectFit?: "cover" | "contain";
  bgDark?: boolean;
}

export function ImageUploader({
  label,
  currentImageUrl,
  currentPublicId,
  folder = "maple-consulting",
  onUploadSuccess,
  onRemove,
  aspectRatio = "aspect-[16/9]",
  objectFit = "cover",
  bgDark = false,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);

  React.useEffect(() => {
    setPreview(currentImageUrl || null);
  }, [currentImageUrl]);

  // Robust client-side optimizer: handles high-res architectural renders (e.g. 5-20MB DSLR/3D renders down to < 1.5MB)
  const prepareImageForUpload = async (file: File): Promise<Blob | File> => {
    // SVGs and GIFs should be uploaded untouched
    if (file.type === "image/svg+xml" || file.type === "image/gif") {
      return file;
    }

    // Use URL.createObjectURL (instant, zero-memory overhead, avoids FileReader memory exhaustion on 5MB+ JPEGs)
    const objectUrl = URL.createObjectURL(file);

    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new window.Image();
        image.onload = () => resolve(image);
        image.onerror = (e) => reject(e);
        image.src = objectUrl;
      });

      const maxDim = 2400; // Razor-sharp 4K maximum dimension (avoids Cloudinary 25MP free tier limits)
      let { width, height } = img;

      // If dimensions are reasonable and file is small, keep original
      if (width <= maxDim && height <= maxDim && file.size <= 2 * 1024 * 1024) {
        URL.revokeObjectURL(objectUrl);
        return file;
      }

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        return file;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);

      const isPng = file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
      const isSvg = file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");
      if (isSvg) {
        URL.revokeObjectURL(objectUrl);
        return file;
      }

      const mimeType = isPng ? "image/png" : "image/jpeg";
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, mimeType, isPng ? undefined : 0.85);
      });

      if (blob && blob.size > 0 && blob.size < file.size) {
        return blob;
      }
      return file;
    } catch (err) {
      URL.revokeObjectURL(objectUrl);
      console.warn("Client-side image optimizer fallback:", err);
      return file;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (allow up to 35MB before compression)
    if (file.size > 35 * 1024 * 1024) {
      setError("File exceeds 35MB limit. Please select a smaller image.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      // 1. Optimize oversized photos (preserves PNG transparency for logos)
      const uploadableBlob = await prepareImageForUpload(file);
      const isPng = file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
      const isSvg = file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");
      const ext = isPng ? ".png" : isSvg ? ".svg" : ".jpg";
      const cleanFileName = file.name.replace(/\.[^/.]+$/, ext);

      // 2. Primary Method: Direct Signed Cloudinary Upload (bypasses Vercel's 4.5MB serverless limit)
      let directUploadError: string | null = null;
      try {
        const sigRes = await fetch("/api/cloudinary/signature", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder }),
        });

        if (sigRes.ok) {
          const sigData = await sigRes.json().catch(() => null);

          if (sigData && sigData.signature && sigData.apiKey && sigData.cloudName) {
            const cloudFormData = new FormData();
            cloudFormData.append("file", uploadableBlob, cleanFileName);
            cloudFormData.append("api_key", sigData.apiKey);
            cloudFormData.append("timestamp", String(sigData.timestamp));
            cloudFormData.append("signature", sigData.signature);
            cloudFormData.append("folder", sigData.folder || folder);

            const cloudRes = await fetch(
              `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
              {
                method: "POST",
                body: cloudFormData,
              }
            );

            const cloudData = await cloudRes.json().catch(() => null);

            if (!cloudRes.ok || cloudData?.error) {
              const msg = cloudData?.error?.message || `Cloudinary rejected upload (${cloudRes.status})`;
              throw new Error(msg);
            }

            setPreview(cloudData.secure_url);
            onUploadSuccess({
              url: cloudData.secure_url,
              public_id: cloudData.public_id,
            });
            return;
          }
        } else {
          directUploadError = "Could not initialize secure cloud upload.";
        }
      } catch (err: unknown) {
        const directErr = err as Error;
        directUploadError = directErr.message || "Direct upload failed";
        // If Cloudinary explicitly rejected the upload (e.g. resolution limit, quota, invalid file), show exact message
        if (
          directUploadError.includes("resolution") ||
          directUploadError.includes("exceeds") ||
          directUploadError.includes("format") ||
          directUploadError.includes("Invalid") ||
          directUploadError.includes("Cloudinary")
        ) {
          throw new Error(directUploadError);
        }
      }

      // 3. Fallback Method: Server route upload with optimized payload
      const formData = new FormData();
      formData.append("file", uploadableBlob, cleanFileName);
      formData.append("folder", folder);

      const res = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        if (res.status === 413 || text.includes("Request Entity Too Large")) {
          throw new Error("File exceeds serverless transfer size. Please upload a compressed image.");
        }
        throw new Error(`Server error (${res.status}): ${text.slice(0, 100)}`);
      }

      if (!res.ok || data.error) {
        throw new Error(data.error || directUploadError || "Failed to upload image");
      }

      setPreview(data.secure_url);
      onUploadSuccess({
        url: data.secure_url,
        public_id: data.public_id,
      });
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Upload failed. Please check image format.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (currentPublicId) {
      try {
        await fetch("/api/cloudinary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_id: currentPublicId }),
        });
      } catch (err) {
        console.warn("Delete asset warning:", err);
      }
    }
    setPreview(null);
    if (onRemove) onRemove();
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono uppercase tracking-wider text-black/70">
        {label}
      </label>

      {preview ? (
        <div
          className={`relative ${aspectRatio} w-full overflow-hidden ${
            bgDark ? "bg-[#0a0b0d] p-3" : "bg-black/5"
          } border border-black/15 group`}
        >
          <Image
            src={preview}
            alt={label}
            fill
            sizes="400px"
            className={`${
              objectFit === "contain"
                ? "object-contain object-center p-2"
                : "object-cover object-center"
            }`}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <label className="cursor-pointer px-3 py-1.5 bg-white text-black text-xs font-mono uppercase tracking-wider hover:bg-white/90">
              Replace
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-none"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Uploaded &amp; Ready
          </div>
        </div>
      ) : (
        <label className={`cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-black/20 hover:border-black/50 bg-black/[0.01] hover:bg-black/[0.03] transition-colors ${aspectRatio}`}>
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-black/60">
              <Loader2 className="w-6 h-6 animate-spin text-black" />
              <span className="text-xs font-mono">Uploading image...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-black/50">
              <UploadCloud className="w-8 h-8 stroke-1 text-black/60" />
              <span className="text-xs font-mono uppercase tracking-wider">
                Click to upload image
              </span>
              <span className="text-[10px] text-black/40">
                JPG, PNG, WEBP up to 10MB
              </span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            disabled={isUploading}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}

      {error && <p className="text-xs text-red-600 font-mono">{error}</p>}
    </div>
  );
}
