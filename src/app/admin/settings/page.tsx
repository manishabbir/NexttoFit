"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Globe, Mail, Bell, Shield, Truck, Percent, CreditCard, DollarSign, Sparkles, ImageIcon, Instagram } from "lucide-react";
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

interface PromoBanner {
  enabled: boolean;
  tag: string;
  title: string;
  titleHighlight: string;
  description: string;
  imageUrl: string;
  button1Text: string;
  button1Link: string;
  button2Text: string;
  button2Link: string;
}

interface SocialSection {
  enabled: boolean;
  title: string;
  subtitle: string;
  handle: string;
  images: { url: string; alt: string }[];
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
  promoBanner: PromoBanner;
  social: SocialSection;
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
  announcement: { enabled: true, text: "FREE SHIPPING ·", highlightText: "on orders over Rs5,000", couponCode: "WELCOME20" },
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
  promoBanner: {
    enabled: true, tag: "Limited Edition", title: "Summer Collection", titleHighlight: "2024",
    description: "Embrace the season with our curated summer collection.", imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80",
    button1Text: "Explore Collection", button1Link: "/new-arrivals", button2Text: "View Sale", button2Link: "/sale",
  },
  social: {
    enabled: true, title: "Follow Us", subtitle: "Tag us in your looks for a chance to be featured", handle: "@nextfitt",
    images: [
      { url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80", alt: "Social post 1" },
      { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80", alt: "Social post 2" },
      { url: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&q=80", alt: "Social post 3" },
      { url: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&q=80", alt: "Social post 4" },
    ],
  },
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/site-settings");
      const data = await res.json();
      if (data?.store_settings) {
        const parsed = JSON.parse(data.store_settings);
        setSettings((prev) => ({ ...prev, ...parsed, social: { ...prev.social, ...(parsed.social || {}) } }));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally { setLoading(false); }
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
            promo_banner: JSON.stringify(settings.promoBanner),
            social_section: JSON.stringify(settings.social),
          },
        }),
      });
      if (res.ok) toast.success("Settings saved!");
      else toast.error("Failed to save");
    } catch { toast.error("Error saving"); }
    finally { setSaving(false); }
  };

  const updateSocialImage = (index: number, field: "url" | "alt", value: string) => {
    const images = [...settings.social.images];
    images[index] = { ...images[index], [field]: value };
    setSettings((s) => ({ ...s, social: { ...s.social, images } }));
  };

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "promo", label: "Promo Banner", icon: ImageIcon },
    { id: "social", label: "Social", icon: Instagram },
    { id: "categories", label: "Categories", icon: ImageIcon },
    { id: "features", label: "Features Bar", icon: Sparkles },
    { id: "announcement", label: "Announcement Bar", icon: Bell },
    { id: "checkout", label: "Checkout", icon: CreditCard },
    { id: "shipping", label: "Shipping", icon: Truck },
  ];

  if (loading) return <div className="p-6 animate-pulse space-y-4"><div className="h-8 w-48 rounded bg-muted" /><div className="h-96 rounded-2xl bg-muted" /></div>;

  const pb = settings.promoBanner;
  const sc = settings.social;

  return (
    <div className="p-6">
      <div className="mb-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-sm text-muted-foreground">Manage store configuration</p></div>

      <div className="flex gap-1 mb-6 rounded-xl bg-muted p-1 w-fit flex-wrap">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6 max-w-2xl">
        {activeTab === "general" && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4"><Globe className="h-5 w-5 text-gold-500 inline mr-2" />Store Information</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="text-sm font-medium mb-1.5 block">Store Name</label><input type="text" value={settings.storeName} onChange={(e) => setSettings((s) => ({ ...s, storeName: e.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Currency</label><select value={settings.currency} onChange={(e) => setSettings((s) => ({ ...s, currency: e.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none"><option>PKR</option><option>USD</option><option>INR</option></select></div>
              </div>
              <div><label className="text-sm font-medium mb-1.5 block">Store Email</label><input type="email" value={settings.email} onChange={(e) => setSettings((s) => ({ ...s, email: e.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" /></div>
              <div><label className="text-sm font-medium mb-1.5 block">Store Phone</label><input type="tel" value={settings.phone} onChange={(e) => setSettings((s) => ({ ...s, phone: e.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" /></div>
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black hover:bg-gold-600"><Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}</button>
            </form>
          </div>
        )}

        {activeTab === "promo" && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4"><ImageIcon className="h-5 w-5 text-gold-500 inline mr-2" />Promo Banner</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-border p-4">
                <div><p className="text-sm font-medium">Show Banner</p><p className="text-xs text-muted-foreground">Toggle on/off</p></div>
                <button type="button" onClick={() => setSettings((s) => ({ ...s, promoBanner: { ...s.promoBanner, enabled: !s.promoBanner.enabled } }))}
                  className={`relative h-6 w-11 rounded-full transition-colors ${pb.enabled ? "bg-gold-500" : "bg-muted"}`}>
                  <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${pb.enabled ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
              <div><label className="text-sm font-medium mb-1.5 block">Tag</label><input type="text" value={pb.tag} onChange={(e) => setSettings((s) => ({ ...s, promoBanner: { ...s.promoBanner, tag: e.target.value } }))} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="text-sm font-medium mb-1.5 block">Title</label><input type="text" value={pb.title} onChange={(e) => setSettings((s) => ({ ...s, promoBanner: { ...s.promoBanner, title: e.target.value } }))} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Highlight (gold)</label><input type="text" value={pb.titleHighlight} onChange={(e) => setSettings((s) => ({ ...s, promoBanner: { ...s.promoBanner, titleHighlight: e.target.value } }))} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" /></div>
              </div>
              <div><label className="text-sm font-medium mb-1.5 block">Description</label><textarea value={pb.description} onChange={(e) => setSettings((s) => ({ ...s, promoBanner: { ...s.promoBanner, description: e.target.value } }))} rows={3} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none resize-none" /></div>
              <div><label className="text-sm font-medium mb-1.5 block">Background Image URL</label><input type="text" value={pb.imageUrl} onChange={(e) => setSettings((s) => ({ ...s, promoBanner: { ...s.promoBanner, imageUrl: e.target.value } }))} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none font-mono" />
                {pb.imageUrl && <div className="mt-2 h-24 rounded-xl overflow-hidden bg-muted"><img src={pb.imageUrl} alt="" className="h-full w-full object-cover" /></div>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="text-sm font-medium mb-1.5 block">Button 1</label><input type="text" value={pb.button1Text} onChange={(e) => setSettings((s) => ({ ...s, promoBanner: { ...s.promoBanner, button1Text: e.target.value } }))} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Button 1 Link</label><input type="text" value={pb.button1Link} onChange={(e) => setSettings((s) => ({ ...s, promoBanner: { ...s.promoBanner, button1Link: e.target.value } }))} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none font-mono" /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Button 2</label><input type="text" value={pb.button2Text} onChange={(e) => setSettings((s) => ({ ...s, promoBanner: { ...s.promoBanner, button2Text: e.target.value } }))} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Button 2 Link</label><input type="text" value={pb.button2Link} onChange={(e) => setSettings((s) => ({ ...s, promoBanner: { ...s.promoBanner, button2Link: e.target.value } }))} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none font-mono" /></div>
              </div>
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black hover:bg-gold-600"><Save className="h-4 w-4" /> {saving ? "Saving..." : "Save"}</button>
            </form>
          </div>
        )}

        {activeTab === "social" && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4"><Instagram className="h-5 w-5 text-gold-500 inline mr-2" />Social / Instagram Section</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-border p-4">
                <div><p className="text-sm font-medium">Show Social Section</p><p className="text-xs text-muted-foreground">Toggle on/off</p></div>
                <button type="button" onClick={() => setSettings((s) => ({ ...s, social: { ...s.social, enabled: !s.social.enabled } }))}
                  className={`relative h-6 w-11 rounded-full transition-colors ${sc.enabled ? "bg-gold-500" : "bg-muted"}`}>
                  <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${sc.enabled ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
              <div><label className="text-sm font-medium mb-1.5 block">Section Title</label><input type="text" value={sc.title} onChange={(e) => setSettings((s) => ({ ...s, social: { ...s.social, title: e.target.value } }))} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" /></div>
              <div><label className="text-sm font-medium mb-1.5 block">Social Handle</label><input type="text" value={sc.handle} onChange={(e) => setSettings((s) => ({ ...s, social: { ...s.social, handle: e.target.value } }))} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" /></div>
              <div><label className="text-sm font-medium mb-1.5 block">Subtitle</label><input type="text" value={sc.subtitle} onChange={(e) => setSettings((s) => ({ ...s, social: { ...s.social, subtitle: e.target.value } }))} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" /></div>
              <div>
                <h3 className="text-sm font-semibold mb-3">Images (4)</h3>
                <div className="space-y-3">
                  {sc.images.map((img, i) => (
                    <div key={i} className="rounded-xl border border-border p-4">
                      <p className="text-xs font-medium mb-2 text-muted-foreground">Image #{i + 1}</p>
                      <div className="flex gap-2">
                        <input type="text" value={img.url} onChange={(e) => updateSocialImage(i, "url", e.target.value)} placeholder="Image URL" className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:border-gold-500 focus:outline-none" />
                        <input type="text" value={img.alt} onChange={(e) => updateSocialImage(i, "alt", e.target.value)} placeholder="Alt text" className="w-40 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none" />
                      </div>
                      {img.url && <div className="mt-2 h-16 w-16 rounded-lg overflow-hidden bg-muted"><img src={img.url} alt="" className="h-full w-full object-cover" /></div>}
                    </div>
                  ))}
                </div>
              </div>
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black hover:bg-gold-600"><Save className="h-4 w-4" /> {saving ? "Saving..." : "Save"}</button>
            </form>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="space-y-4">
            {settings.categories.map((cat, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold mb-4">Category #{i + 1}</h3>
                <div className="space-y-3">
                  <div><label className="text-xs font-medium mb-1 block">Name</label><input type="text" value={cat.name} onChange={(e) => { const c = [...settings.categories]; c[i] = { ...cat, name: e.target.value }; setSettings((s) => ({ ...s, categories: c })); }} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none" /></div>
                  <div><label className="text-xs font-medium mb-1 block">Link URL</label><input type="text" value={cat.href} onChange={(e) => { const c = [...settings.categories]; c[i] = { ...cat, href: e.target.value }; setSettings((s) => ({ ...s, categories: c })); }} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:border-gold-500 focus:outline-none" /></div>
                  <div><label className="text-xs font-medium mb-1 block">Image URL</label><input type="text" value={cat.image} onChange={(e) => { const c = [...settings.categories]; c[i] = { ...cat, image: e.target.value }; setSettings((s) => ({ ...s, categories: c })); }} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:border-gold-500 focus:outline-none" />
                    {cat.image && <div className="mt-2 h-20 w-20 rounded-lg overflow-hidden bg-muted"><img src={cat.image} alt="" className="h-full w-full object-cover" /></div>}
                  </div>
                  <div><label className="text-xs font-medium mb-1 block">Count</label><input type="text" value={cat.count} onChange={(e) => { const c = [...settings.categories]; c[i] = { ...cat, count: e.target.value }; setSettings((s) => ({ ...s, categories: c })); }} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none" /></div>
                </div>
              </div>
            ))}
            <button type="submit" onClick={handleSave} className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black hover:bg-gold-600"><Save className="h-4 w-4" /> Save</button>
          </div>
        )}

        {activeTab === "features" && (
          <div className="space-y-4">
            {settings.features.map((f, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold mb-4">Feature #{i + 1}</h3>
                <div className="space-y-3">
                  <div><label className="text-xs font-medium mb-1 block">Icon</label><input type="text" value={f.icon} onChange={(e) => { const a = [...settings.features]; a[i] = { ...f, icon: e.target.value }; setSettings((s) => ({ ...s, features: a })); }} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none" /></div>
                  <div><label className="text-xs font-medium mb-1 block">Title</label><input type="text" value={f.title} onChange={(e) => { const a = [...settings.features]; a[i] = { ...f, title: e.target.value }; setSettings((s) => ({ ...s, features: a })); }} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none" /></div>
                  <div><label className="text-xs font-medium mb-1 block">Description</label><input type="text" value={f.description} onChange={(e) => { const a = [...settings.features]; a[i] = { ...f, description: e.target.value }; setSettings((s) => ({ ...s, features: a })); }} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none" /></div>
                </div>
              </div>
            ))}
            <button type="submit" onClick={handleSave} className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black hover:bg-gold-600"><Save className="h-4 w-4" /> Save</button>
          </div>
        )}

        {activeTab === "announcement" && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4"><Bell className="h-5 w-5 text-gold-500 inline mr-2" />Announcement Bar</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-border p-4">
                <div><p className="text-sm font-medium">Show</p><p className="text-xs text-muted-foreground">Toggle on/off</p></div>
                <button type="button" onClick={() => setSettings((s) => ({ ...s, announcement: { ...s.announcement, enabled: !s.announcement.enabled } }))}
                  className={`relative h-6 w-11 rounded-full transition-colors ${settings.announcement.enabled ? "bg-gold-500" : "bg-muted"}`}>
                  <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${settings.announcement.enabled ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
              <div><label className="text-sm font-medium mb-1.5 block">Text</label><input type="text" value={settings.announcement.text} onChange={(e) => setSettings((s) => ({ ...s, announcement: { ...s.announcement, text: e.target.value } }))} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" /></div>
              <div><label className="text-sm font-medium mb-1.5 block">Highlight</label><input type="text" value={settings.announcement.highlightText} onChange={(e) => setSettings((s) => ({ ...s, announcement: { ...s.announcement, highlightText: e.target.value } }))} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" /></div>
              <div><label className="text-sm font-medium mb-1.5 block">Coupon Code</label><input type="text" value={settings.announcement.couponCode} onChange={(e) => setSettings((s) => ({ ...s, announcement: { ...s.announcement, couponCode: e.target.value } }))} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" /></div>
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black hover:bg-gold-600"><Save className="h-4 w-4" /> Save</button>
            </form>
          </div>
        )}

        {activeTab === "checkout" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4"><Percent className="h-5 w-5 text-gold-500 inline mr-2" />Tax & Pricing</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className="text-sm font-medium mb-1.5 block">Tax Rate (%)</label>
                    <div className="relative"><input type="number" value={settings.taxRate} onChange={(e) => setSettings((s) => ({ ...s, taxRate: e.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-8 text-sm focus:border-gold-500 focus:outline-none" /><Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /></div>
                  </div>
                  <div><label className="text-sm font-medium mb-1.5 block">Currency</label><select value={settings.currency} onChange={(e) => setSettings((s) => ({ ...s, currency: e.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none"><option>PKR</option><option>USD</option><option>INR</option></select></div>
                </div>
                <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black hover:bg-gold-600"><Save className="h-4 w-4" /> Save</button>
              </form>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4"><CreditCard className="h-5 w-5 text-gold-500 inline mr-2" />Payment Methods</h2>
              <div className="space-y-3">
                {[
                  { id: "enableCOD" as const, label: "Cash on Delivery", state: settings.enableCOD },
                  { id: "enableCard" as const, label: "Credit/Debit Card", state: settings.enableCard },
                  { id: "enableEasyPaisa" as const, label: "EasyPaisa / JazzCash", state: settings.enableEasyPaisa },
                  { id: "enableBankTransfer" as const, label: "Bank Transfer", state: settings.enableBankTransfer },
                ].map((m) => (
                  <label key={m.id} className="flex items-center justify-between rounded-xl border border-border p-4 cursor-pointer hover:bg-muted/50">
                    <p className="text-sm font-medium">{m.label}</p>
                    <button type="button" onClick={() => setSettings((s) => ({ ...s, [m.id]: !s[m.id] }))} className={`relative h-6 w-11 rounded-full transition-colors ${m.state ? "bg-gold-500" : "bg-muted"}`}>
                      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${m.state ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </label>
                ))}
              </div>
              <button onClick={handleSave} className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black hover:bg-gold-600"><Save className="h-4 w-4" /> Save</button>
            </div>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4"><Truck className="h-5 w-5 text-gold-500 inline mr-2" />Shipping</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="text-sm font-medium mb-1.5 block">Standard Shipping Cost</label>
                  <div className="relative"><input type="number" value={settings.shippingCost} onChange={(e) => setSettings((s) => ({ ...s, shippingCost: e.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pl-8 text-sm focus:border-gold-500 focus:outline-none" /><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /></div>
                </div>
                <div><label className="text-sm font-medium mb-1.5 block">Free Shipping Minimum</label>
                  <div className="relative"><input type="number" value={settings.freeShippingThreshold} onChange={(e) => setSettings((s) => ({ ...s, freeShippingThreshold: e.target.value }))} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pl-8 text-sm focus:border-gold-500 focus:outline-none" /><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /></div>
                </div>
              </div>
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black hover:bg-gold-600"><Save className="h-4 w-4" /> Save</button>
            </form>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Mail, label: "SMTP", value: "Connected", color: "text-green-500" },
            { icon: Bell, label: "Notifications", value: "Enabled", color: "text-green-500" },
            { icon: Shield, label: "SSL", value: "Active", color: "text-green-500" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
              <item.icon className="h-5 w-5 text-gold-500" />
              <div><p className="text-xs text-muted-foreground">{item.label}</p><p className={`text-sm font-medium ${item.color}`}>{item.value}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}