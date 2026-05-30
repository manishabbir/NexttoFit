"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, ChevronRight } from "lucide-react";

const posts = [
  { slug: "ultimate-guide-mens-formal-wear", title: "The Ultimate Guide to Men's Formal Wear", content: "Dressing sharp for formal occasions is an art that every gentleman should master. Whether it's a business meeting, a wedding, or a black-tie event, knowing how to dress appropriately can make all the difference.\n\n## Choose the Right Suit\nThe foundation of any formal look is a well-fitted suit. At NEXTFITT, we recommend investing in a classic navy or charcoal suit as your first purchase. These colors are versatile and appropriate for almost any formal occasion.\n\n## Fabric Matters\nFor formal wear, wool and wool blends are your best friends. They breathe well, drape beautifully, and resist wrinkles. Our Premium Executive Suit uses an Italian wool blend that provides both comfort and elegance.\n\n## The Perfect Fit\nA suit should fit comfortably without being too tight or too loose. The shoulders should align with your natural shoulder line, the jacket should button easily without pulling, and the trousers should have a slight break at the shoe.\n\n## Accessories Complete the Look\nDon't forget the details. A quality leather belt, polished dress shoes, and a tie that complements your suit can elevate your entire appearance.", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=80", author: "NEXTFITT Style Team", date: "Jan 15, 2024", tags: ["Men", "Formal", "Style Guide"] },
  { slug: "summer-fashion-trends-2024", title: "Summer Fashion Trends 2024: What's Hot", content: "Summer 2024 is all about bold colors, lightweight fabrics, and effortless style. Here's what's trending this season.\n\n## Lightweight Linens\nLinen continues to dominate summer fashion. Its breathable nature makes it perfect for Pakistan's hot climate. Look for linen shirts, trousers, and even suits for a sophisticated summer look.\n\n## Pastel Revolution\nSoft pastels like mint green, powder blue, and blush pink are everywhere this season. These colors add a fresh, modern touch to any outfit and pair beautifully with neutrals.\n\n## Statement Accessories\nThis summer, accessories are taking center stage. Think chunky watches, woven belts, and straw bags. These pieces add personality to even the simplest outfits.\n\n## Sustainable Fashion\nThe trend towards sustainable and ethical fashion continues to grow. Investing in quality pieces that last longer is not just good for the planet—it's good for your wardrobe too.", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80", author: "NEXTFITT Style Team", date: "Jan 10, 2024", tags: ["Trends", "Summer", "Fashion"] },
];

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <Link href="/blog" className="mt-4 inline-block text-gold-500 hover:text-gold-400">Back to Journal</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Journal
      </Link>
      <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="aspect-[2/1] overflow-hidden rounded-3xl mb-8">
          <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {post.date}</span>
          <span className="flex items-center gap-1"><User className="h-4 w-4" /> {post.author}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-gold-500/10 px-3 py-1 text-xs text-gold-500">{tag}</span>
          ))}
        </div>
        <h1 className="font-display text-3xl font-bold md:text-4xl">{post.title}</h1>
        <div className="mt-8 prose prose-invert max-w-none">
          {post.content.split("\n\n").map((paragraph, i) => {
            if (paragraph.startsWith("## ")) {
              return <h2 key={i} className="text-xl font-semibold mt-8 mb-4">{paragraph.replace("## ", "")}</h2>;
            }
            return <p key={i} className="text-muted-foreground leading-relaxed mb-4">{paragraph}</p>;
          })}
        </div>
      </motion.article>
    </div>
  );
}