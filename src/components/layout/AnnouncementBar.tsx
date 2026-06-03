"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-luxury-950 via-gold-800 to-luxury-950 text-white">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-center px-4">
        <p className="text-xs font-medium tracking-wider uppercase md:text-sm">
          FREE SHIPPING · <span className="text-gold-300">on orders over ₹5,000</span> · Use code: WELCOME20
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 transition-colors hover:text-white"
          aria-label="Close announcement"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}