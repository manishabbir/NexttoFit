"use client";

import { motion } from "framer-motion";
import { Search, Mail, Trash2, Eye, Inbox } from "lucide-react";
import { useState } from "react";

const messages = [
  { id: "1", name: "Ahmed Khan", email: "ahmed@example.com", subject: "Order Inquiry", message: "I haven't received my order yet. Can you please check the status?", date: "2 hours ago", read: false },
  { id: "2", name: "Sara Ali", email: "sara@example.com", subject: "Size Exchange", message: "I ordered a size M but it's too small. Can I exchange for size L?", date: "5 hours ago", read: false },
  { id: "3", name: "Usman R.", email: "usman@example.com", subject: "Product Question", message: "Does the Premium Executive Suit come in Navy Blue color?", date: "1 day ago", read: true },
  { id: "4", name: "Fatima Z.", email: "fatima@example.com", subject: "Return Request", message: "I want to return my order NF-004. Please initiate the return process.", date: "2 days ago", read: true },
  { id: "5", name: "Bilal M.", email: "bilal@example.com", subject: "Feedback", message: "Amazing quality! Will definitely order again. The fabric is premium.", date: "3 days ago", read: true },
];

export default function AdminMessagesPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-sm text-muted-foreground">Manage contact form submissions</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: "Total Messages", value: "128", change: "+12 this week" },
          { label: "Unread", value: "8", change: "Needs attention" },
          { label: "Replied", value: "115", change: "90% resolved" },
          { label: "Spam", value: "5", change: "Flagged" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-gold-500 mt-0.5">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-md mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages..." className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
      </div>

      <div className="space-y-3">
        {messages.map((msg, i) => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className={`rounded-2xl border p-5 ${msg.read ? "border-border bg-card" : "border-gold-500/30 bg-gold-500/5"}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${msg.read ? "bg-muted" : "bg-gold-500/20"} ${msg.read ? "text-muted-foreground" : "text-gold-500"} font-semibold text-sm`}>{msg.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium">{msg.name}</p>
                    {!msg.read && <span className="h-2 w-2 rounded-full bg-gold-500" />}
                    <span className="text-xs text-muted-foreground">{msg.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{msg.email}</p>
                  <p className="text-sm font-medium mt-1">{msg.subject}</p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{msg.message}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><Eye className="h-4 w-4" /></button>
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}