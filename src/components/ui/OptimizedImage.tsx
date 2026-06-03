"use client";

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
}

export function OptimizedImage({
  src,
  alt,
  className = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  fill = true,
  width,
  height,
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <div className="text-center p-4">
          <div className="mx-auto h-10 w-10 rounded-full bg-muted-foreground/20" />
          <p className="mt-2 text-xs text-muted-foreground">Image unavailable</p>
        </div>
      </div>
    );
  }

  // For external URLs (Unsplash etc), use img tag for reliability
  if (src.startsWith("http")) {
    return (
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"} ${className}`}
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={`transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"} ${className}`}
      sizes={sizes}
      priority={priority}
      fill={fill}
      width={fill ? undefined : width || 800}
      height={fill ? undefined : height || 800}
      onLoad={() => setLoading(false)}
      onError={() => setError(true)}
    />
  );
}