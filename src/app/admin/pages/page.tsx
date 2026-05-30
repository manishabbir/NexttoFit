"use client";

import { motion } from "framer-motion";
import { Edit, Eye, Layers, Search, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const staticPages = [
  { name: "Home Page", route: "/", status: "Published", lastEdited: "Jan 15, 2024", type: "main" },
  { name: "About Us", route: "/about", status: "Published", lastEdited: "Jan 14, 2024", type: "content" },
  { name: "Contact Us", route: "/contact", status: "Published", lastEdited: "Jan 14, 2024", type: "content" },
  { name: "FAQs", route: "/faqs", status: "Published", lastEdited: "Jan 13, 2024", type: "content" },
  { name: "Shipping & Returns", route: "/shipping-returns", status: "Published", lastEdited: "Jan 12, 2024", type: "content" },
  { name: "Privacy Policy", route: "/privacy", status: "Published", lastEdited: "Jan 10, 2024", type: "legal" },
  { name: "Terms & Conditions", route: "/terms", status: "Published", lastEdited: "Jan 10, 2024", type: "legal" },
  { name: "Size Guide", route: "/size-guide", status: "Published", lastEdited: "Jan 8, 2024", type: "content" },
  { name: "Order Tracking", route: "/order-tracking", status: "Published", lastEdited: "Jan 8, 2024", type: "feature" },
  { name: "Gift Cards", route: "/gift-cards", status: "Published", lastEdited: "Jan 7, 2024", type: "feature" },
  { name: "Careers", route: "/careers", status: "Published", lastEdited: "Jan 5, 2024", type: "content" },
  { name: "Blog", route: "/blog", status: "Published", lastEdited: "Jan 5, 2024", type: "content" },
];

export default function AdminPagesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Pages</h1>
          <p className="text-sm text-muted-foreground">Manage all website pages and content</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: "Total Pages", value: "12", change: "All created" },
          { label: "Published", value: "12", change: "100% live" },
          { label: "Content Pages", value: "8", change: "About, FAQ, etc." },
          { label: "Legal Pages", value: "2", change: "Privacy, Terms" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-gold-500 mt-0.5">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search pages..." className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
        </div>
        {["All", "content", "legal", "feature", "main"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${filter === f ? "bg-gold-500 text-black" : "border border-border text-muted-foreground hover:bg-muted"}`}>
            {f === "All" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {staticPages.filter((p) => filter === "All" || p.type === filter).filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).map((page, i) => (
          <motion.div key={page.route} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-gold-500/10 p-3"><Layers className="h-5 w-5 text-gold-500" /></div>
                <div>
                  <p className="text-sm font-medium">{page.name}</p>
                  <p className="text-xs text-muted-foreground">{page.route}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Last edited: {page.lastEdited}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`flex items-center gap-1 text-xs font-medium ${page.status === "Published" ? "text-green-500" : "text-yellow-500"}`}>
                  {page.status === "Published" ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  {page.status}
                </span>
                <Link href={page.route} target="_blank" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <Eye className="h-4 w-4" />
                </Link>
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}