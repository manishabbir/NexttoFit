"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Tag, ArrowRight } from "lucide-react";

const saleProducts = [
  { id: "1", name: "Premium Executive Suit", slug: "premium-executive-suit", price: 18500, comparePrice: 25000, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80" },
  { id: "2", name: "Luxury Cashmere Coat", slug: "luxury-cashmere-blend-coat", price: 32000, comparePrice: 42000, image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80" },
  { id: "4", name: "Italian Leather Loafers", slug: "italian-leather-loafers", price: 15800, comparePrice: 19500, image: "https://images.unsplash.com/photo-1531310197839-ccf546a09c7f?w=600&q=80" },
  { id: "6", name: "Handcrafted Leather Bag", slug: "handcrafted-leather-bag", price: 22500, comparePrice: 28000, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80" },
  { id: "8", name: "Classic Oxford Shirt", slug: "classic-oxford-shirt", price: 8500, comparePrice: 11000, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80" },
  { id: "10", name: "Wool Cashmere Scarf", slug: "wool-cashmere-scarf", price: 6500, comparePrice: 8500, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80" },
];

export default function SalePage() {
  return (
    <div>
      <div className="bg-gradient-to-r from-gold-950 via-gold-900 to-gold-950 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Tag className="h-10 w-10 mx-auto text-gold-500 mb-4" />
            <h1 className="font-display text-4xl font-bold text-white md:text-6xl">Sale</h1>
            <p className="mt-4 text-xl text-gold-200">Up to 40% off on selected items</p>
            <p className="mt-2 text-sm text-gold-300/60">Limited time offer. Use code: SUMMER15</p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {saleProducts.map((product, i) => {
            const discount = product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;
            return (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group">
                <Link href={`/product/${product.slug}`}>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute left-3 top-3 rounded-full bg-gold-500 px-3 py-1 text-xs font-bold text-black">-{discount}%</span>
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
            );
          })}
        </div>
      </div>
    </div>
  );
}