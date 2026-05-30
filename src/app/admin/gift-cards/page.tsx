"use client";

import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Gift, Copy, Check } from "lucide-react";
import { useState } from "react";

const cards = [
  { id: "1", code: "GIFT-NF-2024", amount: 5000, used: 45, total: 100, status: "Active", created: "Jan 1, 2024" },
  { id: "2", code: "GIFT-WELCOME", amount: 2000, used: 128, total: 200, status: "Active", created: "Jan 5, 2024" },
  { id: "3", code: "GIFT-EID24", amount: 10000, used: 32, total: 50, status: "Active", created: "Mar 1, 2024" },
  { id: "4", code: "GIFT-VIP50", amount: 25000, used: 5, total: 20, status: "Active", created: "Jan 10, 2024" },
  { id: "5", code: "GIFT-OLD23", amount: 3000, used: 200, total: 200, status: "Expired", created: "Jan 1, 2023" },
];

export default function AdminGiftCardsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gift Cards</h1>
          <p className="text-sm text-muted-foreground">Manage gift cards and codes</p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
          <Plus className="h-4 w-4" /> Create Gift Card
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: "Total Cards", value: "5", change: "+2 this month" },
          { label: "Active", value: "4", change: "Available" },
          { label: "Total Value", value: "₹2,50,000", change: "In circulation" },
          { label: "Redeemed", value: "₹1,85,000", change: "74% redeemed" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-gold-500 mt-0.5">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Code</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Amount</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Usage</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Created</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((card, i) => (
                <motion.tr key={card.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-gold-500/10 p-2"><Gift className="h-4 w-4 text-gold-500" /></div>
                      <div>
                        <p className="text-sm font-mono font-bold">{card.code}</p>
                        <button onClick={() => copyCode(card.code, card.id)} className="flex items-center gap-1 text-xs text-gold-500 hover:text-gold-400 transition-colors">
                          {copiedId === card.id ? <><Check className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-semibold">₹{card.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-sm">{card.used}/{card.total}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${card.status === "Active" ? "bg-green-500/20 text-green-500" : "bg-destructive/20 text-destructive"}`}>{card.status}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-muted-foreground">{card.created}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Edit className="h-4 w-4" /></button>
                      <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
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