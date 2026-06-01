"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Eye, Star, StarOff, Save, X, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface ProductImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
  id?: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  comparePrice?: number | null;
  quantity: number;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isOnSale: boolean;
  images: ProductImage[];
}

interface ProductForm {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  price: string;
  comparePrice: string;
  quantity: string;
  description: string;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isOnSale: boolean;
  imageUrl: string;
}

const emptyForm: ProductForm = {
  name: "", slug: "", sku: "", price: "", comparePrice: "", quantity: "0",
  description: "", isActive: true, isFeatured: false, isNewArrival: false, isOnSale: false, imageUrl: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editing, setEditing] = useState<ProductForm | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) { console.error("Error:", error); }
    finally { setLoading(false); }
  };

  const toggleFeatured = async (product: Product) => {
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, isFeatured: !product.isFeatured }),
      });
      if (res.ok) {
        toast.success(product.isFeatured ? "Removed from featured" : "Added to featured");
        fetchProducts();
      }
    } catch { toast.error("Failed to update"); }
  };

  const openEdit = (product: Product) => {
    const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
    setEditing({
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: product.price.toString(),
      comparePrice: product.comparePrice?.toString() || "",
      quantity: product.quantity.toString(),
      description: "",
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      isOnSale: product.isOnSale,
      imageUrl: primaryImage?.url || "",
    });
    setShowForm(true);
  };

  const openNew = () => {
    setEditing({ ...emptyForm, sku: `NF-${Date.now().toString(36).toUpperCase()}` });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editing.name || !editing.price) {
      toast.error("Name and price are required");
      return;
    }
    setSaving(true);
    try {
      const body = {
        name: editing.name,
        slug: editing.slug || editing.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        sku: editing.sku,
        price: editing.price,
        comparePrice: editing.comparePrice || null,
        quantity: editing.quantity,
        isActive: editing.isActive,
        isFeatured: editing.isFeatured,
        isNewArrival: editing.isNewArrival,
        isOnSale: editing.isOnSale,
        imageUrl: editing.imageUrl,
        description: editing.description || "Product description",
      };

      const res = await fetch("/api/products", {
        method: editing.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing.id ? { id: editing.id, ...body } : body),
      });

      if (res.ok) {
        toast.success(editing.id ? "Product updated!" : "Product created!");
        setShowForm(false);
        setEditing(null);
        fetchProducts();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save");
      }
    } catch { toast.error("Error saving"); }
    finally { setSaving(false); }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const featuredCount = products.filter((p) => p.isFeatured).length;

  if (loading) {
    return <div className="p-6 animate-pulse space-y-4"><div className="h-8 w-48 rounded bg-muted" /><div className="h-96 rounded-2xl bg-muted" /></div>;
  }

  if (showForm && editing) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-sm text-gold-500 hover:text-gold-400 mb-1 block">← Back to Products</button>
            <h1 className="text-2xl font-bold">{editing.id ? "Edit Product" : "Add Product"}</h1>
          </div>
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black hover:bg-gold-600 disabled:opacity-50">
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
        <div className="max-w-2xl space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Product Details</h2>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Product Name *</label>
                  <input type="text" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Slug</label>
                  <input type="text" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-mono focus:border-gold-500 focus:outline-none" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">SKU</label>
                  <input type="text" value={editing.sku} onChange={(e) => setEditing({ ...editing, sku: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-mono focus:border-gold-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Description</label>
                  <input type="text" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Price (Rs.) *</label>
                  <input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Compare Price</label>
                  <input type="number" value={editing.comparePrice} onChange={(e) => setEditing({ ...editing, comparePrice: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Stock Quantity</label>
                  <input type="number" value={editing.quantity} onChange={(e) => setEditing({ ...editing, quantity: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Product Image</label>
                <ImageUploader
                  imageUrl={editing.imageUrl}
                  onImageChange={(url) => setEditing({ ...editing, imageUrl: url })}
                  aspectRatio="4/3"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <ToggleSwitch label="Active" value={editing.isActive} onChange={(v) => setEditing({ ...editing, isActive: v })} />
                <ToggleSwitch label="Featured" value={editing.isFeatured} onChange={(v) => setEditing({ ...editing, isFeatured: v })} />
                <ToggleSwitch label="New Arrival" value={editing.isNewArrival} onChange={(v) => setEditing({ ...editing, isNewArrival: v })} />
                <ToggleSwitch label="On Sale" value={editing.isOnSale} onChange={(v) => setEditing({ ...editing, isOnSale: v })} />
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
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your product catalog</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: "Total Products", value: products.length.toString(), change: "In catalog" },
          { label: "Featured", value: featuredCount.toString(), change: "On homepage" },
          { label: "Active", value: products.filter((p) => p.isActive).length.toString(), change: "Visible" },
          { label: "On Sale", value: products.filter((p) => p.isOnSale).length.toString(), change: "Discounted" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-gold-500 mt-0.5">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-16 text-center">
          <p className="text-lg font-semibold mb-2">No products yet</p>
          <p className="text-sm text-muted-foreground mb-4">Click "Add Product" to create one</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((product, i) => {
            const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
            return (
              <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="rounded-2xl border border-border bg-card p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                    {primaryImage && <img src={primaryImage.url} alt={product.name} className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      {product.isFeatured && <span className="rounded-full bg-gold-500/20 px-2 py-0.5 text-[10px] font-medium text-gold-500">Featured</span>}
                      {product.isNewArrival && <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-medium text-blue-500">New</span>}
                      {product.isOnSale && <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-medium text-red-500">Sale</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">SKU: {product.sku}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-semibold">Rs.{Number(product.price).toLocaleString()}</span>
                      {product.comparePrice && <span className="text-xs text-muted-foreground line-through">Rs.{Number(product.comparePrice).toLocaleString()}</span>}
                      <span className="text-xs text-muted-foreground">Stock: {product.quantity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggleFeatured(product)}
                      className={`rounded-lg p-2 transition-colors ${product.isFeatured ? "text-gold-500 hover:bg-gold-500/10" : "text-muted-foreground hover:bg-muted"}`}
                      title={product.isFeatured ? "Remove from featured" : "Add to featured"}>
                      {product.isFeatured ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
                    </button>
                    <button onClick={() => openEdit(product)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <Link href={`/product/${product.slug}`} target="_blank" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ToggleSwitch({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-3">
      <span className="text-xs font-medium">{label}</span>
      <button type="button" onClick={() => onChange(!value)} className={`relative h-5 w-9 rounded-full transition-colors ${value ? "bg-gold-500" : "bg-muted"}`}>
        <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${value ? "translate-x-4" : "translate-x-0"}`} />
      </button>
    </div>
  );
}