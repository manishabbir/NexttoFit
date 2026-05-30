"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function SizeGuidePage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pages?page=size-guide")
      .then((res) => res.json())
      .then((data) => { if (data?.content) setContent(data.content); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !content) {
    return <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"><div className="animate-pulse space-y-4"><div className="h-12 w-64 rounded bg-muted mx-auto" /><div className="h-6 w-96 rounded bg-muted mx-auto" /></div></div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold md:text-5xl">{content.title || "Size Guide"}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{content.subtitle}</p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="prose prose-invert max-w-none">
        <div
          className="text-sm leading-relaxed text-muted-foreground [&_h3]:text-foreground [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:p-3 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold [&_td]:border [&_td]:border-border [&_td]:p-3 [&_td]:text-sm [&_p]:mb-4"
          dangerouslySetInnerHTML={{ __html: content.content || "<p>Size guide content coming soon.</p>" }}
        />
      </motion.div>
    </div>
  );
}