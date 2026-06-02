"use client";

import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
}

export function OptimizedImage({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "100vw",
  width,
  height,
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const optimizedSrc = optimizeUrl(src, width);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        sizes={sizes}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        draggable={false}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-xs">
          Failed to load
        </div>
      )}
    </div>
  );
}

function optimizeUrl(url: string, width?: number): string {
  if (!url || url.startsWith("/") || url.startsWith("data:")) return url;
  try {
    const u = new URL(url);
    if (u.hostname.includes("unsplash")) {
      const w = width || Math.min(parseInt(u.searchParams.get("w") || "800"), 1200);
      u.searchParams.set("w", String(w));
      u.searchParams.set("q", "75");
      u.searchParams.set("auto", "format");
      return u.toString();
    }
    return url;
  } catch {
    return url;
  }
}