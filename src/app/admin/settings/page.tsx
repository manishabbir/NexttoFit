"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Globe, Mail, Bell, Shield, Truck, Percent, CreditCard, DollarSign } from "lucide-react";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("NEXTFITT");
  const [email, setEmail] = useState("hello@nextfitt.com");
  const [phone, setPhone] = useState("+92 300 1234567");
  const [currency, setCurrency] = useState("PKR");

  // Checkout settings
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("5000");
  const [shippingCost, setShippingCost] = useState("500");
  const [taxRate, setTaxRate] = useState("5");
  const [enableCOD, setEnableCOD] = useState(true);
  const [enableCard, setEnableCard] = useState(true);
  const [enableEasyPaisa, setEnableEasyPaisa] = useState(true);
  const [enableBankTransfer, setEnableBankTransfer] = useState(false);

  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "checkout", label: "Checkout", icon: CreditCard },
    { id: "shipping", label: "Shipping", icon: Truck },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage store and checkout configuration</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 rounded-xl bg-muted p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* General Settings */}
        {activeTab === "general" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Globe className="h-5 w-5 text-gold-500" /> Store Information</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Store Name</label>
                  <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none">
                    <option>PKR</option>
                    <option>USD</option>
                    <option>INR</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Store Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Store Phone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
              </div>
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
                <Save className="h-4 w-4" /> {saved ? "Saved!" : "Save Settings"}
              </button>
            </form>
          </motion.div>
        )}

        {/* Checkout Settings */}
        {activeTab === "checkout" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Percent className="h-5 w-5 text-gold-500" /> Tax & Pricing</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Tax Rate (%)</label>
                    <div className="relative">
                      <input type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-8 text-sm focus:border-gold-500 focus:outline-none" />
                      <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Applied to subtotal at checkout</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Currency</label>
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none">
                      <option>PKR - Pakistani Rupee</option>
                      <option>USD - US Dollar</option>
                      <option>INR - Indian Rupee</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
                  <Save className="h-4 w-4" /> {saved ? "Saved!" : "Save Tax Settings"}
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><CreditCard className="h-5 w-5 text-gold-500" /> Payment Methods</h2>
              <div className="space-y-3">
                {[
                  { id: "enableCOD", label: "Cash on Delivery", desc: "Pay when you receive", state: enableCOD, setter: setEnableCOD },
                  { id: "enableCard", label: "Credit/Debit Card", desc: "Visa, Mastercard", state: enableCard, setter: setEnableCard },
                  { id: "enableEasyPaisa", label: "EasyPaisa / JazzCash", desc: "Mobile wallet", state: enableEasyPaisa, setter: setEnableEasyPaisa },
                  { id: "enableBankTransfer", label: "Bank Transfer", desc: "Direct bank deposit", state: enableBankTransfer, setter: setEnableBankTransfer },
                ].map((method) => (
                  <label key={method.id} className="flex items-center justify-between rounded-xl border border-border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="text-sm font-medium">{method.label}</p>
                      <p className="text-xs text-muted-foreground">{method.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => method.setter(!method.state)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${method.state ? "bg-gold-500" : "bg-muted"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${method.state ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </label>
                ))}
              </div>
              <button onClick={handleSave} className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
                <Save className="h-4 w-4" /> {saved ? "Saved!" : "Save Payment Settings"}
              </button>
            </div>
          </motion.div>
        )}

        {/* Shipping Settings */}
        {activeTab === "shipping" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Truck className="h-5 w-5 text-gold-500" /> Shipping Configuration</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Standard Shipping Cost (₹)</label>
                  <div className="relative">
                    <input type="number" value={shippingCost} onChange={(e) => setShippingCost(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pl-8 text-sm focus:border-gold-500 focus:outline-none" />
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Free Shipping Minimum (₹)</label>
                  <div className="relative">
                    <input type="number" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pl-8 text-sm focus:border-gold-500 focus:outline-none" />
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Orders above this amount get free shipping</p>
                </div>
              </div>
              <div className="rounded-xl bg-muted/50 p-4">
                <h3 className="text-sm font-medium mb-2">Shipping Preview</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• Orders under ₹{freeShippingThreshold}: ₹{shippingCost} shipping</p>
                  <p>• Orders over ₹{freeShippingThreshold}: <span className="text-green-500">Free shipping</span></p>
                  <p>• Tax rate: {taxRate}% on subtotal</p>
                </div>
              </div>
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
                <Save className="h-4 w-4" /> {saved ? "Saved!" : "Save Shipping Settings"}
              </button>
            </form>
          </motion.div>
        )}

        {/* System Status */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Mail, label: "SMTP Status", value: "Connected", color: "text-green-500" },
            { icon: Bell, label: "Notifications", value: "Enabled", color: "text-green-500" },
            { icon: Shield, label: "SSL", value: "Active", color: "text-green-500" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
              <item.icon className="h-5 w-5 text-gold-500" />
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className={`text-sm font-medium ${item.color}`}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}