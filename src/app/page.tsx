"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Truck, RotateCcw } from "lucide-react";

// Mock data for featured products
const featuredProducts = [
  {
    id: "1",
    name: "Premium Executive Suit",
    slug: "premium-executive-suit",
    price: 18500,
    comparePrice: 25000,
    images: [
      { url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80", alt: "Premium Executive Suit Front", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80", alt: "Premium Executive Suit Side", isPrimary: false },
    ],
    rating: 4.8,
    reviewCount: 124,
    isNewArrival: false,
    isOnSale: true,
    quantity: 15,
  },
  {
    id: "2",
    name: "Luxury Cashmere Blend Coat",
    slug: "luxury-cashmere-blend-coat",
    price: 32000,
    comparePrice: 42000,
    images: [
      { url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80", alt: "Luxury Coat Front", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", alt: "Luxury Coat Side", isPrimary: false },
    ],
    rating: 4.9,
    reviewCount: 89,
    isNewArrival: true,
    isOnSale: true,
    quantity: 8,
  },
  {
    id: "3",
    name: "Designer Kurta Shalwar",
    slug: "designer-kurta-shalwar",
    price: 12500,
    comparePrice: null,
    images: [
      { url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80", alt: "Designer Kurta Front", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80", alt: "Designer Kurta Detail", isPrimary: false },
    ],
    rating: 4.7,
    reviewCount: 256,
    isNewArrival: true,
    isOnSale: false,
    quantity: 25,
  },
  {
    id: "4",
    name: "Italian Leather Loafers",
    slug: "italian-leather-loafers",
    price: 15800,
    comparePrice: 19500,
    images: [
      { url: "https://images.unsplash.com/photo-1531310197839-ccf546a09c7f?w=600&q=80", alt: "Italian Loafers Top", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80", alt: "Italian Loafers Side", isPrimary: false },
    ],
    rating: 4.6,
    reviewCount: 67,
    isNewArrival: false,
    isOnSale: true,
    quantity: 12,
  },
  {
    id: "5",
    name: "Silk Evening Gown",
    slug: "silk-evening-gown",
    price: 28000,
    comparePrice: null,
    images: [
      { url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80", alt: "Silk Gown Front", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80", alt: "Silk Gown Back", isPrimary: false },
    ],
    rating: 4.9,
    reviewCount: 43,
    isNewArrival: true,
    isOnSale: false,
    quantity: 5,
  },
  {
    id: "6",
    name: "Handcrafted Leather Bag",
    slug: "handcrafted-leather-bag",
    price: 22500,
    comparePrice: 28000,
    images: [
      { url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80", alt: "Leather Bag Front", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80", alt: "Leather Bag Side", isPrimary: false },
    ],
    rating: 4.7,
    reviewCount: 91,
    isNewArrival: false,
    isOnSale: true,
    quantity: 10,
  },
];

const categories = [
  {
    name: "Men's Collection",
    href: "/men",
    image: "https://images.unsplash.com/photo-1617137968427-8590be9b1ca9?w=800&q=80",
    count: "248 Products",
  },
  {
    name: "Women's Collection",
    href: "/women",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
    count: "312 Products",
  },
  {
    name: "Accessories",
    href: "/men?category=accessories",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
    count: "156 Products",
  },
];

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over ₹5,000",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure checkout",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: Sparkles,
    title: "Premium Quality",
    description: "Handcrafted with care",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Features Bar */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10">
                  <feature.icon className="h-5 w-5 text-gold-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-gold-500">
                Premium Collection
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
                Featured Products
              </h2>
            </div>
            <Link
              href="/new-arrivals"
              className="hidden items-center gap-2 text-sm font-medium text-gold-500 transition-colors hover:text-gold-400 md:flex"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {featuredProducts.slice(0, 4).map((product, index) => (
              <div key={product.id} className="group relative">
                <Link href={`/product/${product.slug}`}>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                      <span className="block text-sm font-medium text-white">
                        Quick View
                      </span>
                    </div>
                    {product.isNewArrival && (
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase text-black backdrop-blur-sm">
                        New
                      </span>
                    )}
                    {product.isOnSale && (
                      <span className="absolute left-3 top-3 rounded-full bg-gold-500 px-3 py-1 text-[10px] font-semibold uppercase text-black backdrop-blur-sm">
                        Sale
                      </span>
                    )}
                  </div>
                </Link>
                <div className="mt-4 space-y-1">
                  <Link
                    href={`/product/${product.slug}`}
                    className="block text-sm font-medium transition-colors hover:text-gold-500"
                  >
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">₹{product.price.toLocaleString()}</span>
                    {product.comparePrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{product.comparePrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/new-arrivals"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              View All Products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-16 md:py-24 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-gold-500">
              Shop by
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
              Categories
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={category.href} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <h3 className="font-display text-2xl font-bold text-white md:text-3xl">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-sm text-white/60">{category.count}</p>
                      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-gold-500 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                        Shop Now <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80"
            alt="Luxury fashion"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-lg"
          >
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-gold-500">
              Limited Edition
            </span>
            <h2 className="mt-4 font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Summer Collection
              <br />
              <span className="text-gradient-gold">2024</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              Embrace the season with our curated summer collection. Lightweight fabrics, 
              vibrant colors, and impeccable designs for the style-conscious.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/new-arrivals"
                className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-sm font-semibold text-black transition-all hover:bg-gold-600"
              >
                Explore Collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sale"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                View Sale
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bestsellers Grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-gold-500">
                Best Sellers
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
                Most Popular
              </h2>
            </div>
            <Link
              href="/men"
              className="hidden items-center gap-2 text-sm font-medium text-gold-500 transition-colors hover:text-gold-400 md:flex"
            >
              Shop All <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {featuredProducts.slice(2, 6).map((product, index) => (
              <div key={product.id} className="group relative">
                <Link href={`/product/${product.slug}`}>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {product.isNewArrival && (
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase text-black backdrop-blur-sm">
                        New
                      </span>
                    )}
                    {product.isOnSale && (
                      <span className="absolute left-3 top-3 rounded-full bg-gold-500 px-3 py-1 text-[10px] font-semibold uppercase text-black backdrop-blur-sm">
                        Sale
                      </span>
                    )}
                  </div>
                </Link>
                <div className="mt-4 space-y-1">
                  <Link
                    href={`/product/${product.slug}`}
                    className="block text-sm font-medium transition-colors hover:text-gold-500"
                  >
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">₹{product.price.toLocaleString()}</span>
                    {product.comparePrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{product.comparePrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram / Social Proof */}
      <section className="py-16 md:py-24 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-gold-500">
              Follow Us
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
              @nextfitt
            </h2>
            <p className="mt-2 text-muted-foreground">
              Tag us in your looks for a chance to be featured
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {[
              "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80",
              "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
              "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&q=80",
              "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&q=80",
            ].map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer"
              >
                <img
                  src={img}
                  alt="Social media post"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-medium text-sm">Shop the Look</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}