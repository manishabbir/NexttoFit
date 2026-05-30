"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function FAQsPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/pages?page=faqs")
      .then((res) => res.json())
      .then((data) => { if (data?.content) setContent(data.content); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !content) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4"><div className="h-12 w-48 rounded bg-muted mx-auto" /><div className="h-6 w-64 rounded bg-muted mx-auto" /></div>
      </div>
    );
  }

  const questions = content.questions || [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold md:text-5xl">{content.title || "FAQs"}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{content.subtitle}</p>
      </motion.div>
      <div className="space-y-3">
        {questions.map((faq: any, i: number) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border bg-card overflow-hidden">
            <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-muted/50">
              <span className="text-sm font-medium">{faq.question}</span>
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", openIndex === i && "rotate-180")} />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-5">
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}