"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?newarrivals=true&limit=12")
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setProducts(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-12"><div className="animate-pulse space-y-4"><div className="h-8 w-48 rounded bg-muted mx-auto" /><div className="grid grid-cols-4 gap-4"><div className="h-80 rounded-2xl bg-muted" /><div className="h-80 rounded-2xl bg-muted" /><div className="h-80 rounded-2xl bg-muted" /><div className="h-80 rounded-2xl bg-muted" /></div></div></div>;
  }

  return (
    <div>
      <div className="border-b border-border bg-gradient-to-r from-luxury-950 via-luxury-900 to-luxury-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Sparkles className="h-10 w-10 mx-auto text-gold-500 mb-4" />
            <h1 className="font-display text-4xl font-bold text-white md:text-6xl">New Arrivals</h1>
            <p className="mt-4 text-lg text-white/70">Be the first to explore our latest drops</p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No new arrivals yet</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product: any, i: number) => {
              const img = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
              return (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group">
                  <Link href={`/product/${product.slug}`}>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                      {img && <OptimizedImage src={img.url} alt={product.name} className="h-full w-full transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />}
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase text-black">New</span>
                      {product.isOnSale && <span className="absolute left-3 top-3 rounded-full bg-gold-500 px-3 py-1 text-[10px] font-semibold uppercase text-black">Sale</span>}
                    </div>
                  </Link>
                  <div className="mt-3 space-y-1">
                    <Link href={`/product/${product.slug}`} className="block text-sm font-medium transition-colors hover:text-gold-500">{product.name}</Link>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">Rs.{Number(product.price).toLocaleString()}</span>
                      {product.comparePrice && <span className="text-xs text-muted-foreground line-through">Rs.{Number(product.comparePrice).toLocaleString()}</span>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}