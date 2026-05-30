"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Copy, Check } from "lucide-react";

const giftCards = [
  { amount: "₹2,000", price: "₹2,000", popular: false },
  { amount: "₹5,000", price: "₹5,000", popular: true },
  { amount: "₹10,000", price: "₹10,000", popular: false },
  { amount: "₹25,000", price: "₹25,000", popular: false },
  { amount: "Custom", price: "Any Amount", popular: false },
];

export default function GiftCardsPage() {
  const [selected, setSelected] = useState("₹5,000");
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText("GIFT-NF-2024");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <Gift className="h-12 w-12 text-gold-500 mx-auto mb-4" />
        <h1 className="font-display text-4xl font-bold md:text-5xl">Gift Cards</h1>
        <p className="mt-4 text-lg text-muted-foreground">The perfect gift for any fashion lover</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-8 max-w-lg mx-auto">
        <div className="aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-gold-500 to-gold-700 p-8 flex flex-col justify-between relative overflow-hidden mb-8">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10" />
          <div>
            <p className="text-white/80 text-sm font-medium">NEXTFITT</p>
            <p className="text-white text-4xl font-bold mt-2">{selected}</p>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-xs">Gift Card</p>
            <p className="text-white font-mono text-sm mt-1">GIFT-NF-2024</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4">Select Amount</h2>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {giftCards.map((card) => (
            <button key={card.amount} onClick={() => setSelected(card.amount)} className={`rounded-xl border p-4 text-center transition-all ${selected === card.amount ? "border-gold-500 bg-gold-500/10" : "border-border hover:border-muted-foreground"} ${card.popular ? "ring-2 ring-gold-500" : ""}`}>
              <p className="font-semibold">{card.amount}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.price}</p>
              {card.popular && <span className="mt-1 inline-block rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-medium text-black">Popular</span>}
            </button>
          ))}
        </div>

        <button className="w-full rounded-full bg-gold-500 py-4 text-sm font-semibold text-black transition-colors hover:bg-gold-600 mb-4">
          Buy Gift Card - {selected}
        </button>

        <div className="flex items-center justify-between rounded-xl bg-muted p-4">
          <div>
            <p className="text-xs text-muted-foreground">Demo Code</p>
            <p className="text-sm font-mono font-medium">GIFT-NF-2024</p>
          </div>
          <button onClick={copyCode} className="rounded-lg bg-gold-500/10 p-2 text-gold-500 hover:bg-gold-500/20 transition-colors">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3">Gift cards are non-refundable and valid for 12 months</p>
      </motion.div>
    </div>
  );
}