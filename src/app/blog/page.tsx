"use client";

import { motion } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";

const posts = [
  { title: "The Ultimate Guide to Men's Formal Wear", slug: "ultimate-guide-mens-formal-wear", excerpt: "Everything you need to know about dressing sharp for formal occasions in 2024.", author: "NEXTFITT Style Team", date: "Jan 15, 2024", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80", tags: ["Men", "Formal", "Style Guide"] },
  { title: "Summer Fashion Trends 2024: What's Hot", slug: "summer-fashion-trends-2024", excerpt: "Discover the hottest trends shaping summer fashion this year.", author: "NEXTFITT Style Team", date: "Jan 10, 2024", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80", tags: ["Trends", "Summer", "Fashion"] },
  { title: "How to Style Your Kurta for Any Occasion", slug: "how-to-style-kurta", excerpt: "Tips and tricks to style your kurta for casual, formal, and festive events.", author: "NEXTFITT Style Team", date: "Jan 5, 2024", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80", tags: ["Traditional", "Styling"] },
  { title: "The Art of Accessorizing: Complete Guide", slug: "art-of-accessorizing", excerpt: "Learn how to elevate any outfit with the right accessories.", author: "NEXTFITT Style Team", date: "Dec 28, 2023", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80", tags: ["Accessories", "Style Guide"] },
  { title: "Wedding Season: Best Outfits for Every Event", slug: "wedding-season-outfits", excerpt: "From mehndi to walima, find the perfect outfit for every wedding event.", author: "NEXTFITT Style Team", date: "Dec 20, 2023", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80", tags: ["Wedding", "Eastern Wear"] },
  { title: "Sustainable Fashion: Quality Over Quantity", slug: "sustainable-fashion", excerpt: "Why investing in premium quality pieces is better for your wardrobe and the planet.", author: "NEXTFITT Style Team", date: "Dec 15, 2023", image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80", tags: ["Sustainability", "Fashion"] },
];

export default function BlogPage() {
  return (
    <div>
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl font-bold md:text-5xl">Journal</h1>
            <p className="mt-4 text-lg text-muted-foreground">Style guides, trends, and fashion stories</p>
          </motion.div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <motion.article key={post.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group rounded-2xl border border-border bg-card overflow-hidden">
              <Link href={`/blog/${post.slug}`}>
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
              </Link>
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                  <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-lg font-semibold transition-colors group-hover:text-gold-500">{post.title}</h2>
                </Link>
                <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-gold-500/10 px-3 py-1 text-xs text-gold-500">{tag}</span>
                  ))}
                </div>
                <Link href={`/blog/${post.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold-500 hover:text-gold-400 transition-colors">
                  Read More <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}