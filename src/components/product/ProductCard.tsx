"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { useWishlistStore, useUIStore } from "@/store";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    images: { url: string; alt: string | null; isPrimary: boolean }[];
    rating: number;
    reviewCount: number;
    isNewArrival: boolean;
    isOnSale: boolean;
    quantity: number;
  };
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { toggleItem, hasItem } = useWishlistStore();
  const { setQuickViewOpen } = useUIStore();
  const discount = product.comparePrice
    ? calculateDiscount(product.price, product.comparePrice)
    : 0;
  const isOutOfStock = product.quantity === 0;

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const secondaryImage = product.images.length > 1 ? product.images[1] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative"
    >
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
          {/* Primary Image */}
          <div className="product-image-zoom h-full w-full">
            <img
              src={primaryImage?.url || "/placeholder.svg"}
              alt={primaryImage?.alt || product.name}
              className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
              loading="lazy"
            />
            {secondaryImage && (
              <img
                src={secondaryImage.url}
                alt={secondaryImage.alt || product.name}
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                loading="lazy"
              />
            )}
          </div>

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.isNewArrival && (
              <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-black backdrop-blur-sm">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-gold-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-black">
                -{discount}%
              </span>
            )}
            {isOutOfStock && (
              <span className="rounded-full bg-destructive/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                Out of Stock
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleItem(product.id);
              }}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-colors",
                hasItem(product.id)
                  ? "bg-gold-500 text-black"
                  : "bg-white/80 text-foreground hover:bg-white"
              )}
              aria-label={hasItem(product.id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className="h-4 w-4" fill={hasItem(product.id) ? "currentColor" : "none"} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setQuickViewOpen(true, product.id);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-foreground backdrop-blur-sm transition-colors hover:bg-white"
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          {/* Add to Cart Overlay */}
          {!isOutOfStock && (
            <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Add to cart logic
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 py-3 text-sm font-semibold text-black transition-colors hover:bg-gold-600"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-4 space-y-1 px-1">
        <Link
          href={`/product/${product.slug}`}
          className="block text-sm font-medium transition-colors hover:text-gold-500"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
        {product.rating > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < Math.round(product.rating)
                      ? "text-gold-500"
                      : "text-muted-foreground/30"
                  )}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}