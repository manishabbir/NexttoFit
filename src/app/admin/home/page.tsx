"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Truck, RotateCcw, Edit3, X, Save, Image as ImageIcon, Bell, Globe, Instagram, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { toast } from "sonner";

// ============== ICON MAP ==============
const iconMap: Record<string, React.ElementType> = { Truck, Shield, RotateCcw, Sparkles };

// ============== DEFAULTS ==============
const defaultFeatures = [
  { icon: "Truck", title: "Free Shipping", description: "On orders over Rs5,000" },
  { icon: "Shield", title: "Secure Payment", description: "100% secure checkout" },
  { icon: "RotateCcw", title: "Easy Returns", description: "30-day return policy" },
  { icon: "Sparkles", title: "Premium Quality", description: "Handcrafted with care" },
];

const defaultCategories = [
  { name: "Men's Collection", href: "/men", image: "https://images.unsplash.com/photo-1617137968427-8590be9b1ca9?w=800&q=80", count: "248 Products" },
  { name: "Women's Collection", href: "/women", image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80", count: "312 Products" },
  { name: "Accessories", href: "/men?category=accessories", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80", count: "156 Products" },
];

export default function AdminHomeEditorPage() {
  // Data states
  const [announcement, setAnnouncement] = useState({ enabled: true, text: "FREE SHIPPING ·", highlightText: "on orders over Rs5,000", couponCode: "WELCOME20" });
  const [features, setFeatures] = useState(defaultFeatures);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [bestsellerProducts, setBestsellerProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [promoBanner, setPromoBanner] = useState<any>({ enabled: true, tag: "Limited Edition", title: "Summer Collection", titleHighlight: "2024", description: "", imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80", button1Text: "Explore Collection", button1Link: "/new-arrivals", button2Text: "View Sale", button2Link: "/sale" });
  const [socialSection, setSocialSection] = useState<any>({ enabled: true, title: "Follow Us", handle: "@nextfitt", subtitle: "Tag us in your looks", images: [] });
  const [socialImages, setSocialImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Editor state
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Quick state for inline preview
  const [featuresState, setFeaturesState] = useState(defaultFeatures);
  const [categoriesState, setCategoriesState] = useState(defaultCategories);
  const [promoState, setPromoState] = useState(promoBanner);
  const [socialState, setSocialState] = useState<any>({ enabled: true, title: "Follow Us", handle: "@nextfitt", subtitle: "Tag us in your looks", images: [] });
  const [announcementState, setAnnouncementState] = useState(announcement);
  const [heroBanners, setHeroBanners] = useState<any[]>([]);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [settingsRes, bannersRes, featuredRes, bestRes] = await Promise.all([
        fetch("/api/site-settings"),
        fetch("/api/banners"),
        fetch("/api/products?featured=true&limit=4"),
        fetch("/api/products?bestsellers=true&limit=4"),
      ]);
      const settingsData = await settingsRes.json();
      const bannersData = await bannersRes.json();
      const featuredData = await featuredRes.json();
      const bestData = await bestRes.json();

      if (Array.isArray(bannersData)) setHeroBanners(bannersData.filter((b: any) => b.isActive));
      if (Array.isArray(featuredData)) setFeaturedProducts(featuredData);
      if (Array.isArray(bestData)) setBestsellerProducts(bestData);

      if (settingsData?.store_settings) {
        const s = JSON.parse(settingsData.store_settings);
        if (s.announcement) { setAnnouncementState((prev: any) => ({ ...prev, ...s.announcement })); setAnnouncement((prev: any) => ({ ...prev, ...s.announcement })); }
        if (s.features) { setFeaturesState(s.features); setFeatures(s.features); }
        if (s.categories) { setCategoriesState(s.categories); setCategories(s.categories); }
        if (s.promoBanner) { setPromoState((prev: any) => ({ ...prev, ...s.promoBanner })); setPromoBanner((prev: any) => ({ ...prev, ...s.promoBanner })); }
        if (s.social) {
          const parsed = { ...defaultSocial, ...s.social };
          setSocialState(parsed);
          setSocialSection(parsed);
          if (parsed.images?.length) setSocialImages(parsed.images.map((i: any) => i.url));
        }
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const defaultSocial = { enabled: true, title: "Follow Us", handle: "@nextfitt", subtitle: "Tag us in your looks for a chance to be featured", images: [
    { url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80", alt: "" },
    { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80", alt: "" },
    { url: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&q=80", alt: "" },
    { url: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&q=80", alt: "" },
  ]};

  const openEditor = (sectionId: string) => {
    setEditingSection(sectionId);
    switch (sectionId) {
      case "announcement": setEditData({ ...announcementState }); break;
      case "features": setEditData(featuresState.map((f: any) => ({ ...f }))); break;
      case "categories": setEditData(categoriesState.map((c: any) => ({ ...c }))); break;
      case "promo": setEditData({ ...promoState }); break;
      case "social": setEditData({ ...socialState, images: socialState.images?.map((i: any) => ({ ...i })) || [] }); break;
      default: setEditData(null);
    }
  };

  const handleSave = async () => {
    if (!editingSection || !editData) return;
    setSaving(true);
    try {
      const newSettings: any = {};

      switch (editingSection) {
        case "announcement": {
          const updated = { ...announcementState, ...editData };
          setAnnouncementState(updated);
          setAnnouncement(updated);
          newSettings.announcement_bar = JSON.stringify(updated);
          const res = await fetch("/api/site-settings");
          const existing = await res.json();
          if (existing?.store_settings) {
            const parsed = JSON.parse(existing.store_settings);
            parsed.announcement = updated;
            newSettings.store_settings = JSON.stringify(parsed);
          }
          break;
        }
        case "features": {
          setFeaturesState(editData);
          setFeatures(editData);
          newSettings.features_bar = JSON.stringify(editData);
          const res = await fetch("/api/site-settings");
          const existing = await res.json();
          if (existing?.store_settings) {
            const parsed = JSON.parse(existing.store_settings);
            parsed.features = editData;
            newSettings.store_settings = JSON.stringify(parsed);
          }
          break;
        }
        case "categories": {
          setCategoriesState(editData);
          setCategories(editData);
          newSettings.categories = JSON.stringify(editData);
          const res = await fetch("/api/site-settings");
          const existing = await res.json();
          if (existing?.store_settings) {
            const parsed = JSON.parse(existing.store_settings);
            parsed.categories = editData;
            newSettings.store_settings = JSON.stringify(parsed);
          }
          break;
        }
        case "promo": {
          setPromoState(editData);
          setPromoBanner(editData);
          newSettings.promo_banner = JSON.stringify(editData);
          const res = await fetch("/api/site-settings");
          const existing = await res.json();
          if (existing?.store_settings) {
            const parsed = JSON.parse(existing.store_settings);
            parsed.promoBanner = editData;
            newSettings.store_settings = JSON.stringify(parsed);
          }
          break;
        }
        case "social": {
          setSocialState(editData);
          setSocialSection(editData);
          if (editData.images?.length) setSocialImages(editData.images.map((i: any) => i.url));
          newSettings.social_section = JSON.stringify(editData);
          const res = await fetch("/api/site-settings");
          const existing = await res.json();
          if (existing?.store_settings) {
            const parsed = JSON.parse(existing.store_settings);
            parsed.social = editData;
            newSettings.store_settings = JSON.stringify(parsed);
          }
          break;
        }
      }

      const saveRes = await fetch("/api/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: newSettings }),
      });

      if (saveRes.ok) {
        toast.success("Updated!");
        setEditingSection(null);
        setEditData(null);
      } else toast.error("Failed to save");
    } catch { toast.error("Error saving"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="p-6 animate-pulse space-y-4"><div className="h-8 w-64 rounded bg-muted" /><div className="h-[600px] rounded-2xl bg-muted" /></div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🎨 Live Homepage Editor</h1>
          <p className="text-sm text-muted-foreground">Click directly on any section below to edit it. Changes save instantly.</p>
        </div>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Edit3 className="h-3 w-3 text-gold-500" /> Click to edit</span>
        </div>
      </div>

      {/* ==================== FULL PAGE PREVIEW ==================== */}
      <div className="relative rounded-2xl border-2 border-border overflow-hidden bg-background shadow-xl max-w-5xl mx-auto">

        {/* --- Announcement Bar --- */}
        <div className="relative group cursor-pointer" onClick={() => openEditor("announcement")}>
          <div className={`${announcementState.enabled ? "" : "opacity-40"}`}>
            <div className="bg-gradient-to-r from-luxury-950 via-gold-800 to-luxury-950 text-white text-center py-3 px-4 text-sm uppercase tracking-wider">
              {announcementState.text} <span className="text-gold-300">{announcementState.highlightText}</span>
              {announcementState.couponCode ? ` · Use code: ${announcementState.couponCode}` : ""}
            </div>
          </div>
          <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/10 transition-all flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-all inline-flex items-center gap-1 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-black">
              <Edit3 className="h-3 w-3" /> Edit Announcement
            </span>
          </div>
        </div>

        {/* --- Hero Slider --- */}
        <Link href="/admin/banners" className="relative group block">
          {heroBanners.length > 0 ? (
            <div className="relative h-48 md:h-64 bg-gradient-to-r from-luxury-950 to-luxury-900 flex items-center px-8">
              <img src={heroBanners[0]?.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
              <div className="relative text-white">
                <p className="text-xl md:text-3xl font-bold">{heroBanners[0]?.title}</p>
                <p className="text-gold-400 text-lg">{heroBanners[0]?.subtitle}</p>
                <p className="text-xs text-white/60 mt-2">{heroBanners.length} slide(s) active</p>
              </div>
            </div>
          ) : (
            <div className="h-48 md:h-64 bg-muted flex items-center justify-center text-muted-foreground">Click to add hero banners</div>
          )}
          <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/10 transition-all flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-all inline-flex items-center gap-1 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-black">
              <Edit3 className="h-3 w-3" /> Manage Hero Slides
            </span>
          </div>
        </Link>

        {/* --- Features Bar --- */}
        <div className="relative group cursor-pointer border-b border-border" onClick={() => openEditor("features")}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 md:p-6 bg-card">
            {featuresState.map((f: any, i: number) => {
              const Icon = iconMap[f.icon] || Truck;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10"><Icon className="h-5 w-5 text-gold-500" /></div>
                  <div><p className="text-sm font-medium">{f.title}</p><p className="text-xs text-muted-foreground">{f.description}</p></div>
                </div>
              );
            })}
          </div>
          <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/10 transition-all flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-all inline-flex items-center gap-1 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-black">
              <Edit3 className="h-3 w-3" /> Edit Features
            </span>
          </div>
        </div>

        {/* --- Featured Products --- */}
        <Link href="/admin/products" className="relative group block border-b border-border">
          <div className="p-6 bg-background">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="text-xs font-semibold tracking-[0.3em] uppercase text-gold-500">Premium Collection</span>
                <h2 className="mt-2 font-display text-2xl font-bold">Featured Products</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredProducts.slice(0, 4).map((p: any) => {
                const img = p.images?.[0]?.url;
                return (
                  <div key={p.id} className="group">
                    <div className="aspect-[3/4] rounded-xl bg-muted overflow-hidden">
                      {img && <img src={img} alt={p.name} className="h-full w-full object-cover" />}
                    </div>
                    <p className="mt-2 text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">Rs.{Number(p.price).toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/10 transition-all flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-all inline-flex items-center gap-1 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-black">
              <Edit3 className="h-3 w-3" /> Manage Products
            </span>
          </div>
        </Link>

        {/* --- Categories --- */}
        <div className="relative group cursor-pointer border-b border-border bg-card" onClick={() => openEditor("categories")}>
          <div className="p-6">
            <div className="text-center mb-6">
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-gold-500">Shop by</span>
              <h2 className="mt-2 font-display text-2xl font-bold">Categories</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {categoriesState.map((c: any, i: number) => (
                <div key={i} className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                  <img src={c.image} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                    <p className="text-white font-bold">{c.name}</p>
                    <p className="text-white/60 text-xs">{c.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/10 transition-all flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-all inline-flex items-center gap-1 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-black">
              <Edit3 className="h-3 w-3" /> Edit Categories
            </span>
          </div>
        </div>

        {/* --- Promo Banner --- */}
        <div className="relative group cursor-pointer border-b border-border" onClick={() => openEditor("promo")}>
          {promoState.enabled ? (
            <div className="relative h-48 md:h-64 overflow-hidden">
              <img src={promoState.imageUrl} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center px-8">
                <div className="text-white max-w-md">
                  <p className="text-xs tracking-widest uppercase text-gold-400">{promoState.tag}</p>
                  <h2 className="mt-2 text-3xl md:text-4xl font-bold">{promoState.title}<br /><span className="text-gradient-gold">{promoState.titleHighlight}</span></h2>
                  <p className="mt-3 text-sm text-white/70">{promoState.description}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-32 bg-muted flex items-center justify-center text-muted-foreground">Promo banner is hidden (click to edit)</div>
          )}
          <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/10 transition-all flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-all inline-flex items-center gap-1 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-black">
              <Edit3 className="h-3 w-3" /> Edit Promo Banner
            </span>
          </div>
        </div>

        {/* --- Best Sellers --- */}
        <Link href="/admin/products" className="relative group block border-b border-border">
          <div className="p-6">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="text-xs font-semibold tracking-[0.3em] uppercase text-gold-500">Best Sellers</span>
                <h2 className="mt-2 font-display text-2xl font-bold">Most Popular</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bestsellerProducts.slice(0, 4).map((p: any) => {
                const img = p.images?.[0]?.url;
                return (
                  <div key={p.id}>
                    <div className="aspect-[3/4] rounded-xl bg-muted overflow-hidden">
                      {img && <img src={img} alt={p.name} className="h-full w-full object-cover" />}
                    </div>
                    <p className="mt-2 text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">Rs.{Number(p.price).toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/10 transition-all flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-all inline-flex items-center gap-1 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-black">
              <Edit3 className="h-3 w-3" /> Manage Products
            </span>
          </div>
        </Link>

        {/* --- Social / Instagram --- */}
        <div className="relative group cursor-pointer" onClick={() => openEditor("social")}>
          {socialState.enabled ? (
            <div className="p-6 bg-card text-center">
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-gold-500">{socialState.title}</span>
              <h2 className="mt-2 font-display text-2xl font-bold">{socialState.handle}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{socialState.subtitle}</p>
              <div className="grid grid-cols-4 gap-3 mt-6 max-w-lg mx-auto">
                {(socialState.images || []).slice(0, 4).map((img: any, i: number) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-muted">
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-32 bg-card flex items-center justify-center text-muted-foreground">Social section is hidden (click to edit)</div>
          )}
          <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/10 transition-all flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-all inline-flex items-center gap-1 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-black">
              <Edit3 className="h-3 w-3" /> Edit Social
            </span>
          </div>
        </div>

        {/* --- Footer Preview --- */}
        <Link href="/admin/footer" className="relative group block border-t border-border bg-card p-4 text-center text-sm text-muted-foreground">
          © 2024 NEXTFITT. All rights reserved.
          <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/10 transition-all flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-all inline-flex items-center gap-1 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-black">
              <Edit3 className="h-3 w-3" /> Edit Footer
            </span>
          </div>
        </Link>

      </div>

      {/* ==================== EDITOR DIALOG ==================== */}
      {editingSection && editData && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10">
          <div className="fixed inset-0 bg-black/50" onClick={() => { setEditingSection(null); setEditData(null); }} />
          <div className="relative bg-background border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto z-10">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h2 className="text-lg font-bold">{editingSection === "announcement" ? "Announcement Bar" : editingSection === "features" ? "Features Bar" : editingSection === "categories" ? "Categories" : editingSection === "promo" ? "Promo Banner" : "Social / Instagram"}</h2>
              </div>
              <button onClick={() => { setEditingSection(null); setEditData(null); }} className="rounded-lg p-2 hover:bg-muted"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              {editingSection === "announcement" && (
                <>
                  <ToggleField label="Show" value={editData.enabled} onChange={(v: boolean) => setEditData((prev: any) => ({ ...prev, enabled: v }))} />
                  <TextField label="Text" value={editData.text} onChange={(v) => setEditData((prev: any) => ({ ...prev, text: v }))} />
                  <TextField label="Highlight" value={editData.highlightText} onChange={(v) => setEditData((prev: any) => ({ ...prev, highlightText: v }))} />
                  <TextField label="Coupon Code" value={editData.couponCode} onChange={(v) => setEditData((prev: any) => ({ ...prev, couponCode: v }))} />
                </>
              )}
              {editingSection === "features" && Array.isArray(editData) && editData.map((f: any, i: number) => (
                <div key={i} className="rounded-xl border border-border p-4">
                  <p className="text-sm font-semibold mb-2">Feature #{i + 1}</p>
                  <TextField label="Icon" value={f.icon} onChange={(v) => { const arr = [...editData]; arr[i] = { ...arr[i], icon: v }; setEditData(arr); }} />
                  <TextField label="Title" value={f.title} onChange={(v) => { const arr = [...editData]; arr[i] = { ...arr[i], title: v }; setEditData(arr); }} />
                  <TextField label="Description" value={f.description} onChange={(v) => { const arr = [...editData]; arr[i] = { ...arr[i], description: v }; setEditData(arr); }} />
                </div>
              ))}
              {editingSection === "categories" && Array.isArray(editData) && editData.map((c: any, i: number) => (
                <div key={i} className="rounded-xl border border-border p-4">
                  <p className="text-sm font-semibold mb-2">Category #{i + 1}</p>
                  <TextField label="Name" value={c.name} onChange={(v) => { const arr = [...editData]; arr[i] = { ...arr[i], name: v }; setEditData(arr); }} />
                  <TextField label="Image URL" value={c.image} onChange={(v) => { const arr = [...editData]; arr[i] = { ...arr[i], image: v }; setEditData(arr); }} />
                  {c.image && <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted mt-1"><img src={c.image} alt="" className="h-full w-full object-cover" /></div>}
                  <TextField label="Link URL" value={c.href} onChange={(v) => { const arr = [...editData]; arr[i] = { ...arr[i], href: v }; setEditData(arr); }} />
                  <TextField label="Count" value={c.count} onChange={(v) => { const arr = [...editData]; arr[i] = { ...arr[i], count: v }; setEditData(arr); }} />
                </div>
              ))}
              {editingSection === "promo" && (
                <>
                  <ToggleField label="Show" value={editData.enabled} onChange={(v: boolean) => setEditData((prev: any) => ({ ...prev, enabled: v }))} />
                  <TextField label="Tag" value={editData.tag} onChange={(v) => setEditData((prev: any) => ({ ...prev, tag: v }))} />
                  <TextField label="Title" value={editData.title} onChange={(v) => setEditData((prev: any) => ({ ...prev, title: v }))} />
                  <TextField label="Title Highlight" value={editData.titleHighlight} onChange={(v) => setEditData((prev: any) => ({ ...prev, titleHighlight: v }))} />
                  <TextField label="Description" value={editData.description} onChange={(v) => setEditData((prev: any) => ({ ...prev, description: v }))} textarea />
                  <TextField label="Image URL" value={editData.imageUrl} onChange={(v) => setEditData((prev: any) => ({ ...prev, imageUrl: v }))} />
                  {editData.imageUrl && <div className="h-24 rounded-xl overflow-hidden bg-muted"><img src={editData.imageUrl} alt="" className="h-full w-full object-cover" /></div>}
                  <div className="grid grid-cols-2 gap-3">
                    <TextField label="Button 1" value={editData.button1Text} onChange={(v) => setEditData((prev: any) => ({ ...prev, button1Text: v }))} />
                    <TextField label="Button 1 Link" value={editData.button1Link} onChange={(v) => setEditData((prev: any) => ({ ...prev, button1Link: v }))} />
                    <TextField label="Button 2" value={editData.button2Text} onChange={(v) => setEditData((prev: any) => ({ ...prev, button2Text: v }))} />
                    <TextField label="Button 2 Link" value={editData.button2Link} onChange={(v) => setEditData((prev: any) => ({ ...prev, button2Link: v }))} />
                  </div>
                </>
              )}
              {editingSection === "social" && (
                <>
                  <ToggleField label="Show" value={editData.enabled} onChange={(v: boolean) => setEditData((prev: any) => ({ ...prev, enabled: v }))} />
                  <TextField label="Title" value={editData.title} onChange={(v) => setEditData((prev: any) => ({ ...prev, title: v }))} />
                  <TextField label="Handle" value={editData.handle} onChange={(v) => setEditData((prev: any) => ({ ...prev, handle: v }))} />
                  <TextField label="Subtitle" value={editData.subtitle} onChange={(v) => setEditData((prev: any) => ({ ...prev, subtitle: v }))} />
                  <p className="text-sm font-semibold mt-4">Images</p>
                  {(editData.images || []).map((img: any, i: number) => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground">Image #{i + 1}</label>
                        <input type="text" value={img.url} onChange={(e) => {
                          const newImages = [...editData.images];
                          newImages[i] = { ...newImages[i], url: e.target.value };
                          setEditData((prev: any) => ({ ...prev, images: newImages }));
                        }} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:border-gold-500 focus:outline-none mt-1" />
                      </div>
                      {img.url && <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted mt-5 flex-shrink-0"><img src={img.url} alt="" className="h-full w-full object-cover" /></div>}
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-border">
              <button onClick={() => { setEditingSection(null); setEditData(null); }} className="rounded-full border border-border px-5 py-2.5 text-sm font-medium">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black hover:bg-gold-600 disabled:opacity-50">
                <Save className="h-4 w-4 inline mr-1" />{saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============== FORM FIELDS ==============
function TextField({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div>
      <label className="text-xs font-medium mb-1 block text-muted-foreground">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none resize-none" />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none" />
      )}
    </div>
  );
}

function ToggleField({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-3">
      <p className="text-sm font-medium">{label}</p>
      <button type="button" onClick={() => onChange(!value)} className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-gold-500" : "bg-muted"}`}>
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${value ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}