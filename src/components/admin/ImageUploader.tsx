"use client";

import { useState, useRef, useEffect } from "react";
import { FileImage, X } from "lucide-react";
import toast from "react-hot-toast";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function ImageUploader({
  imageUrl,
  onImageChange,
  label = "Image",
  aspectRatio = "21/9",
}: {
  imageUrl: string;
  onImageChange: (url: string) => void;
  label?: string;
  aspectRatio?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState<{ orig: string; opt: string; save: string; fmt: string } | null>(null);
  const [origSize, setOrigSize] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    // Show original file size immediately
    const sizeLabel = formatSize(file.size);
    setOrigSize(sizeLabel);
    setUploading(true);
    setStats(null);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (res.ok && data.url) {
        // Set the image URL
        onImageChange(data.url);
        
        // Set stats if available
        if (data.originalSize && data.optimizedSize) {
          setStats({
            orig: data.originalSize,
            opt: data.optimizedSize,
            save: data.savings || "0%",
            fmt: data.format || "AVIF",
          });
        }
        toast.success("Image uploaded & optimized by Sharp");
      } else {
        // Fallback to base64
        const reader = new FileReader();
        reader.onload = (ev) => {
          const url = ev.target?.result as string;
          if (url) onImageChange(url);
        };
        reader.readAsDataURL(file);
        toast.success("Image loaded (fallback)");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    onImageChange("");
    setStats(null);
    setOrigSize(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      {/* Preview with size overlay */}
      {imageUrl ? (
        <div className="relative rounded-xl overflow-hidden bg-muted" style={{ aspectRatio }}>
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          
          {/* Size badges at bottom */}
          <div className="absolute bottom-2 left-2 right-2 flex gap-1.5 flex-wrap">
            {origSize && (
              <span className="rounded-md bg-black/70 px-2 py-1 text-[10px] text-white backdrop-blur-sm">
                Original: <strong>{origSize}</strong>
              </span>
            )}
            {stats && (
              <span className="rounded-md bg-green-500/80 px-2 py-1 text-[10px] text-white backdrop-blur-sm">
                Sharp: <strong>{stats.opt}</strong> ({stats.save} ↓)
              </span>
            )}
          </div>

          {/* X button */}
          <button onClick={clearImage} className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="rounded-xl bg-muted/30 border-2 border-dashed border-border flex items-center justify-center" style={{ aspectRatio, minHeight: 120 }}>
          <p className="text-xs text-muted-foreground">No image selected</p>
        </div>
      )}

      {/* Stats card */}
      {stats && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-green-600">Sharp Optimization</span>
            <span className="text-[10px] font-mono bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded">{stats.fmt}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <div className="rounded bg-background/60 p-1.5"><span className="text-muted-foreground">Original </span><strong>{stats.orig}</strong></div>
            <div className="rounded bg-background/60 p-1.5"><span className="text-muted-foreground">Optimized </span><strong>{stats.opt}</strong></div>
            <div className="rounded bg-background/60 p-1.5"><span className="text-muted-foreground">Saved </span><strong className="text-green-500">{stats.save}</strong></div>
          </div>
        </div>
      )}

      {/* Upload + URL */}
      <div className="flex gap-2">
        <label className="flex-1 cursor-pointer rounded-lg border-2 border-dashed border-border p-4 text-center hover:border-gold-500 transition-colors">
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <FileImage className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
          <p className="text-xs font-medium">{uploading ? "Sharp processing..." : "Upload"}</p>
          <p className="text-[10px] text-muted-foreground">Auto AVIF/WebP</p>
        </label>
        <div className="flex-[2] space-y-1">
          <p className="text-[10px] text-muted-foreground">Or image URL</p>
          <input type="text" value={imageUrl} onChange={(e) => onImageChange(e.target.value)}
            placeholder="https://..." className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs focus:border-gold-500 focus:outline-none font-mono" />
        </div>
      </div>
    </div>
  );
}