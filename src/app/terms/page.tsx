"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function TermsPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pages?page=terms")
      .then((res) => res.json())
      .then((data) => { if (data?.content) setContent(data.content); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !content) {
    return <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8"><div className="animate-pulse space-y-4"><div className="h-12 w-64 rounded bg-muted" /><div className="h-6 w-96 rounded bg-muted" /></div></div>;
  }

  const sections = content.sections || [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="font-display text-4xl font-bold md:text-5xl">{content.title || "Terms & Conditions"}</h1>
        <p className="mt-4 text-muted-foreground">{content.subtitle}</p>
      </motion.div>
      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        {sections.map((section: any, i: number) => (
          <motion.div key={section.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <h2 className="text-base font-semibold text-foreground mb-2">{section.title}</h2>
            <p>{section.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}