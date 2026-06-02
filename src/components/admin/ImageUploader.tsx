"use client";

import { useState, useRef, useCallback } from "react";
import { FileImage, X, ZoomIn, ZoomOut, Maximize2, Monitor, Smartphone, Tablet, Hand } from "lucide-react";
import toast from "react-hot-toast";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const frames = [
  { id: "banner", label: "Hero Banner", width: "100%", height: "400px", icon: Monitor, desc: "Homepage hero slider" },
  { id: "product", label: "Product Card", width: "300px", height: "400px", icon: Smartphone, desc: "Product grid listing" },
  { id: "blog", label: "Blog Featured", width: "100%", height: "300px", icon: Tablet, desc: "Blog post header" },
  { id: "square", label: "Square", width: "300px", height: "300px", icon: Maximize2, desc: "Social/Instagram post" },
];

export function ImageUploader({
  imageUrl,
  onImageChange,
  aspectRatio = "21/9",
}: {
  imageUrl: string;
  onImageChange: (url: string) => void;
  aspectRatio?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState<{ orig: string; opt: string; save: string; fmt: string } | null>(null);
  const [origSize, setOrigSize] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [selectedFrame, setSelectedFrame] = useState("banner");
  const [showPreview, setShowPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 100) return; // Only drag when zoomed in
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    if (imageContainerRef.current) {
      imageContainerRef.current.style.cursor = "grabbing";
    }
  }, [zoom, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || zoom <= 100) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPan({ x: newX, y: newY });
  }, [isDragging, zoom, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (imageContainerRef.current) {
      imageContainerRef.current.style.cursor = zoom > 100 ? "grab" : "default";
    }
  }, [zoom]);

  const resetView = () => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
  };

  const handleZoomChange = (newZoom: number) => {
    const clamped = Math.max(25, Math.min(500, newZoom));
    setZoom(clamped);
    // Clamp pan so image doesn't go too far off screen
    if (clamped <= 100) setPan({ x: 0, y: 0 });
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }
    const sizeLabel = formatSize(file.size);
    setOrigSize(sizeLabel);
    setUploading(true);
    setStats(null);
    setShowPreview(true);
    resetView();

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        onImageChange(data.url);
        if (data.originalSize && data.optimizedSize) {
          setStats({ orig: data.originalSize, opt: data.optimizedSize, save: data.savings || "0%", fmt: data.format || "AVIF" });
        }
        toast.success("Image uploaded & optimized by Sharp");
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => { const url = ev.target?.result as string; if (url) onImageChange(url); };
        reader.readAsDataURL(file);
        toast.success("Image loaded (fallback)");
      }
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const clearImage = () => {
    onImageChange(""); setStats(null); setOrigSize(null); setShowPreview(false); resetView();
    if (inputRef.current) inputRef.current.value = "";
  };

  const currentFrame = frames.find((f) => f.id === selectedFrame) || frames[0];

  return (
    <div className="space-y-3">
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
          <input type="text" value={imageUrl} onChange={(e) => { onImageChange(e.target.value); if (e.target.value) { setShowPreview(true); resetView(); } }}
            placeholder="https://..." className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs focus:border-gold-500 focus:outline-none font-mono" />
        </div>
      </div>

      {/* Preview Section */}
      {showPreview && imageUrl && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-2 border-b border-border bg-muted/30">
            <div className="flex items-center gap-1">
              {frames.map((f) => (
                <button key={f.id} onClick={() => setSelectedFrame(f.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-medium transition-colors ${selectedFrame === f.id ? "bg-gold-500/20 text-gold-600" : "text-muted-foreground hover:bg-muted"}`}>
                  <f.icon className="h-3 w-3" /> <span className="hidden sm:inline">{f.label}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => resetView()} className="rounded p-1 hover:bg-muted text-muted-foreground" title="Reset view">
                <Maximize2 className="h-3 w-3" />
              </button>
              <button onClick={() => handleZoomChange(zoom - 25)} className="rounded p-1 hover:bg-muted text-muted-foreground">
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="text-[10px] text-muted-foreground font-medium w-9 text-center">{zoom}%</span>
              <button onClick={() => handleZoomChange(zoom + 25)} className="rounded p-1 hover:bg-muted text-muted-foreground">
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Frame */}
          <div
            className="flex items-center justify-center p-4 bg-gradient-to-br from-gray-100/50 to-gray-200/50 dark:from-gray-900/50 dark:to-gray-800/50 select-none"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div className="relative overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300"
              style={{ width: currentFrame.width, maxWidth: "100%", height: currentFrame.height, maxHeight: "70vh" }}>
              
              <div className="absolute top-2 left-2 z-20 rounded-md bg-black/60 px-2 py-0.5 text-[9px] text-white/80 backdrop-blur-sm">
                {currentFrame.label}
              </div>

              {/* Drag hint when zoomed */}
              {zoom > 100 && !isDragging && (
                <div className="absolute top-2 right-2 z-20 rounded-md bg-black/60 px-2 py-1 text-[9px] text-white/70 backdrop-blur-sm flex items-center gap-1">
                  <Hand className="h-3 w-3" /> Drag to pan
                </div>
              )}

              {/* Image container with pan */}
              <div
                ref={imageContainerRef}
                className="h-full w-full overflow-hidden"
                style={{ cursor: zoom > 100 ? "grab" : "default" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={imageUrl}
                  alt="Preview"
                  draggable={false}
                  className="transition-transform duration-75"
                  style={{
                    transform: `scale(${zoom / 100}) translate(${pan.x / (zoom / 100)}px, ${pan.y / (zoom / 100)}px)`,
                    transformOrigin: "center center",
                    width: "100%",
                    height: "100%",
                    objectFit: zoom <= 100 ? "contain" : "none",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center gap-2 px-3 py-2 border-t border-border bg-muted/20">
            {origSize && <span className="rounded-md bg-black/10 dark:bg-white/10 px-2 py-0.5 text-[10px]">Original: <strong>{origSize}</strong></span>}
            {stats && <span className="rounded-md bg-green-500/10 px-2 py-0.5 text-[10px] text-green-600">Sharp: <strong>{stats.opt}</strong> <span className="text-green-500">({stats.save} ↓)</span></span>}
            {zoom > 100 && <span className="text-[10px] text-muted-foreground ml-auto">Drag image to pan · Scroll to zoom</span>}
          </div>
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
    </div>
  );
}