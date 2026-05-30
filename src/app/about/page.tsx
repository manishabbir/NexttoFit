"use client";

import { motion } from "framer-motion";
import { Shield, Sparkles, Heart, Users } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-5xl font-bold md:text-7xl">Our Story</h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              NEXTFITT is a premium fashion brand dedicated to redefining style for the modern individual. 
              We blend contemporary design with timeless craftsmanship.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Sparkles, title: "Premium Quality", desc: "Handpicked fabrics and materials ensuring the highest standards of craftsmanship." },
            { icon: Shield, title: "Authentic Designs", desc: "Original designs created by our in-house team of fashion experts." },
            { icon: Heart, title: "Customer First", desc: "Your satisfaction is our priority. We're here to help every step of the way." },
            { icon: Users, title: "Community", desc: "Join thousands of satisfied customers who trust NEXTFITT for their style." },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="mx-auto rounded-xl bg-gold-500/10 p-4 w-fit"><item.icon className="h-6 w-6 text-gold-500" /></div>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-16 rounded-2xl border border-border bg-card p-8 md:p-12 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Ready to Elevate Your Style?</h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">Explore our collections and discover fashion that speaks to you.</p>
          <Link href="/men" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
            Shop Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
}