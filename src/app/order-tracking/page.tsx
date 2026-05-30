"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

const mockOrders = [
  { number: "NF-A1B2C3", status: "Delivered", date: "Jan 15, 2024", items: 2, total: "₹18,500", timeline: [
    { label: "Order Placed", date: "Jan 10, 2024", done: true },
    { label: "Processing", date: "Jan 11, 2024", done: true },
    { label: "Shipped", date: "Jan 13, 2024", done: true },
    { label: "Delivered", date: "Jan 15, 2024", done: true },
  ]},
  { number: "NF-D4E5F6", status: "Shipped", date: "Jan 20, 2024", items: 1, total: "₹32,000", timeline: [
    { label: "Order Placed", date: "Jan 17, 2024", done: true },
    { label: "Processing", date: "Jan 18, 2024", done: true },
    { label: "Shipped", date: "Jan 20, 2024", done: true },
    { label: "Delivered", date: "Estimated Jan 24", done: false },
  ]},
];

const statusIcons: Record<string, React.ReactNode> = {
  Delivered: <CheckCircle className="h-5 w-5 text-green-500" />,
  Shipped: <Truck className="h-5 w-5 text-gold-500" />,
  Processing: <Package className="h-5 w-5 text-blue-500" />,
  Pending: <Clock className="h-5 w-5 text-yellow-500" />,
};

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Track Your Order</h1>
        <p className="mt-4 text-muted-foreground">Enter your order number to track your shipment</p>
      </motion.div>

      <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} onSubmit={handleSearch} className="flex gap-3 max-w-xl mx-auto mb-12">
        <input type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="Enter order number (e.g. NF-A1B2C3)" className="flex-1 rounded-xl border border-border bg-background px-5 py-3.5 text-sm focus:border-gold-500 focus:outline-none" />
        <button type="submit" className="rounded-xl bg-gold-500 px-6 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600 flex items-center gap-2">
          <Search className="h-4 w-4" /> Track
        </button>
      </motion.form>

      {searched && orderNumber && (
        <div className="space-y-6">
          {mockOrders.filter(o => o.number.toLowerCase().includes(orderNumber.toLowerCase()) || orderNumber === "").length > 0 ? (
            mockOrders.filter(o => o.number.toLowerCase().includes(orderNumber.toLowerCase()) || orderNumber === "").map((order, i) => (
              <motion.div key={order.number} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Number</p>
                    <p className="text-lg font-bold">{order.number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      {statusIcons[order.status]}
                      <span className={`text-sm font-semibold ${order.status === "Delivered" ? "text-green-500" : order.status === "Shipped" ? "text-gold-500" : ""}`}>{order.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
                  <span>Ordered: {order.date}</span>
                  <span>Items: {order.items}</span>
                  <span className="font-semibold text-foreground">{order.total}</span>
                </div>
                <div className="space-y-4">
                  {order.timeline.map((step, j) => (
                    <div key={step.label} className="flex items-start gap-4">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        step.done ? "bg-gold-500/20 text-gold-500" : "bg-muted text-muted-foreground"
                      }`}>
                        <div className={`h-2.5 w-2.5 rounded-full ${step.done ? "bg-gold-500" : "bg-muted-foreground"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${step.done ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                        <p className="text-xs text-muted-foreground">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground/50 mx-auto" />
              <h2 className="mt-4 text-xl font-semibold">Order Not Found</h2>
              <p className="mt-2 text-muted-foreground">No order found with number "{orderNumber}"</p>
              <p className="text-sm text-muted-foreground mt-1">Try: NF-A1B2C3 or NF-D4E5F6</p>
            </motion.div>
          )}
        </div>
      )}

      {!searched && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <Truck className="h-16 w-16 text-muted-foreground/50 mx-auto" />
          <p className="mt-4 text-muted-foreground">Enter your order number above to track your shipment</p>
        </motion.div>
      )}
    </div>
  );
}