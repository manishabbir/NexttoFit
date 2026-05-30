"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "What is your shipping policy?", a: "We offer free shipping on orders over ₹5,000. Standard delivery takes 3-5 business days within Pakistan. Express shipping (1-2 days) is available at an additional cost." },
  { q: "How can I track my order?", a: "Once your order is shipped, you'll receive a tracking number via email and SMS. You can track your order on our Order Tracking page." },
  { q: "What is your return policy?", a: "We offer a 30-day return policy for unworn items in original condition. Refunds are processed within 5-7 business days after we receive the return." },
  { q: "How do I find my size?", a: "Check our Size Guide page for detailed measurements. You can also contact our customer service for personalized sizing advice." },
  { q: "Do you ship internationally?", a: "Currently we ship within Pakistan only. International shipping will be available soon, In Sha Allah." },
  { q: "What payment methods do you accept?", a: "We accept Cash on Delivery, Credit/Debit Cards, EasyPaisa, and JazzCash." },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold md:text-5xl">FAQs</h1>
        <p className="mt-4 text-lg text-muted-foreground">Frequently asked questions</p>
      </motion.div>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border bg-card overflow-hidden">
            <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-muted/50">
              <span className="text-sm font-medium">{faq.q}</span>
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", openIndex === i && "rotate-180")} />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-5">
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}