"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Globe, Mail, Bell, Shield, Truck, Percent, CreditCard, DollarSign, Sparkles, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

interface AnnouncementSettings {
  enabled: boolean;
  text: string;
  highlightText: string;
  couponCode: string;
}

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface CategoryItem {
  name: string;
  href: string;
  image: string;
  count: string;
}

interface StoreSettings {
  storeName: string;
  email: string;
  phone: string;
  currency: string;
  freeShippingThreshold: string;
  shippingCost: string;
  taxRate: string;
  enableCOD: boolean;
  enableCard: boolean;
  enableEasyPaisa: boolean;
  enableBankTransfer: boolean;
  announcement: AnnouncementSettings;
  features: FeatureItem[];
  categories: CategoryItem[];
}

const defaultSettings: StoreSettings = {
  storeName: "NEXTFITT",
  email: "hello@nextfitt.com",
  phone: "+92 300 1234567",
  currency: "PKR",
  freeShippingThreshold: "5000",
  shippingCost: "500",
  taxRate: "5",
  enableCOD: true,
  enableCard: true,
  enableEasyPaisa: true,
  enableBankTransfer: false,
  announcement: {
    enabled: true,
    text: "FREE SHIPPING ·",
    highlightText: "on orders over ₹5,000",
    couponCode: "WELCOME20",
  },
  features: [
    { icon: "Truck", title: "Free Shipping", description: "On orders over Rs5,000" },
    { icon: "Shield", title: "Secure Payment", description: "100% secure checkout" },
    { icon: "RotateCcw", title: "Easy Returns", description: "30-day return policy" },
    { icon: "Sparkles", title: "Premium Quality", description: "Handcrafted with care" },
  ],
  categories: [
    { name: "Men's Collection", href: "/men", image: "https://images.unsplash.com/photo-1617137968427-8590be9b1ca9?w=800&q=80", count: "248 Products" },
    { name: "Women's Collection", href: "/women", image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80", count: "312 Products" },
    { name: "Accessories", href: "/men?category=accessories", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80", count: "156 Products" },
  ],
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/site-settings");
      const data = await res.json();
      if (data?.store_settings) {
        const parsed = JSON.parse(data.store_settings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            store_settings: JSON.stringify(settings),
            announcement_bar: JSON.stringify(settings.announcement),
            features_bar: JSON.stringify(settings.features),
            categories: JSON.stringify(settings.categories),
          },
        }),
      });

      if (res.ok) {
        toast.success("Settings saved successfully!");
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      toast.error("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  const update = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "categories", label: "Categories", icon: ImageIcon },
    { id: "features", label: "Features Bar", icon: Sparkles },
    { id: "announcement", label: "Announcement Bar", icon: Bell },
    { id: "checkout", label: "Checkout", icon: CreditCard },
    { id: "shipping", label: "Shipping", icon: Truck },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-96 rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

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
                  <input type="text" value={settings.storeName} onChange={(e) => update("storeName", e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Currency</label>
                  <select value={settings.currency} onChange={(e) => update("currency", e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none">
                    <option>PKR</option>
                    <option>USD</option>
                    <option>INR</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Store Email</label>
                <input type="email" value={settings.email} onChange={(e) => update("email", e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Store Phone</label>
                <input type="tel" value={settings.phone} onChange={(e) => update("phone", e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
              </div>
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
                <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}
              </button>
            </form>
          </motion.div>
        )}

        {/* Categories Settings */}
        {activeTab === "categories" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {settings.categories.map((cat, index) => (
              <div key={index} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold mb-4">Category #{index + 1}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Name</label>
                    <input type="text" value={cat.name} onChange={(e) => {
                      const newCats = [...settings.categories];
                      newCats[index] = { ...cat, name: e.target.value };
                      update("categories", newCats);
                    }} placeholder="Men's Collection" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Link URL</label>
                    <input type="text" value={cat.href} onChange={(e) => {
                      const newCats = [...settings.categories];
                      newCats[index] = { ...cat, href: e.target.value };
                      update("categories", newCats);
                    }} placeholder="/men" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none font-mono" />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Image URL</label>
                    <div className="flex gap-2">
                      <input type="text" value={cat.image} onChange={(e) => {
                        const newCats = [...settings.categories];
                        newCats[index] = { ...cat, image: e.target.value };
                        update("categories", newCats);
                      }} placeholder="https://..." className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none font-mono" />
                    </div>
                    {cat.image && (
                      <div className="mt-2 h-20 w-20 rounded-lg overflow-hidden bg-muted">
                        <img src={cat.image} alt="" className="h-full w-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Product Count Text</label>
                    <input type="text" value={cat.count} onChange={(e) => {
                      const newCats = [...settings.categories];
                      newCats[index] = { ...cat, count: e.target.value };
                      update("categories", newCats);
                    }} placeholder="248 Products" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none" />
                  </div>
                </div>
              </div>
            ))}
            <button type="submit" onClick={handleSave} className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
              <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Categories"}
            </button>
          </motion.div>
        )}

        {/* Features Bar Settings */}
        {activeTab === "features" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {settings.features.map((feature, index) => (
              <div key={index} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold mb-4">Feature #{index + 1}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Icon Name</label>
                    <input
                      type="text"
                      value={feature.icon}
                      onChange={(e) => {
                        const newFeatures = [...settings.features];
                        newFeatures[index] = { ...feature, icon: e.target.value };
                        update("features", newFeatures);
                      }}
                      placeholder="Truck, Shield, RotateCcw, Sparkles"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
                    />
                    <p className="text-xs text-muted-foreground mt-0.5">Options: Truck, Shield, RotateCcw, Sparkles</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Title</label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => {
                        const newFeatures = [...settings.features];
                        newFeatures[index] = { ...feature, title: e.target.value };
                        update("features", newFeatures);
                      }}
                      placeholder="Free Shipping"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Description</label>
                    <input
                      type="text"
                      value={feature.description}
                      onChange={(e) => {
                        const newFeatures = [...settings.features];
                        newFeatures[index] = { ...feature, description: e.target.value };
                        update("features", newFeatures);
                      }}
                      placeholder="On orders over Rs5,000"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button type="submit" onClick={handleSave} className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
              <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Features"}
            </button>
          </motion.div>
        )}

        {/* Announcement Bar Settings */}
        {activeTab === "announcement" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Bell className="h-5 w-5 text-gold-500" /> Announcement Bar</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-border p-4">
                <div>
                  <p className="text-sm font-medium">Show Announcement Bar</p>
                  <p className="text-xs text-muted-foreground">Toggle the top announcement banner on/off</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings((prev) => ({ ...prev, announcement: { ...prev.announcement, enabled: !prev.announcement.enabled } }))}
                  className={`relative h-6 w-11 rounded-full transition-colors ${settings.announcement.enabled ? "bg-gold-500" : "bg-muted"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${settings.announcement.enabled ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Announcement Text</label>
                <input type="text" value={settings.announcement.text} onChange={(e) => setSettings((prev) => ({ ...prev, announcement: { ...prev.announcement, text: e.target.value } }))} placeholder="FREE SHIPPING ·" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Highlight Text</label>
                <input type="text" value={settings.announcement.highlightText} onChange={(e) => setSettings((prev) => ({ ...prev, announcement: { ...prev.announcement, highlightText: e.target.value } }))} placeholder="on orders over ₹5,000" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Coupon Code</label>
                <input type="text" value={settings.announcement.couponCode} onChange={(e) => setSettings((prev) => ({ ...prev, announcement: { ...prev.announcement, couponCode: e.target.value } }))} placeholder="WELCOME20" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
              </div>
              <div className="rounded-xl bg-muted/50 p-4">
                <h3 className="text-sm font-medium mb-2">Preview</h3>
                <div className="rounded-lg bg-gradient-to-r from-luxury-950 via-gold-800 to-luxury-950 p-3 text-center text-xs text-white uppercase tracking-wider">
                  {settings.announcement.text} <span className="text-gold-300">{settings.announcement.highlightText}</span>
                  {settings.announcement.couponCode ? ` · Use code: ${settings.announcement.couponCode}` : ""}
                </div>
              </div>
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
                <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}
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
                      <input type="number" value={settings.taxRate} onChange={(e) => update("taxRate", e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-8 text-sm focus:border-gold-500 focus:outline-none" />
                      <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Applied to subtotal at checkout</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Currency</label>
                    <select value={settings.currency} onChange={(e) => update("currency", e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none">
                      <option>PKR - Pakistani Rupee</option>
                      <option>USD - US Dollar</option>
                      <option>INR - Indian Rupee</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
                  <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><CreditCard className="h-5 w-5 text-gold-500" /> Payment Methods</h2>
              <div className="space-y-3">
                {[
                  { id: "enableCOD" as const, label: "Cash on Delivery", desc: "Pay when you receive", state: settings.enableCOD },
                  { id: "enableCard" as const, label: "Credit/Debit Card", desc: "Visa, Mastercard", state: settings.enableCard },
                  { id: "enableEasyPaisa" as const, label: "EasyPaisa / JazzCash", desc: "Mobile wallet", state: settings.enableEasyPaisa },
                  { id: "enableBankTransfer" as const, label: "Bank Transfer", desc: "Direct bank deposit", state: settings.enableBankTransfer },
                ].map((method) => (
                  <label key={method.id} className="flex items-center justify-between rounded-xl border border-border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="text-sm font-medium">{method.label}</p>
                      <p className="text-xs text-muted-foreground">{method.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => update(method.id, !method.state)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${method.state ? "bg-gold-500" : "bg-muted"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${method.state ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </label>
                ))}
              </div>
              <button onClick={handleSave} className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
                <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}
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
                  <label className="text-sm font-medium mb-1.5 block">Standard Shipping Cost</label>
                  <div className="relative">
                    <input type="number" value={settings.shippingCost} onChange={(e) => update("shippingCost", e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pl-8 text-sm focus:border-gold-500 focus:outline-none" />
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Free Shipping Minimum</label>
                  <div className="relative">
                    <input type="number" value={settings.freeShippingThreshold} onChange={(e) => update("freeShippingThreshold", e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pl-8 text-sm focus:border-gold-500 focus:outline-none" />
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Orders above this amount get free shipping</p>
                </div>
              </div>
              <div className="rounded-xl bg-muted/50 p-4">
                <h3 className="text-sm font-medium mb-2">Shipping Preview</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• Orders under {settings.currency} {settings.freeShippingThreshold}: {settings.currency} {settings.shippingCost} shipping</p>
                  <p>• Orders over {settings.currency} {settings.freeShippingThreshold}: <span className="text-green-500">Free shipping</span></p>
                  <p>• Tax rate: {settings.taxRate}% on subtotal</p>
                </div>
              </div>
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
                <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}
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