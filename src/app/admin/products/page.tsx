"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";

const products = [
  { id: "1", name: "Premium Executive Suit", sku: "NF-SUIT-001", price: 18500, stock: 15, status: "Active", category: "Suits", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&q=80" },
  { id: "2", name: "Luxury Cashmere Blend Coat", sku: "NF-COAT-001", price: 32000, stock: 8, status: "Active", category: "Coats", image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=100&q=80" },
  { id: "3", name: "Designer Kurta Shalwar", sku: "NF-KURTA-001", price: 12500, stock: 25, status: "Active", category: "Traditional", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&q=80" },
  { id: "4", name: "Italian Leather Loafers", sku: "NF-SHOE-001", price: 15800, stock: 12, status: "Active", category: "Accessories", image: "https://images.unsplash.com/photo-1531310197839-ccf546a09c7f?w=100&q=80" },
  { id: "5", name: "Silk Evening Gown", sku: "NF-GOWN-001", price: 28000, stock: 5, status: "Draft", category: "Designer", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=100&q=80" },
  { id: "6", name: "Handcrafted Leather Bag", sku: "NF-BAG-001", price: 22500, stock: 10, status: "Active", category: "Accessories", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&q=80" },
];

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your product catalog</p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: "Total Products", value: "456", change: "+12 this month" },
          { label: "Active", value: "423", change: "92.8%" },
          { label: "Low Stock", value: "8", change: "Needs attention" },
          { label: "Drafts", value: "25", change: "Not published" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-gold-500 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-gold-500 focus:outline-none"
          />
        </div>
        <select className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none">
          <option>All Categories</option>
          <option>Suits</option>
          <option>Casual</option>
          <option>Traditional</option>
          <option>Accessories</option>
        </select>
        <select className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none">
          <option>All Status</option>
          <option>Active</option>
          <option>Draft</option>
          <option>Archived</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">SKU</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        <img src={product.image} alt="" className="h-full w-full object-cover" />
                      </div>
                      <span className="text-sm font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{product.sku}</td>
                  <td className="py-3 px-4"><span className="rounded-full bg-gold-500/10 px-3 py-1 text-xs text-gold-500">{product.category}</span></td>
                  <td className="py-3 px-4 text-right text-sm font-medium">₹{product.price.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-sm font-medium ${product.stock < 10 ? "text-destructive" : "text-green-500"}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      product.status === "Active" ? "bg-green-500/20 text-green-500" :
                      product.status === "Draft" ? "bg-yellow-500/20 text-yellow-500" :
                      "bg-muted text-muted-foreground"
                    }`}>{product.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><Eye className="h-4 w-4" /></button>
                      <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><Edit className="h-4 w-4" /></button>
                      <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}