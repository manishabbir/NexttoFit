"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SlidersHorizontal, Grid3X3, List, ChevronDown } from "lucide-react";

export default function MenPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchMenProducts();
  }, []);

  const fetchMenProducts = async () => {
    try {
      const res = await fetch("/api/products?all=true");
      const data = await res.json();
      if (Array.isArray(data)) {
        // Filter men's products (products in "Suits", "Coats", "Traditional" categories, or men's items)
        const menProducts = data.filter((p: any) => {
          const catNames = p.categories?.map((c: any) => c.category?.name?.toLowerCase()) || [];
          const menKeywords = ["suit", "coat", "shirt", "blazer", "chino", "scarf", "belt", "jacket", "men"];
          const name = p.name?.toLowerCase() || "";
          return menKeywords.some((k) => name.includes(k)) || catNames.some((c: string) => menKeywords.some((k) => c.includes(k)));
        });
        setProducts(menProducts.length > 0 ? menProducts : data.slice(0, 8));
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-12"><div className="animate-pulse space-y-4"><div className="h-8 w-48 rounded bg-muted" /><div className="grid grid-cols-4 gap-4"><div className="h-80 rounded-2xl bg-muted" /><div className="h-80 rounded-2xl bg-muted" /><div className="h-80 rounded-2xl bg-muted" /><div className="h-80 rounded-2xl bg-muted" /></div></div></div>;
  }

  return (
    <div>
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl font-bold md:text-5xl">Men's Collection</h1>
            <p className="mt-2 text-muted-foreground">Premium menswear crafted for the modern gentleman</p>
          </motion.div>
        </div>
      </div>

      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{products.length} products</p>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none rounded-xl border border-border bg-background px-4 py-2 pr-8 text-sm focus:border-gold-500 focus:outline-none">
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No products found</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product: any, i: number) => {
              const img = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
              return (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group">
                  <Link href={`/product/${product.slug}`}>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                      {img && <img src={img.url} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                      {product.isNewArrival && <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase text-black">New</span>}
                      {product.isOnSale && <span className="absolute left-3 top-3 rounded-full bg-gold-500 px-3 py-1 text-[10px] font-semibold uppercase text-black">Sale</span>}
                      {product.comparePrice && Number(product.comparePrice) > 0 && (
                        <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2 py-1 text-[10px] font-semibold text-white">
                          -{Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)}%
                        </span>
                      )}
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