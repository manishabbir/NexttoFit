"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Truck, RotateCcw, Edit3, Eye, X, Save, Image as ImageIcon, Bell, Globe, CreditCard, Percent, DollarSign, Upload, Instagram, Star } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import toast from "react-hot-toast";

// ============== ICON MAP ==============
const iconMap: Record<string, React.ElementType> = { Truck, Shield, RotateCcw, Sparkles };

// ============== SECTION DEFINITIONS ==============
interface Section {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  editLink?: string;
  editInline?: boolean;
}

const sections: Section[] = [
  { id: "announcement", label: "Announcement Bar", description: "Top strip banner with coupon code", icon: Bell, editLink: "/admin/settings" },
  { id: "hero", label: "Hero Slider", description: "Main rotating banners", icon: Eye, editLink: "/admin/banners" },
  { id: "features", label: "Features Bar", description: "4 feature icons row", icon: Truck, editInline: true },
  { id: "featured", label: "Featured Products", description: "Product grid from DB", icon: Star, editLink: "/admin/products" },
  { id: "categories", label: "Categories", description: "3 category cards", icon: ImageIcon, editInline: true },
  { id: "promo", label: "Promo Banner", description: "Full-width promo section", icon: Globe, editInline: true },
  { id: "bestsellers", label: "Best Sellers", description: "Most popular products", icon: Star, editLink: "/admin/products" },
  { id: "social", label: "Social/Instagram", description: "Social proof grid", icon: Instagram, editInline: true },
];

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

const defaultSocialImages = [
  "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80",
  "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
  "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&q=80",
  "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&q=80",
];

