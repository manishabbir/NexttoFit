"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight, Save, X, Image as ImageIcon, Link as LinkIcon, Upload } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  linkText: string;
  order: number;
  isActive: boolean;
  isHero: boolean;
}

interface UploadStats {
  originalSize: string;
  optimizedSize: string;
  savings: string;
  format: string;
}

const emptyBanner: Banner = {
  id: "",
  title: "",
  subtitle: "",
  description: "",
  imageUrl: "",
  linkUrl: "",
  linkText: "Shop Now",
  order: 1,
  isActive: true,
  isHero: true,
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState<UploadStats | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/banners");
      const data = await res.json();
      setBanners(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    setUploading(true);
    setUploadStats(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        // Set the uploaded image URL immediately
        if (editing) {
          setEditing({ ...editing, imageUrl: data.url });
        }
        // Save stats for permanent display
        if (data.savings) {
          setUploadStats({
            originalSize: data.originalSize,
            optimizedSize: data.optimizedSize,
            savings: data.savings,
            format: data.format,
          });
        }
        toast.success("Image uploaded successfully");
      } else {
        // Fallback: read as data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          if (editing) {
            setEditing({ ...editing, imageUrl: url });
          }
          toast.success("Image loaded");
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleAddNew = () => {
    setEditing({ ...emptyBanner, order: banners.length + 1 });
    setShowForm(true);
    setUploadStats(null);
  };

  const handleEdit = (banner: Banner) => {
    setEditing({ ...banner });
    setShowForm(true);
    setUploadStats(null);
  };

  const handleDelete = async (banner: Banner) => {
    if (!confirm(`Delete banner "${banner.title}"?`)) return;
    try {
      const res = await fetch("/api/banners", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: banner.id }),
      });
      if (res.ok) {
        toast.success("Banner deleted");
        fetchBanners();
      }
    } catch {
      toast.error("Failed to delete banner");
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      const res = await fetch("/api/banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: banner.id, isActive: !banner.isActive }),
      });
      if (res.ok) {
        fetchBanners();
        toast.success(banner.isActive ? "Banner deactivated" : "Banner activated");
      }
    } catch {
      toast.error("Failed to toggle banner");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    if (!editing.title || !editing.imageUrl) {
      toast.error("Title and image are required");
      return;
    }

    setSaving(true);
    try {
      const method = editing.id ? "PUT" : "POST";
      const res = await fetch("/api/banners", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });

      if (res.ok) {
        toast.success(editing.id ? "Banner updated!" : "Banner created!");
        setShowForm(false);
        setEditing(null);
        setUploadStats(null);
        fetchBanners();
      } else {
        toast.error("Failed to save banner");
      }
    } catch {
      toast.error("Error saving banner");
    } finally {
      setSaving(false);
    }
  };

  const activeBanners = banners.filter((b) => b.isActive).length;

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

  if (showForm && editing) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button onClick={() => { setShowForm(false); setEditing(null); setUploadStats(null); }} className="text-sm text-gold-500 hover:text-gold-400 mb-1 block">
              ← Back to Banners
            </button>
            <h1 className="text-2xl font-bold">{editing.id ? "Edit Banner" : "Add Banner"}</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Banner"}
          </button>
        </div>

        <div className="max-w-3xl space-y-6">
          {/* Image Upload */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><ImageIcon className="h-5 w-5 text-gold-500" /> Banner Image</h2>
            <div className="space-y-4">
              {/* Image Preview - shows uploaded image immediately */}
              {editing.imageUrl && (
                <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-muted">
                  <img src={editing.imageUrl} alt="Banner preview" className="h-full w-full object-cover" />
                  <button
                    onClick={() => { setEditing({ ...editing, imageUrl: "" }); setUploadStats(null); }}
                    className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Sharp Optimization Stats - permanent display */}
              {uploadStats && (
                <div className="rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">✓ Sharp Optimization</p>
                    <span className="text-xs font-mono text-green-600 dark:text-green-400">{uploadStats.format}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-lg bg-background/50 p-2">
                      <p className="text-muted-foreground">Original</p>
                      <p className="font-semibold">{uploadStats.originalSize}</p>
                    </div>
                    <div className="rounded-lg bg-background/50 p-2">
                      <p className="text-muted-foreground">Optimized</p>
                      <p className="font-semibold">{uploadStats.optimizedSize}</p>
                    </div>
                    <div className="rounded-lg bg-background/50 p-2">
                      <p className="text-muted-foreground">Saved</p>
                      <p className="font-semibold text-green-500">{uploadStats.savings}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload area */}
              <div className="flex gap-3">
                <label className="flex-1 cursor-pointer rounded-xl border-2 border-dashed border-border p-6 text-center hover:border-gold-500 transition-colors">
                  <input type="file" accept="image/*" onChange={handleUploadImage} className="hidden" />
                  <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    {uploading ? "Uploading & Optimizing..." : "Upload New Image"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Auto-converted to AVIF/WebP by Sharp</p>
                </label>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium">Or paste image URL</p>
                  <input
                    type="text"
                    value={editing.imageUrl}
                    onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Banner Content */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Banner Content</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Title *</label>
                <input type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="ELEVATE YOUR" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Subtitle (gold text)</label>
                <input type="text" value={editing.subtitle} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} placeholder="EVERYDAY STYLE" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} placeholder="Premium craftsmanship meets modern sophistication..." className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none resize-none" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Button Text</label>
                  <input type="text" value={editing.linkText} onChange={(e) => setEditing({ ...editing, linkText: e.target.value })} placeholder="Shop Now" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block flex items-center gap-2"><LinkIcon className="h-3 w-3" /> Button Link</label>
                  <input type="text" value={editing.linkUrl} onChange={(e) => setEditing({ ...editing, linkUrl: e.target.value })} placeholder="/men" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none font-mono" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Order / Priority</label>
                  <input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value) || 1 })} min={1} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
                </div>
                <div className="flex items-end pb-2.5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, isActive: !editing.isActive })}
                      className={`relative h-6 w-11 rounded-full transition-colors ${editing.isActive ? "bg-gold-500" : "bg-muted"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${editing.isActive ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                    <span className="text-sm font-medium">Active</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Preview</h2>
            <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-gradient-to-r from-luxury-950 via-luxury-900 to-luxury-950">
              {editing.imageUrl && (
                <img src={editing.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
              <div className="relative h-full flex flex-col justify-center px-8">
                <p className="text-xs tracking-widest uppercase text-gold-400 mb-2">Preview</p>
                <h3 className="text-2xl font-bold text-white">{editing.title}</h3>
                <p className="text-xl text-gold-400 font-semibold">{editing.subtitle}</p>
                <p className="text-sm text-white/70 mt-2 max-w-md">{editing.description}</p>
                <span className="mt-4 inline-flex w-fit rounded-full bg-gold-500 px-6 py-2 text-sm font-semibold text-black">
                  {editing.linkText || "Shop Now"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hero Banners</h1>
          <p className="text-sm text-muted-foreground">Manage homepage hero slider banners</p>
        </div>
        <button onClick={handleAddNew} className="flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
          <Plus className="h-4 w-4" /> Add Banner
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        {[
          { label: "Total Banners", value: banners.length.toString(), change: `${activeBanners} active` },
          { label: "Active Hero Slides", value: activeBanners.toString(), change: "In carousel" },
          { label: "Inactive", value: (banners.length - activeBanners).toString(), change: "Hidden" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-gold-500 mt-0.5">{stat.change}</p>
          </div>
        ))}
      </div>

      {banners.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-16 text-center">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No banners yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Create your first hero banner to display on the homepage</p>
          <button onClick={handleAddNew} className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-black">
            <Plus className="h-4 w-4" /> Add Your First Banner
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {banners.map((banner, i) => (
            <motion.div key={banner.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="h-48 w-full sm:w-72 flex-shrink-0 relative">
                  <img src={banner.imageUrl} alt={banner.title} className="h-full w-full object-cover" />
                  {!banner.isActive && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">Inactive</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{banner.title}</h3>
                      <p className="text-sm text-gold-500 mt-0.5">{banner.subtitle}</p>
                      {banner.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{banner.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {banner.isHero && <span className="rounded-full bg-gold-500/20 px-3 py-1 text-xs font-medium text-gold-500">Hero</span>}
                      <button onClick={() => handleToggleActive(banner)} className={`rounded-lg p-2 transition-colors ${banner.isActive ? "text-green-500 hover:bg-green-500/10" : "text-muted-foreground hover:bg-muted"}`}>
                        {banner.isActive ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      </button>
                      <button onClick={() => handleEdit(banner)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(banner)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span>Order: {banner.order}</span>
                    {banner.linkUrl && <span>Link: {banner.linkUrl}</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}