"use client";

import { motion } from "framer-motion";
import { Truck, RotateCcw, Shield, Clock } from "lucide-react";
import { useState, useEffect } from "react";

const iconMap: Record<string, React.ElementType> = { Truck, RotateCcw, Shield, Clock };

export default function ShippingReturnsPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pages?page=shipping-returns")
      .then((res) => res.json())
      .then((data) => { if (data?.content) setContent(data.content); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !content) {
    return <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"><div className="animate-pulse space-y-4"><div className="h-12 w-64 rounded bg-muted mx-auto" /><div className="h-6 w-96 rounded bg-muted mx-auto" /></div></div>;
  }

  const sections = content.sections || [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold md:text-5xl">{content.title || "Shipping & Returns"}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{content.subtitle}</p>
      </motion.div>
      <div className="space-y-8">
        {sections.map((section: any, i: number) => {
          const Icon = iconMap[section.icon as string] || Shield;
          const items = Array.isArray(section.items) ? section.items : [];
          return (
            <motion.div key={section.title || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-gold-500/10 p-3"><Icon className="h-5 w-5 text-gold-500" /></div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
              </div>
              <ul className="space-y-2">
                {items.map((item: string, j: number) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gold-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}