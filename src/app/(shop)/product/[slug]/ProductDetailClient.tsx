"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Share2, Star, Minus, Plus } from "lucide-react";
import { useWishlistStore, useCartStore, useUIStore } from "@/store";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface ProductData {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  description: string;
  shortDescription: string | null;
  brand: string;
  sku: string;
  material: string | null;
  careInstructions: string | null;
  rating: number;
  reviewCount: number;
  quantity: number;
  images: { url: string; alt: string }[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  discount: number;
}

export function ProductDetailClient({ product }: { product: ProductData }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.name || ""
  );
  const [quantity, setQuantity] = useState(1);
  const { toggleItem, hasItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const { setCartOpen } = useUIStore();

  const handleAddToCart = () => {
    const cartItem = {
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      comparePrice: product.comparePrice,
      image: product.images[0]?.url || "",
      quantity: quantity,
      size: selectedSize || null,
      color: selectedColor || null,
      variantId: null,
      maxQuantity: product.quantity,
    };
    addItem(cartItem);
    setCartOpen(true);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Images */}
      <div className="space-y-4">
        <motion.div
          key={selectedImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted"
        >
          <img
            src={product.images[selectedImage]?.url || product.images[0]?.url}
            alt={product.images[selectedImage]?.alt || product.name}
            className="h-full w-full object-cover"
          />
          {product.discount > 0 && (
            <span className="absolute left-4 top-4 rounded-full bg-gold-500 px-4 py-2 text-sm font-bold text-black">
              -{product.discount}% OFF
            </span>
          )}
        </motion.div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                i === selectedImage
                  ? "border-gold-500"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-gold-500">
            {product.brand}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">
            {product.name}
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(product.rating)
                      ? "fill-gold-500 text-gold-500"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <>
              <span className="text-xl text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
              <span className="rounded-full bg-gold-500/20 px-3 py-1 text-xs font-semibold text-gold-500">
                Save {product.discount}%
              </span>
            </>
          )}
        </div>

        <p className="text-muted-foreground leading-relaxed">
          {product.description}
        </p>

        {/* Size Selection */}
        {product.sizes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Size</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-lg border px-5 py-3 text-sm font-medium transition-all ${
                    selectedSize === size
                      ? "border-gold-500 bg-gold-500/10 text-gold-500"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Selection */}
        {product.colors.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3">
              Color: {selectedColor}
            </h3>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`h-10 w-10 rounded-full border-2 transition-all ${
                    selectedColor === color.name
                      ? "border-gold-500 scale-110 ring-2 ring-gold-500/30"
                      : "border-border"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  aria-label={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Quantity</h3>
          <div className="flex items-center gap-3 rounded-xl border border-border w-fit">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-[40px] text-center font-medium">
              {quantity}
            </span>
            <button
              onClick={() =>
                setQuantity(Math.min(product.quantity, quantity + 1))
              }
              className="p-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {product.quantity} in stock
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 rounded-full bg-gold-500 px-8 py-4 text-sm font-semibold text-black transition-all hover:bg-gold-600 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="h-5 w-5" />
            Add to Cart - {formatPrice(product.price * quantity)}
          </button>
          <button
            onClick={() => toggleItem(product.id)}
            className={`rounded-full border p-4 transition-all ${
              hasItem(product.id)
                ? "border-gold-500 text-gold-500 bg-gold-500/10"
                : "border-border hover:border-foreground"
            }`}
          >
            <Heart
              className="h-5 w-5"
              fill={hasItem(product.id) ? "currentColor" : "none"}
            />
          </button>
          <button className="rounded-full border border-border p-4 transition-all hover:border-foreground">
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/* Short description if no sizes/colors */}
        {product.shortDescription && (
          <p className="text-sm text-muted-foreground italic">
            {product.shortDescription}
          </p>
        )}
      </div>
    </div>
  );
}