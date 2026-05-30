"use client";

import { motion } from "framer-motion";
import { Search, Package } from "lucide-react";
import { useState, useEffect } from "react";

export default function OrderTrackingPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/api/pages?page=order-tracking")
      .then((res) => res.json())
      .then((data) => { if (data?.content) setContent(data.content); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !content) {
    return <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8"><div className="animate-pulse space-y-4"><div className="h-12 w-64 rounded bg-muted mx-auto" /><div className="h-6 w-96 rounded bg-muted mx-auto" /></div></div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="mx-auto mb-6 rounded-full bg-gold-500/10 p-4 w-fit">
          <Package className="h-8 w-8 text-gold-500" />
        </div>
        <h1 className="font-display text-4xl font-bold md:text-5xl">{content.title || "Order Tracking"}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{content.subtitle}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border bg-card p-8">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Order Number</label>
            <input type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="e.g. NF-2024-001" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none" />
          </div>
          <button className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
            <Search className="h-4 w-4" /> Track Order
          </button>
        </div>
      </motion.div>
    </div>
  );
}