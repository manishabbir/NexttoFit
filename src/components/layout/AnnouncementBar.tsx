"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface AnnouncementSettings {
  enabled: boolean;
  text: string;
  highlightText: string;
  couponCode: string;
  backgroundColor: string;
  textColor: string;
}

const defaultAnnouncement: AnnouncementSettings = {
  enabled: true,
  text: "FREE SHIPPING ·",
  highlightText: "on orders over ₹5,000",
  couponCode: "WELCOME20",
  backgroundColor: "from-luxury-950 via-gold-800 to-luxury-950",
  textColor: "text-white",
};

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [settings, setSettings] = useState<AnnouncementSettings>(defaultAnnouncement);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.announcement_bar) {
          const parsed = JSON.parse(data.announcement_bar);
          setSettings({ ...defaultAnnouncement, ...parsed });
        }
      })
      .catch(console.error);
  }, []);

  if (!isVisible || !settings.enabled || dismissed) return null;

  return (
    <div className={`relative bg-gradient-to-r ${settings.backgroundColor} ${settings.textColor}`}>
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-center px-4">
        <p className="text-xs font-medium tracking-wider uppercase md:text-sm">
          {settings.text} <span className="text-gold-300">{settings.highlightText}</span>
          {settings.couponCode ? ` · Use code: ${settings.couponCode}` : ""}
        </p>
        <button
          onClick={() => { setIsVisible(false); setDismissed(true); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 transition-colors hover:text-white"
          aria-label="Close announcement"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}