export default function AdminHomeEditorPage() {
  // All section states
  const [announcement, setAnnouncement] = useState({ enabled: true, text: "FREE SHIPPING ·", highlightText: "on orders over Rs5,000", couponCode: "WELCOME20" });
  const [features, setFeatures] = useState(defaultFeatures);
  const [categories, setCategories] = useState(defaultCategories);
  const [promoBanner, setPromoBanner] = useState<any>({ enabled: true, tag: "Limited Edition", title: "Summer Collection", titleHighlight: "2024", description: "Embrace the season with our curated summer collection.", imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80", button1Text: "Explore Collection", button1Link: "/new-arrivals", button2Text: "View Sale", button2Link: "/sale" });
  const [socialSection, setSocialSection] = useState<any>({ enabled: true, title: "Follow Us", handle: "@nextfitt", subtitle: "Tag us in your looks", images: defaultSocialImages.map((u) => ({ url: u, alt: "" })) });
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [settingsRes, bannersRes] = await Promise.all([
        fetch("/api/site-settings"),
        fetch("/api/banners"),
      ]);
      const settingsData = await settingsRes.json();
      const bannersData = await bannersRes.json();

      if (Array.isArray(bannersData)) setBanners(bannersData.filter((b: any) => b.isActive));

      if (settingsData?.store_settings) {
        const s = JSON.parse(settingsData.store_settings);
        if (s.announcement) setAnnouncement((prev) => ({ ...prev, ...s.announcement }));
        if (s.features) setFeatures(s.features);
        if (s.categories) setCategories(s.categories);
        if (s.promoBanner) setPromoBanner((prev: any) => ({ ...prev, ...s.promoBanner }));
        if (s.social) setSocialSection((prev: any) => ({ ...prev, ...s.social }));
      }
    } catch (e) { console.error("Error loading:", e); }
    finally { setLoading(false); }
  };

  const openEditor = (sectionId: string) => {
    // For complex sections that need their own admin pages, redirect
    if (sectionId === "hero") { window.location.href = "/admin/banners"; return; }
    if (sectionId === "featured") { window.location.href = "/admin/products"; return; }
    if (sectionId === "bestsellers") { window.location.href = "/admin/products"; return; }

    setEditingSection(sectionId);
    switch (sectionId) {
      case "announcement": setEditData({ ...announcement }); break;
      case "features": setEditData(features.map((f) => ({ ...f }))); break;
      case "categories": setEditData(categories.map((c) => ({ ...c }))); break;
      case "promo": setEditData({ ...promoBanner }); break;
      case "social": setEditData({ ...socialSection, images: socialSection.images?.map((i: any) => ({ ...i })) || [] }); break;
      default: setEditData(null);
    }
  };

  const handleSaveInline = async () => {
    if (!editingSection || !editData) return;
    setSaving(true);
    try {
      const newSettings: any = {};
      const currentSettings: any = {};

      // Build the updated settings object
      switch (editingSection) {
        case "announcement": {
          currentSettings.announcement = editData;
          const updated = { ...announcement, ...editData };
          setAnnouncement(updated);
          newSettings.announcement_bar = JSON.stringify(updated);
          break;
        }
        case "features": {
          setFeatures(editData);
          newSettings.features_bar = JSON.stringify(editData);
          break;
        }
        case "categories": {
          setCategories(editData);
          newSettings.categories = JSON.stringify(editData);
          break;
        }
        case "promo": {
          setPromoBanner(editData);
          newSettings.promo_banner = JSON.stringify(editData);
          break;
        }
        case "social": {
          setSocialSection(editData);
          newSettings.social_section = JSON.stringify(editData);
          break;
        }
      }

      // Preserve other settings
      const res = await fetch("/api/site-settings");
      const existing = await res.json();
      if (existing?.store_settings) {
        const parsed = JSON.parse(existing.store_settings);
        Object.assign(parsed, currentSettings);
        newSettings.store_settings = JSON.stringify(parsed);
      }

      const saveRes = await fetch("/api/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: newSettings }),
      });

      if (saveRes.ok) {
        toast.success(`${sections.find((s) => s.id === editingSection)?.label} updated!`);
        setEditingSection(null);
        setEditData(null);
      } else {
        toast.error("Failed to save");
      }
    } catch { toast.error("Error saving"); }
    finally { setSaving(false); }
  };

  // ============== PREVIEW SECTION RENDERERS ==============
  const renderPreview = (id: string) => {
    switch (id) {
      case "announcement":
        return (
          <div className="bg-gradient-to-r from-luxury-950 via-gold-800 to-luxury-950 text-white text-center py-2 px-4 text-xs md:text-sm uppercase tracking-wider">
            {announcement.text} <span className="text-gold-300">{announcement.highlightText}</span>
            {announcement.couponCode ? ` · Use code: ${announcement.couponCode}` : ""}
          </div>
        );
      case "hero":
        return banners.length > 0 ? (
          <div className="relative h-40 bg-gradient-to-r from-luxury-950 to-luxury-900 flex items-center px-6">
            <img src={banners[0]?.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
            <div className="relative text-white"><p className="text-lg font-bold">{banners[0]?.title}</p><p className="text-gold-400">{banners[0]?.subtitle}</p><p className="text-xs text-white/60 mt-1">{banners.length} slide(s)</p></div>
          </div>
        ) : <div className="h-40 bg-muted flex items-center justify-center text-muted-foreground text-sm">No active banners</div>;
      case "features":
        return (
          <div className="grid grid-cols-4 gap-2 p-3 bg-card border-b border-border">
            {features.map((f, i) => {
              const Icon = iconMap[f.icon] || Truck;
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gold-500/10 flex items-center justify-center"><Icon className="h-4 w-4 text-gold-500" /></div>
                  <div><p className="text-xs font-medium">{f.title}</p><p className="text-[10px] text-muted-foreground">{f.description}</p></div>
                </div>
              );
            })}
          </div>
        );
      case "categories":
        return (
          <div className="grid grid-cols-3 gap-2 p-3 bg-card">
            {categories.map((c, i) => (
              <div key={i} className="relative h-24 rounded-xl overflow-hidden">
                <img src={c.image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                  <p className="text-white text-xs font-bold">{c.name}</p>
                </div>
              </div>
            ))}
          </div>
        );
      case "promo":
        return (
          <div className="relative h-40 overflow-hidden">
            <img src={promoBanner.imageUrl} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center px-6">
              <div className="text-white"><p className="text-xs text-gold-400 uppercase tracking-widest">{promoBanner.tag}</p><p className="text-lg font-bold">{promoBanner.title} <span className="text-gold-400">{promoBanner.titleHighlight}</span></p></div>
            </div>
          </div>
        );
      case "social":
        return (
          <div className="p-3 bg-card">
            <p className="text-center text-sm font-bold mb-2">{socialSection.handle}</p>
            <div className="grid grid-cols-4 gap-1">
              {(socialSection.images || []).slice(0, 4).map((img: any, i: number) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  // ============== EDITOR DIALOG ==============
  const renderEditor = () => {
    if (!editingSection || !editData) return null;

    const updateEditData = (path: string, value: any) => {
      setEditData((prev: any) => {
        const newData = Array.isArray(prev) ? [...prev] : { ...prev };
        if (Array.isArray(newData)) return newData;
        const keys = path.split(".");
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
        current[keys[keys.length - 1]] = value;
        return newData;
      });
    };

    const updateArrayItem = (index: number, field: string, value: string) => {
      setEditData((prev: any) => {
        if (!Array.isArray(prev)) return prev;
        const arr = [...prev];
        arr[index] = { ...arr[index], [field]: value };
        return arr;
      });
    };

    const section = sections.find((s) => s.id === editingSection);

    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-10">
        <div className="fixed inset-0 bg-black/50" onClick={() => setEditingSection(null)} />
        <div className="relative bg-background border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto z-10">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h2 className="text-lg font-bold">{section?.label}</h2>
              <p className="text-xs text-muted-foreground">{section?.description}</p>
            </div>
            <button onClick={() => setEditingSection(null)} className="rounded-lg p-2 hover:bg-muted"><X className="h-5 w-5" /></button>
          </div>
          <div className="p-4 space-y-4">
            {editingSection === "announcement" && (
              <>
                <ToggleField label="Show Announcement Bar" value={editData.enabled} onChange={(v: boolean) => updateEditData("enabled", v)} />
                <TextField label="Text" value={editData.text} onChange={(v) => updateEditData("text", v)} />
                <TextField label="Highlight Text" value={editData.highlightText} onChange={(v) => updateEditData("highlightText", v)} />
                <TextField label="Coupon Code" value={editData.couponCode} onChange={(v) => updateEditData("couponCode", v)} />
              </>
            )}
            {editingSection === "features" && Array.isArray(editData) && editData.map((f: any, i: number) => (
              <div key={i} className="rounded-xl border border-border p-4">
                <p className="text-sm font-semibold mb-3">Feature #{i + 1}</p>
                <TextField label="Icon" value={f.icon} onChange={(v) => updateArrayItem(i, "icon", v)} />
                <TextField label="Title" value={f.title} onChange={(v) => updateArrayItem(i, "title", v)} />
                <TextField label="Description" value={f.description} onChange={(v) => updateArrayItem(i, "description", v)} />
              </div>
            ))}
            {editingSection === "categories" && Array.isArray(editData) && editData.map((c: any, i: number) => (
              <div key={i} className="rounded-xl border border-border p-4">
                <p className="text-sm font-semibold mb-3">Category #{i + 1}</p>
                <TextField label="Name" value={c.name} onChange={(v) => updateArrayItem(i, "name", v)} />
                <TextField label="Link URL" value={c.href} onChange={(v) => updateArrayItem(i, "href", v)} />
                <TextField label="Image URL" value={c.image} onChange={(v) => updateArrayItem(i, "image", v)} />
                {c.image && <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted mt-1"><img src={c.image} alt="" className="h-full w-full object-cover" /></div>}
                <TextField label="Product Count" value={c.count} onChange={(v) => updateArrayItem(i, "count", v)} />
              </div>
            ))}
            {editingSection === "promo" && (
              <>
                <ToggleField label="Show Promo Banner" value={editData.enabled} onChange={(v) => updateEditData("enabled", v)} />
                <TextField label="Tag" value={editData.tag} onChange={(v) => updateEditData("tag", v)} />
                <TextField label="Title" value={editData.title} onChange={(v) => updateEditData("title", v)} />
                <TextField label="Title Highlight" value={editData.titleHighlight} onChange={(v) => updateEditData("titleHighlight", v)} />
                <TextField label="Description" value={editData.description} onChange={(v) => updateEditData("description", v)} textarea />
                <TextField label="Background Image URL" value={editData.imageUrl} onChange={(v) => updateEditData("imageUrl", v)} />
                {editData.imageUrl && <div className="h-24 rounded-xl overflow-hidden bg-muted"><img src={editData.imageUrl} alt="" className="h-full w-full object-cover" /></div>}
                <div className="grid grid-cols-2 gap-3">
                  <TextField label="Button 1" value={editData.button1Text} onChange={(v) => updateEditData("button1Text", v)} />
                  <TextField label="Button 1 Link" value={editData.button1Link} onChange={(v) => updateEditData("button1Link", v)} />
                  <TextField label="Button 2" value={editData.button2Text} onChange={(v) => updateEditData("button2Text", v)} />
                  <TextField label="Button 2 Link" value={editData.button2Link} onChange={(v) => updateEditData("button2Link", v)} />
                </div>
              </>
            )}
            {editingSection === "social" && (
              <>
                <ToggleField label="Show Social Section" value={editData.enabled} onChange={(v) => updateEditData("enabled", v)} />
                <TextField label="Title" value={editData.title} onChange={(v) => updateEditData("title", v)} />
                <TextField label="Handle" value={editData.handle} onChange={(v) => updateEditData("handle", v)} />
                <TextField label="Subtitle" value={editData.subtitle} onChange={(v) => updateEditData("subtitle", v)} />
                <p className="text-sm font-semibold mt-4 mb-2">Images</p>
                {(editData.images || []).map((img: any, i: number) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <TextField label={`Image #${i + 1}`} value={img.url} onChange={(v) => {
                        const newImages = [...editData.images];
                        newImages[i] = { ...newImages[i], url: v };
                        updateEditData("images", newImages);
                      }} />
                    </div>
                    {img.url && <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted mt-5 flex-shrink-0"><img src={img.url} alt="" className="h-full w-full object-cover" /></div>}
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="flex items-center justify-end gap-3 p-4 border-t border-border">
            <button onClick={() => setEditingSection(null)} className="rounded-full border border-border px-5 py-2.5 text-sm font-medium">Cancel</button>
            <button onClick={handleSaveInline} disabled={saving} className="rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black hover:bg-gold-600 disabled:opacity-50">
              <Save className="h-4 w-4 inline mr-1" />{saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="p-6 animate-pulse space-y-4"><div className="h-8 w-64 rounded bg-muted" /><div className="h-96 rounded-2xl bg-muted" /></div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">🎨 Homepage Editor</h1>
        <p className="text-sm text-muted-foreground">Click on any section to edit its content. Changes save instantly to Supabase.</p>
      </div>

      {/* Section Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <div key={section.id} className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:border-gold-500 transition-all">
            {/* Preview */}
            <div className="pointer-events-none">
              {renderPreview(section.id)}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
              <button
                onClick={() => openEditor(section.id)}
                className="opacity-0 group-hover:opacity-100 transition-all inline-flex items-center gap-2 rounded-full bg-gold-500 px-4 py-2 text-xs font-semibold text-black"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit {section.label}
              </button>
            </div>

            {/* Label */}
            <div className="p-3 border-t border-border">
              <div className="flex items-center gap-2">
                <section.icon className="h-4 w-4 text-gold-500" />
                <p className="text-sm font-medium">{section.label}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{section.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Hero Banners", href: "/admin/banners", desc: "Add/remove slider images" },
            { label: "Products", href: "/admin/products", desc: "Manage catalog & featured" },
            { label: "Footer", href: "/admin/footer", desc: "Edit footer content" },
            { label: "All Settings", href: "/admin/settings", desc: "Checkout, shipping, etc." },
          ].map((link) => (
            <Link key={link.label} href={link.href} className="rounded-xl border border-border p-4 hover:border-gold-500 transition-colors">
              <p className="text-sm font-semibold">{link.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Editor Dialog */}
      {renderEditor()}
    </div>
  );
}

// ============== REUSABLE FORM FIELDS ==============
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