"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Contact Us</h1>
        <p className="mt-4 text-lg text-muted-foreground">We'd love to hear from you</p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Your name" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="your@email.com" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Subject</label>
                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required placeholder="How can we help?" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Message</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} placeholder="Tell us more..." className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none" />
              </div>
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
                <Send className="h-4 w-4" /> {sent ? "Sent!" : "Send Message"}
              </button>
            </form>
          </motion.div>
        </div>

        <div className="space-y-4">
          {[
            { icon: MapPin, label: "Visit Us", value: "Lahore, Pakistan" },
            { icon: Phone, label: "Call Us", value: "+92 300 1234567" },
            { icon: Mail, label: "Email Us", value: "hello@nextfitt.com" },
            { icon: Clock, label: "Working Hours", value: "Mon - Sat: 10AM - 8PM" },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-gold-500/10 p-3"><item.icon className="h-5 w-5 text-gold-500" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}