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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File exceeds 10MB limit.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

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
