"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SlidersHorizontal, Grid3X3, List, ChevronDown } from "lucide-react";

const products = [
  { id: "1", name: "Premium Executive Suit", slug: "premium-executive-suit", price: 18500, comparePrice: 25000, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80", rating: 4.8, reviews: 124, isNew: false, isSale: true },
  { id: "2", name: "Luxury Cashmere Coat", slug: "luxury-cashmere-blend-coat", price: 32000, comparePrice: 42000, image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80", rating: 4.9, reviews: 89, isNew: true, isSale: true },
  { id: "7", name: "Tailored Fit Blazer", slug: "tailored-fit-blazer", price: 22000, comparePrice: null, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80", rating: 4.6, reviews: 56, isNew: false, isSale: false },
  { id: "8", name: "Classic Oxford Shirt", slug: "classic-oxford-shirt", price: 8500, comparePrice: 11000, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80", rating: 4.5, reviews: 203, isNew: true, isSale: false },
  { id: "9", name: "Slim Fit Chinos", slug: "slim-fit-chinos", price: 9500, comparePrice: null, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80", rating: 4.4, reviews: 178, isNew: false, isSale: false },
  { id: "10", name: "Wool Cashmere Scarf", slug: "wool-cashmere-scarf", price: 6500, comparePrice: 8500, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80", rating: 4.7, reviews: 42, isNew: false, isSale: true },
  { id: "11", name: "Designer Leather Belt", slug: "designer-leather-belt", price: 7200, comparePrice: null, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", rating: 4.3, reviews: 89, isNew: true, isSale: false },
  { id: "12", name: "Premium Denim Jacket", slug: "premium-denim-jacket", price: 14500, comparePrice: 18000, image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80", rating: 4.6, reviews: 134, isNew: false, isSale: true },
];

export default function MenPage() {
  const [sortBy, setSortBy] = useState("newest");

  return (
    <div>
      {/* Page Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl font-bold md:text-5xl">Men's Collection</h1>
            <p className="mt-2 text-muted-foreground">Premium menswear crafted for the modern gentleman</p>
          </motion.div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
              <div className="hidden gap-2 md:flex">
                {["All", "Suits", "Casual", "Formal", "Accessories"].map((cat) => (
                  <button
                    key={cat}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      cat === "All"
                        ? "bg-gold-500 text-black"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{products.length} Products</span>
              <div className="hidden md:flex items-center gap-2 border-l border-border pl-4">
                <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                  <List className="h-4 w-4" />
                </button>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground focus:border-gold-500 focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <Link href={`/product/${product.slug}`}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {product.isNew && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase text-black backdrop-blur-sm">New</span>
                  )}
                  {product.isSale && (
                    <span className="absolute left-3 top-3 rounded-full bg-gold-500 px-3 py-1 text-[10px] font-semibold uppercase text-black backdrop-blur-sm">Sale</span>
                  )}
                </div>
              </Link>
              <div className="mt-4 space-y-1">
                <Link href={`/product/${product.slug}`} className="block text-sm font-medium transition-colors hover:text-gold-500">
                  {product.name}
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">₹{product.price.toLocaleString()}</span>
                  {product.comparePrice && (
                    <span className="text-xs text-muted-foreground line-through">₹{product.comparePrice.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}