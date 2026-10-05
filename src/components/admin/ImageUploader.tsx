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
}

export function ImageUploader({
  label,
  currentImageUrl,
  currentPublicId,
  folder = "maple-consulting",
  onUploadSuccess,
  onRemove,
  aspectRatio = "aspect-[16/9]",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);

  React.useEffect(() => {
    setPreview(currentImageUrl || null);
  }, [currentImageUrl]);

  // Helper to compress oversized camera photos client-side (e.g. 5-15MB phone photos down to < 2MB)
  const prepareImageForUpload = async (file: File): Promise<File | Blob> => {
    if (file.size <= 2.5 * 1024 * 1024 || file.type === "image/svg+xml" || file.type === "image/gif") {
      return file;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          const maxDim = 2400; // High-res 4K clarity

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
            resolve(file);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob && blob.size < file.size) {
                const compressedFile = new File(
                  [blob],
                  file.name.replace(/\.[^/.]+$/, ".jpg"),
                  {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  }
                );
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            "image/jpeg",
            0.85
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 25MB before compression)
    if (file.size > 25 * 1024 * 1024) {
      setError("File exceeds 25MB limit. Please select a smaller image.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      // 1. Optimize oversized photos (drops 8MB down to ~1MB while preserving 4K resolution)
      const uploadableFile = await prepareImageForUpload(file);

      // 2. Primary Method: Direct Signed Cloudinary Upload (bypasses Vercel's 4.5MB serverless payload limit)
      try {
        const sigRes = await fetch("/api/cloudinary/signature", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder }),
        });

        if (sigRes.ok) {
          const sigText = await sigRes.text();
          let sigData;
          try {
            sigData = JSON.parse(sigText);
          } catch {
            sigData = null;
          }

          if (sigData && sigData.signature && sigData.apiKey && sigData.cloudName) {
            const cloudFormData = new FormData();
            cloudFormData.append("file", uploadableFile);
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

            const cloudText = await cloudRes.text();
            let cloudData;
            try {
              cloudData = JSON.parse(cloudText);
            } catch {
              throw new Error(`Cloudinary returned status ${cloudRes.status}`);
            }

            if (!cloudRes.ok || cloudData.error) {
              throw new Error(cloudData.error?.message || "Upload to Cloudinary failed");
            }

            setPreview(cloudData.secure_url);
            onUploadSuccess({
              url: cloudData.secure_url,
              public_id: cloudData.public_id,
            });
            return;
          }
        }
      } catch (directErr) {
        console.warn("Direct upload fallback triggered:", directErr);
      }

      // 3. Fallback Method: Server route upload with safe response parsing
      const formData = new FormData();
      formData.append("file", uploadableFile);
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
          throw new Error("Image file is too large for serverless transfer. Please compress it or select a smaller image.");
        }
        throw new Error(`Server error (${res.status}): ${text.slice(0, 100)}`);
      }

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to upload image");
      }

      setPreview(data.secure_url);
      onUploadSuccess({
        url: data.secure_url,
        public_id: data.public_id,
      });
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Upload failed");
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
        <div className={`relative ${aspectRatio} w-full overflow-hidden bg-black/5 border border-black/15 group`}>
          <Image
            src={preview}
            alt={label}
            fill
            sizes="400px"
            className="object-cover object-center"
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
