"use client";

import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import { useState } from "react";

const banners = [
  { id: "1", title: "Elevate Your Everyday Style", subtitle: "Premium Collection 2024", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80", active: true, hero: true, order: 1, clicks: 1245 },
  { id: "2", title: "Redefining Feminine Elegance", subtitle: "Women's Collection", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80", active: true, hero: true, order: 2, clicks: 987 },
  { id: "3", title: "New Season Now Arriving", subtitle: "Summer 2024", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80", active: true, hero: true, order: 3, clicks: 756 },
  { id: "4", title: "Eid Collection 2024", subtitle: "Festive Essentials", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80", active: false, hero: false, order: 4, clicks: 0 },
];

export default function AdminBannersPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Banners</h1>
          <p className="text-sm text-muted-foreground">Manage homepage banners and promotions</p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
          <Plus className="h-4 w-4" /> Add Banner
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        {[
          { label: "Total Banners", value: "6", change: "3 active" },
          { label: "Hero Banners", value: "3", change: "Carousel" },
          { label: "Total Clicks", value: "2,988", change: "+15.2%" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-gold-500 mt-0.5">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {banners.map((banner, i) => (
          <motion.div key={banner.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="h-48 w-full sm:w-72 flex-shrink-0">
                <img src={banner.image} alt={banner.title} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{banner.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{banner.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {banner.hero && <span className="rounded-full bg-gold-500/20 px-3 py-1 text-xs font-medium text-gold-500">Hero</span>}
                    <button className={`rounded-lg p-2 transition-colors ${banner.active ? "text-green-500 hover:bg-green-500/10" : "text-muted-foreground hover:bg-muted"}`}>
                      {banner.active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                    </button>
                    <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Edit className="h-4 w-4" /></button>
                    <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span>Order: {banner.order}</span>
                  <span>Clicks: {banner.clicks}</span>
                  <span className={banner.active ? "text-green-500" : "text-destructive"}>{banner.active ? "Active" : "Inactive"}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}