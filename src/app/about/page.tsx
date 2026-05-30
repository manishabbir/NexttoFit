"use client";

import { motion } from "framer-motion";
import { Shield, Sparkles, Heart, Users } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const iconMap: Record<string, React.ElementType> = { Shield, Sparkles, Heart, Users };

export default function AboutPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pages?page=about")
      .then((res) => res.json())
      .then((data) => {
        if (data?.content) setContent(data.content);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !content) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4"><div className="h-12 w-64 rounded bg-muted mx-auto" /><div className="h-6 w-96 rounded bg-muted mx-auto" /></div>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-5xl font-bold md:text-7xl">{content.title || "Our Story"}</h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">{content.subtitle}</p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {(content.features || []).map((item: any, i: number) => {
            const Icon = iconMap[item.icon as string] || Users;
            return (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-border bg-card p-6 text-center">
                <div className="mx-auto rounded-xl bg-gold-500/10 p-4 w-fit"><Icon className="h-6 w-6 text-gold-500" /></div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            );
          })}
        </div>

        {content.cta && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-16 rounded-2xl border border-border bg-card p-8 md:p-12 text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">{content.cta.title}</h2>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto">{content.cta.description}</p>
            <Link href={content.cta.buttonLink || "/men"} className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
              {content.cta.buttonText || "Shop Now"}
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}