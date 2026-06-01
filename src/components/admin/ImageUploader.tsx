"use client";

import { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

interface UploadStats {
  originalSize: string;
  optimizedSize: string;
  savings: string;
  format: string;
}

interface ImageUploaderProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  label?: string;
  aspectRatio?: string;
}

export function ImageUploader({
  imageUrl,
  onImageChange,
  label = "Image",
  aspectRatio = "21/9",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState<UploadStats | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    setUploading(true);
    setUploadStats(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onImageChange(data.url);

        if (data.savings) {
          setUploadStats({
            originalSize: data.originalSize,
            optimizedSize: data.optimizedSize,
            savings: data.savings,
            format: data.format,
          });
        }
        toast.success("Image uploaded & optimized");
      } else {
        // Fallback: read as data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          if (url) onImageChange(url);
          toast.success("Image loaded");
        };
        reader.readAsDataURL(file);
      }
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Image Preview */}
      {imageUrl && (
        <div className="relative rounded-xl overflow-hidden bg-muted" style={{ aspectRatio }}>
          <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
          <button
            onClick={() => { onImageChange(""); setUploadStats(null); }}
            className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Sharp Optimization Stats */}
      {uploadStats && (
        <div className="rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
              ✓ Sharp Optimized
            </p>
            <span className="text-xs font-mono text-green-600 dark:text-green-400">
              {uploadStats.format}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-lg bg-background/50 p-2">
              <p className="text-muted-foreground">Original</p>
              <p className="font-semibold">{uploadStats.originalSize}</p>
            </div>
            <div className="rounded-lg bg-background/50 p-2">
              <p className="text-muted-foreground">Optimized</p>
              <p className="font-semibold">{uploadStats.optimizedSize}</p>
            </div>
            <div className="rounded-lg bg-background/50 p-2">
              <p className="text-muted-foreground">Saved</p>
              <p className="font-semibold text-green-500">{uploadStats.savings}</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload + URL */}
      <div className="flex gap-3">
        <label className="flex-1 cursor-pointer rounded-xl border-2 border-dashed border-border p-6 text-center hover:border-gold-500 transition-colors">
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">
            {uploading ? "Optimizing with Sharp..." : "Upload Image"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Auto AVIF/WebP</p>
        </label>
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium">Or paste URL</p>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => onImageChange(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none font-mono"
          />
        </div>
      </div>
    </div>
  );
}