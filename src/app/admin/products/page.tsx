"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Eye, Star, StarOff } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface ProductImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  comparePrice?: number | null;
  quantity: number;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isOnSale: boolean;
  images: ProductImage[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (product: Product) => {
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, isFeatured: !product.isFeatured }),
      });
      if (res.ok) {
        toast.success(product.isFeatured ? "Removed from featured" : "Added to featured");
        fetchProducts();
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredCount = products.filter((p) => p.isFeatured).length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-96 rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your product catalog from Supabase</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: "Total Products", value: products.length.toString(), change: "In catalog" },
          { label: "Featured", value: featuredCount.toString(), change: "On homepage" },
          { label: "Active", value: products.filter((p) => p.isActive).length.toString(), change: "Visible" },
          { label: "On Sale", value: products.filter((p) => p.isOnSale).length.toString(), change: "Discounted" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-gold-500 mt-0.5">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
        />
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-16 text-center">
          <p className="text-lg font-semibold mb-2">No products yet</p>
          <p className="text-sm text-muted-foreground mb-4">Run `npx prisma db seed` to populate products, or add via API</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((product, i) => {
            const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-2xl border border-border bg-card p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                    {primaryImage && (
                      <img src={primaryImage.url} alt={product.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      {product.isFeatured && (
                        <span className="rounded-full bg-gold-500/20 px-2 py-0.5 text-[10px] font-medium text-gold-500">Featured</span>
                      )}
                      {product.isNewArrival && (
                        <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-medium text-blue-500">New</span>
                      )}
                      {product.isOnSale && (
                        <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-medium text-red-500">Sale</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">SKU: {product.sku}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-semibold">Rs.{Number(product.price).toLocaleString()}</span>
                      {product.comparePrice && (
                        <span className="text-xs text-muted-foreground line-through">Rs.{Number(product.comparePrice).toLocaleString()}</span>
                      )}
                      <span className="text-xs text-muted-foreground">Stock: {product.quantity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFeatured(product)}
                      className={`rounded-lg p-2 transition-colors ${product.isFeatured ? "text-gold-500 hover:bg-gold-500/10" : "text-muted-foreground hover:bg-muted"}`}
                      title={product.isFeatured ? "Remove from featured" : "Add to featured"}
                    >
                      {product.isFeatured ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
                    </button>
                    <Link
                      href={`/product/${product.slug}`}
                      target="_blank"
                      className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}