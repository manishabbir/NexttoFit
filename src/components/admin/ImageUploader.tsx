"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, FileImage } from "lucide-react";
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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function ImageUploader({
  imageUrl,
  onImageChange,
  label = "Image",
  aspectRatio = "21/9",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState<UploadStats | null>(null);
  const [originalFileSize, setOriginalFileSize] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    // Show original file size immediately
    const originalSize = formatFileSize(file.size);
    setOriginalFileSize(originalSize);
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

  const handleClear = () => {
    onImageChange("");
    setUploadStats(null);
    setOriginalFileSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {/* Image Preview with Size Info */}
      {imageUrl && (
        <div className="relative rounded-xl overflow-hidden bg-muted" style={{ aspectRatio }}>
          <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
          
          {/* File Size Info Overlay */}
          <div className="absolute bottom-2 left-2 right-2 flex gap-2">
            {originalFileSize && (
              <div className="rounded-lg bg-black/70 backdrop-blur-sm px-2.5 py-1.5 text-[10px] text-white">
                <span className="text-white/60">Original: </span>
                <span className="font-semibold">{originalFileSize}</span>
              </div>
            )}
            {uploadStats && (
              <div className="rounded-lg bg-green-500/80 backdrop-blur-sm px-2.5 py-1.5 text-[10px] text-white">
                <span className="text-white/80">Optimized: </span>
                <span className="font-semibold">{uploadStats.optimizedSize}</span>
                <span className="ml-1.5 text-white/80">({uploadStats.savings} ↓)</span>
              </div>
            )}
          </div>

          {/* Remove Button */}
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Sharp Stats Card - detailed permanent view */}
      {uploadStats && (
        <div className="rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-green-600 dark:text-green-400">
              ✓ Sharp Optimized
            </p>
            <span className="text-[10px] font-mono text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
              {uploadStats.format}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-background/50 p-2">
              <p className="text-[10px] text-muted-foreground">Original</p>
              <p className="text-xs font-semibold">{uploadStats.originalSize}</p>
            </div>
            <div className="rounded-lg bg-background/50 p-2">
              <p className="text-[10px] text-muted-foreground">Optimized</p>
              <p className="text-xs font-semibold">{uploadStats.optimizedSize}</p>
            </div>
            <div className="rounded-lg bg-background/50 p-2">
              <p className="text-[10px] text-muted-foreground">Saved</p>
              <p className="text-xs font-semibold text-green-500">{uploadStats.savings}</p>
            </div>
          </div>
        </div>
      )}

      {/* File Select + URL Input */}
      <div className="flex gap-3">
        <label className="flex-1 cursor-pointer rounded-xl border-2 border-dashed border-border p-5 text-center hover:border-gold-500 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          <FileImage className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" />
          <p className="text-xs font-medium">
            {uploading ? "Optimizing..." : "Choose Image"}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Any size, auto AVIF</p>
        </label>
        <div className="flex-[2] space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Or paste image URL</p>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => onImageChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs focus:border-gold-500 focus:outline-none font-mono"
          />
        </div>
      </div>
    </div>
  );
}