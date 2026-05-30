"use client";

import { motion } from "framer-motion";
import { Truck, RotateCcw, Shield, Clock } from "lucide-react";

export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Shipping & Returns</h1>
        <p className="mt-4 text-lg text-muted-foreground">Everything you need to know about delivery and returns</p>
      </motion.div>
      <div className="space-y-8">
        {[
          { icon: Truck, title: "Shipping Policy", items: ["Free shipping on orders over ₹5,000", "Standard delivery: 3-5 business days", "Express delivery: 1-2 business days (additional charges apply)", "We ship to all cities across Pakistan"] },
          { icon: RotateCcw, title: "Return Policy", items: ["30-day return window from delivery date", "Items must be unworn with original tags", "Free returns on defective or wrong items", "Refund processed within 5-7 business days"] },
          { icon: Shield, title: "Quality Guarantee", items: ["All products are quality inspected before shipping", "Premium materials and craftsmanship guaranteed", "Exchange available for size issues"] },
          { icon: Clock, title: "Processing Time", items: ["Orders processed within 24 hours", "Custom orders may take 3-5 days", "Eid/Seasonal orders may have extended processing"] },
        ].map((section, i) => (
          <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-gold-500/10 p-3"><section.icon className="h-5 w-5 text-gold-500" /></div>
              <h2 className="text-xl font-semibold">{section.title}</h2>
            </div>
            <ul className="space-y-2">
              {section.items.map((item, j) => (
                <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gold-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}