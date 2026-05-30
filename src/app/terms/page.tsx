"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Terms & Conditions</h1>
        <p className="mt-4 text-muted-foreground">Last updated: January 2024</p>
      </motion.div>
      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        {[
          { title: "General", content: "By accessing and using NEXTFITT, you agree to these terms. If you do not agree, please do not use our services." },
          { title: "Products & Pricing", content: "We strive to display accurate product descriptions and pricing. Prices are subject to change without notice. We reserve the right to modify or discontinue products." },
          { title: "Orders", content: "All orders are subject to availability and confirmation. We reserve the right to cancel orders if fraud or unauthorized transactions are suspected." },
          { title: "Payment", content: "Payment must be received before order processing. We accept Cash on Delivery, Credit/Debit Cards, EasyPaisa, and JazzCash." },
          { title: "Intellectual Property", content: "All content on NEXTFITT, including logos, designs, and product images, is our intellectual property and may not be used without permission." },
          { title: "Limitation of Liability", content: "NEXTFITT shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services." },
        ].map((section, i) => (
          <motion.div key={section.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <h2 className="text-base font-semibold text-foreground mb-2">{section.title}</h2>
            <p>{section.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}