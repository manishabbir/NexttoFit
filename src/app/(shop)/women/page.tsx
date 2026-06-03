"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";

const products = [
  { id: "5", name: "Silk Evening Gown", slug: "silk-evening-gown", price: 28000, comparePrice: null, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80", isNew: true, isSale: false },
  { id: "6", name: "Handcrafted Leather Bag", slug: "handcrafted-leather-bag", price: 22500, comparePrice: 28000, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80", isNew: false, isSale: true },
  { id: "13", name: "Designer Embroidered Kurta", slug: "designer-embroidered-kurta", price: 16500, comparePrice: null, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80", isNew: true, isSale: false },
  { id: "14", name: "Premium Stole Dupatta", slug: "premium-stole-dupatta", price: 8500, comparePrice: 12000, image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80", isNew: false, isSale: true },
  { id: "15", name: "Casual Linen Dress", slug: "casual-linen-dress", price: 12000, comparePrice: null, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80", isNew: false, isSale: false },
  { id: "16", name: "Luxury Heeled Sandals", slug: "luxury-heeled-sandals", price: 14500, comparePrice: 18000, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80", isNew: true, isSale: false },
  { id: "17", name: "Chiffon Party Wear", slug: "chiffon-party-wear", price: 19500, comparePrice: 25000, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80", isNew: false, isSale: true },
  { id: "18", name: "Pearl Jewelry Set", slug: "pearl-jewelry-set", price: 9500, comparePrice: null, image: "https://images.unsplash.com/photo-1515562141589-3e12a4e2d8d6?w=600&q=80", isNew: true, isSale: false },
];

export default function WomenPage() {
  return (
    <div>
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl font-bold md:text-5xl">Women's Collection</h1>
            <p className="mt-2 text-muted-foreground">Elegant designs for the modern woman</p>
          </motion.div>
        </div>
      </div>

      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
              <div className="hidden gap-2 md:flex">
                {["All", "Designer", "Casual", "Eastern", "Accessories"].map((cat) => (
                  <button key={cat} className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${cat === "All" ? "bg-gold-500 text-black" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-sm text-muted-foreground">{products.length} Products</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="group">
              <Link href={`/product/${product.slug}`}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {product.isNew && <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase text-black">New</span>}
                  {product.isSale && <span className="absolute left-3 top-3 rounded-full bg-gold-500 px-3 py-1 text-[10px] font-semibold uppercase text-black">Sale</span>}
                </div>
              </Link>
              <div className="mt-4 space-y-1">
                <Link href={`/product/${product.slug}`} className="block text-sm font-medium transition-colors hover:text-gold-500">{product.name}</Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">₹{product.price.toLocaleString()}</span>
                  {product.comparePrice && <span className="text-xs text-muted-foreground line-through">₹{product.comparePrice.toLocaleString()}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}