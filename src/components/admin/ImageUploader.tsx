"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { FileImage, X, Monitor, Smartphone, Tablet, Maximize2 } from "lucide-react";
import toast from "react-hot-toast";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const FRAMES = [
  { id: "banner", label: "Hero Banner", w: "100%", h: "400px", icon: Monitor },
  { id: "product", label: "Product Card", w: "300px", h: "400px", icon: Smartphone },
  { id: "blog", label: "Blog Header", w: "100%", h: "300px", icon: Tablet },
  { id: "square", label: "Square", w: "300px", h: "300px", icon: Maximize2 },
];

export function ImageUploader({
  imageUrl,
  onImageChange,
}: {
  imageUrl: string;
  onImageChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [origSize, setOrigSize] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [frame, setFrame] = useState("banner");
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragOrigin, setDragOrigin] = useState({ x: 0, y: 0 });
  const [showPreview, setShowPreview] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoldingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const curFrame = FRAMES.find((f) => f.id === frame) || FRAMES[0];
  const canDrag = zoom > 100;

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 1, 500));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 1, 25));
  }, []);

  // Hold-to-continuously-change handlers
  const startHold = useCallback(
    (direction: "in" | "out") => {
      if (holdTimerRef.current) return;
      isHoldingRef.current = true;
      // Initial delay before continuous starts
      holdDelayRef.current = setTimeout(() => {
        if (isHoldingRef.current) {
          holdTimerRef.current = setInterval(() => {
            if (direction === "in") {
              setZoom((prev) => Math.min(prev + 1, 500));
            } else {
              setZoom((prev) => Math.max(prev - 1, 25));
            }
          }, 30);
        }
      }, 300);
    },
    []
  );

  const stopHold = useCallback(() => {
    isHoldingRef.current = false;
    if (holdDelayRef.current) {
      clearTimeout(holdDelayRef.current);
      holdDelayRef.current = null;
    }
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (holdDelayRef.current) clearTimeout(holdDelayRef.current);
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    };
  }, []);

  // Mouse handlers for dragging
  const onMouseDown = (e: React.MouseEvent) => {
    if (!canDrag) return;
    e.preventDefault();
    setDragging(true);
    setDragOrigin({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !canDrag) return;
    setOffset({ x: e.clientX - dragOrigin.x, y: e.clientY - dragOrigin.y });
  };
  const onMouseUp = () => setDragging(false);

  const resetView = () => {
    setZoom(100);
    setOffset({ x: 0, y: 0 });
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Only images allowed");
      return;
    }
    setOrigSize(formatSize(file.size));
    setUploading(true);
    setShowPreview(true);
    resetView();
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await res.json();
      if (res.ok && d.url) {
        onImageChange(d.url);
        if (d.savings) setStats(d);
        toast.success("Image uploaded & optimized");
      } else {
        const r = new FileReader();
        r.onload = (ev) => {
          const u = ev.target?.result as string;
          if (u) onImageChange(u);
        };
        r.readAsDataURL(file);
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Upload row */}
      <div className="flex gap-2">
        <label className="flex-1 cursor-pointer rounded-lg border-2 border-dashed border-border p-4 text-center hover:border-gold-500 transition-colors">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <FileImage className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
          <p className="text-xs font-medium">
            {uploading ? "Processing..." : "Upload Image"}
          </p>
          <p className="text-[10px] text-muted-foreground">Auto AVIF/WebP</p>
        </label>
        <div className="flex-[2] space-y-1">
          <p className="text-[10px] text-muted-foreground">Or paste image URL</p>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => {
              onImageChange(e.target.value);
              if (e.target.value) {
                setShowPreview(true);
                resetView();
              }
            }}
            placeholder="https://..."
            className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs font-mono focus:border-gold-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Preview */}
      {showPreview && imageUrl && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
            <div className="flex items-center gap-1">
              {FRAMES.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setFrame(f.id);
                    resetView();
                  }}
                  className={`rounded-lg px-2.5 py-1.5 text-[10px] font-medium transition-colors ${
                    frame === f.id
                      ? "bg-gold-500/20 text-gold-600"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <f.icon className="h-3 w-3 inline mr-1" />
                  {f.label}
                </button>
              ))}
            </div>

            {/* Zoom controls: up/down arrows with hold-to-continue */}
            <div className="flex items-center gap-1">
              <div className="flex items-center rounded-lg border border-border bg-background">
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    zoomOut();
                    startHold("out");
                  }}
                  onMouseUp={stopHold}
                  onMouseLeave={stopHold}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    zoomOut();
                    startHold("out");
                  }}
                  onTouchEnd={stopHold}
                  className="px-2 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-l-lg transition-colors select-none"
                  aria-label="Zoom out"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                </button>
                <span className="px-3 py-1.5 text-xs font-semibold tabular-nums min-w-[48px] text-center border-x border-border select-none">
                  {zoom}%
                </span>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    zoomIn();
                    startHold("in");
                  }}
                  onMouseUp={stopHold}
                  onMouseLeave={stopHold}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    zoomIn();
                    startHold("in");
                  }}
                  onTouchEnd={stopHold}
                  className="px-2 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-r-lg transition-colors select-none"
                  aria-label="Zoom in"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Frame with image */}
          <div
            className="bg-[#f0f0f0] dark:bg-[#1a1a1a]"
            onMouseUp={onMouseUp}
            onMouseLeave={() => {
              onMouseUp();
              stopHold();
            }}
          >
            <div
              className="mx-auto"
              style={{
                width: curFrame.w,
                maxWidth: "100%",
                height: curFrame.h,
                maxHeight: "60vh",
              }}
            >
              <div
                ref={containerRef}
                className={`relative h-full w-full overflow-hidden ${
                  canDrag
                    ? "cursor-grab active:cursor-grabbing"
                    : "cursor-default"
                }`}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
              >
                <img
                  src={imageUrl}
                  alt=""
                  draggable={false}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: `${zoom}%`,
                    height: `${zoom}%`,
                    maxWidth: `${zoom}%`,
                    maxHeight: `${zoom}%`,
                    objectFit: "cover",
                    transform: `translate(calc(-50% + ${offset.x / (zoom / 100)}px), calc(-50% + ${offset.y / (zoom / 100)}px))`,
                    transition: dragging ? "none" : "width 0.15s, height 0.15s",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bottom info */}
          <div className="flex items-center gap-2 px-3 py-2 border-t border-border bg-muted/20">
            {origSize && (
              <span className="text-[10px]">
                Original: <strong>{origSize}</strong>
              </span>
            )}
            {stats && (
              <span className="text-[10px] text-green-600">
                Optimized: <strong>{stats.optimizedSize}</strong> ({stats.savings}
                ↓)
              </span>
            )}
            {canDrag && (
              <span className="text-[10px] text-muted-foreground ml-auto">
                Click & drag to reposition
              </span>
            )}
            <button
              onClick={resetView}
              className="ml-1 text-[10px] text-gold-500 hover:text-gold-400 font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Stats card */}
      {stats && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-green-600">
              Sharp Optimization
            </span>
            <span className="text-[10px] font-mono bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded">
              {stats.format}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <div className="rounded bg-background/60 p-1.5">
              <span className="text-muted-foreground">Original </span>
              <strong>{stats.originalSize}</strong>
            </div>
            <div className="rounded bg-background/60 p-1.5">
              <span className="text-muted-foreground">Optimized </span>
              <strong>{stats.optimizedSize}</strong>
            </div>
            <div className="rounded bg-background/60 p-1.5">
              <span className="text-muted-foreground">Saved </span>
              <strong className="text-green-500">{stats.savings}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}