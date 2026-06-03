"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const products = [
  { id: "2", name: "Luxury Cashmere Coat", slug: "luxury-cashmere-blend-coat", price: 32000, comparePrice: 42000, image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80" },
  { id: "3", name: "Designer Kurta Shalwar", slug: "designer-kurta-shalwar", price: 12500, comparePrice: null, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80" },
  { id: "5", name: "Silk Evening Gown", slug: "silk-evening-gown", price: 28000, comparePrice: null, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80" },
  { id: "8", name: "Classic Oxford Shirt", slug: "classic-oxford-shirt", price: 8500, comparePrice: 11000, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80" },
  { id: "13", name: "Designer Embroidered Kurta", slug: "designer-embroidered-kurta", price: 16500, comparePrice: null, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80" },
  { id: "16", name: "Luxury Heeled Sandals", slug: "luxury-heeled-sandals", price: 14500, comparePrice: 18000, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80" },
];

export default function NewArrivalsPage() {
  return (
    <div>
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl font-bold md:text-5xl">New Arrivals</h1>
            <p className="mt-2 text-muted-foreground">Be the first to explore our latest drops</p>
          </motion.div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group">
              <Link href={`/product/${product.slug}`}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase text-black backdrop-blur-sm">New</span>
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