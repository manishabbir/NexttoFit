"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Eye, Search, CheckCircle, XCircle, RotateCcw, Edit3 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface PageContent {
  [key: string]: any;
}

const pageMeta: Record<string, { name: string; route: string; type: string; description: string }> = {
  about: { name: "About Us", route: "/about", type: "content", description: "Company story, features, and CTA" },
  contact: { name: "Contact Us", route: "/contact", type: "content", description: "Contact info and form settings" },
  faqs: { name: "FAQs", route: "/faqs", type: "content", description: "Frequently asked questions" },
  "shipping-returns": { name: "Shipping & Returns", route: "/shipping-returns", type: "content", description: "Shipping and return policies" },
  privacy: { name: "Privacy Policy", route: "/privacy", type: "legal", description: "Privacy policy sections" },
  terms: { name: "Terms & Conditions", route: "/terms", type: "legal", description: "Terms of service sections" },
  "size-guide": { name: "Size Guide", route: "/size-guide", type: "content", description: "Size charts and measurements" },
  "order-tracking": { name: "Order Tracking", route: "/order-tracking", type: "feature", description: "Order tracking page" },
  careers: { name: "Careers", route: "/careers", type: "content", description: "Careers and job info" },
  "gift-cards": { name: "Gift Cards", route: "/gift-cards", type: "feature", description: "Gift card information" },
};

export default function AdminPagesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [content, setContent] = useState<PageContent>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedPages, setSavedPages] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pages");
      const data = await res.json();
      const saved = new Set<string>(Object.keys(data));
      setSavedPages(saved);

      if (editingPage) {
        const pageRes = await fetch(`/api/pages?page=${editingPage}`);
        const pageData = await pageRes.json();
        setContent(pageData.content || {});
      }
    } catch (error) {
      console.error("Error loading pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const editPage = async (pageName: string) => {
    setEditingPage(pageName);
    setLoading(true);
    try {
      const res = await fetch(`/api/pages?page=${pageName}`);
      const data = await res.json();
      setContent(data.content || {});
    } catch (error) {
      console.error("Error loading page content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingPage) return;
    setSaving(true);
    try {
      const res = await fetch("/api/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: editingPage, content }),
      });

      if (res.ok) {
        toast.success(`${pageMeta[editingPage]?.name || editingPage} saved successfully!`);
        setSavedPages(new Set(Array.from(savedPages).concat([editingPage])));
      } else {
        toast.error("Failed to save page content");
      }
    } catch (error) {
      toast.error("Error saving page content");
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = async (pageName: string) => {
    if (!confirm(`Reset "${pageMeta[pageName]?.name || pageName}" to default content?`)) return;

    try {
      const res = await fetch("/api/pages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: pageName }),
      });

      if (res.ok) {
        toast.success("Reset to default content");
        const newSaved = new Set(savedPages);
        newSaved.delete(pageName);
        setSavedPages(newSaved);
        if (editingPage === pageName) {
          await editPage(pageName);
        }
      }
    } catch (error) {
      toast.error("Error resetting page");
    }
  };

  const updateContent = (key: string, value: any) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const updateNestedContent = (path: string[], value: any) => {
    setContent((prev) => {
      const newContent = { ...prev };
      let current: any = newContent;
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...current[path[i]] };
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newContent;
    });
  };

  const updateArrayItem = (key: string, index: number, subKey: string, value: string) => {
    setContent((prev) => {
      const arr = [...(prev[key] || [])];
      if (!arr[index]) return prev;
      arr[index] = { ...arr[index], [subKey]: value };
      return { ...prev, [key]: arr };
    });
  };

  const updateStringArrayItem = (key: string, nestedIndex: number | null, nestedKey: string | null, itemIndex: number, value: string) => {
    setContent((prev) => {
      if (nestedIndex === null || !nestedKey) {
        const arr = [...(prev[key] || [])];
        arr[itemIndex] = value;
        return { ...prev, [key]: arr };
      }
      const arr = [...(prev[key] || [])];
      if (!arr[nestedIndex]) return prev;
      const nestedArr = [...(arr[nestedIndex][nestedKey] || [])];
      nestedArr[itemIndex] = value;
      arr[nestedIndex] = { ...arr[nestedIndex], [nestedKey]: nestedArr };
      return { ...prev, [key]: arr };
    });
  };

  const filteredPages = Object.entries(pageMeta)
    .filter(([_, meta]) => filter === "All" || meta.type === filter)
    .filter(([_, meta]) => meta.name.toLowerCase().includes(search.toLowerCase()));

  if (editingPage && !loading) {
    const meta = pageMeta[editingPage];
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button onClick={() => { setEditingPage(null); loadPages(); }} className="text-sm text-gold-500 hover:text-gold-400 mb-1 block">
              ← Back to Pages
            </button>
            <h1 className="text-2xl font-bold">{meta?.name || editingPage}</h1>
            <p className="text-sm text-muted-foreground">{meta?.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => resetToDefault(editingPage)} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:border-red-500 hover:text-red-500 transition-colors">
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
            <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600 disabled:opacity-50">
              <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="max-w-4xl space-y-6">
          <PageEditor
            content={content}
            updateContent={updateContent}
            updateNestedContent={updateNestedContent}
            updateArrayItem={updateArrayItem}
            updateStringArrayItem={updateStringArrayItem}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Pages</h1>
          <p className="text-sm text-muted-foreground">Manage all website page content</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: "Total Pages", value: Object.keys(pageMeta).length.toString(), change: "All pages" },
          { label: "Customized", value: `${savedPages.size}`, change: `${Math.round((savedPages.size / Object.keys(pageMeta).length) * 100)}% customized` },
          { label: "Content Pages", value: "8", change: "About, FAQ, etc." },
          { label: "Legal Pages", value: "2", change: "Privacy, Terms" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-gold-500 mt-0.5">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search pages..." className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
        </div>
        {["All", "content", "legal", "feature"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${filter === f ? "bg-gold-500 text-black" : "border border-border text-muted-foreground hover:bg-muted"}`}>
            {f === "All" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredPages.map(([key, meta], i) => (
          <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-gold-500/10 p-3"><Edit3 className="h-5 w-5 text-gold-500" /></div>
                <div>
                  <p className="text-sm font-medium">{meta.name}</p>
                  <p className="text-xs text-muted-foreground">{meta.route}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{meta.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`flex items-center gap-1 text-xs font-medium ${savedPages.has(key) ? "text-green-500" : "text-yellow-500"}`}>
                  {savedPages.has(key) ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  {savedPages.has(key) ? "Customized" : "Default"}
                </span>
                <Link href={meta.route} target="_blank" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <Eye className="h-4 w-4" />
                </Link>
                <button onClick={() => editPage(key)} className="rounded-lg bg-gold-500/10 p-2 text-gold-500 hover:bg-gold-500/20 transition-colors">
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PageEditor({
  content,
  updateContent,
  updateNestedContent,
  updateArrayItem,
  updateStringArrayItem,
}: {
  content: PageContent;
  updateContent: (key: string, value: any) => void;
  updateNestedContent: (path: string[], value: any) => void;
  updateArrayItem: (key: string, index: number, subKey: string, value: string) => void;
  updateStringArrayItem: (key: string, nestedIndex: number | null, nestedKey: string | null, itemIndex: number, value: string) => void;
}) {
  const renderField = (key: string, value: any, path: string[] = []) => {
    if (Array.isArray(value)) {
      // Array of objects (e.g. features, sections, questions, info)
      if (value.length > 0 && typeof value[0] === "object") {
        return (
          <div key={key} className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4 capitalize">{key.replace(/-/g, " ")}</h3>
            <div className="space-y-4">
              {value.map((item: any, index: number) => (
                <div key={index} className="rounded-xl border border-border p-4 space-y-3">
                  {Object.entries(item).map(([itemKey, itemValue]) => {
                    // Handle nested string arrays (e.g. items: ["item1", "item2"])
                    if (Array.isArray(itemValue) && itemValue.length > 0 && typeof itemValue[0] === "string") {
                      return (
                        <div key={itemKey}>
                          <label className="text-xs font-medium mb-1 block capitalize">{itemKey.replace(/-/g, " ")}</label>
                          <div className="space-y-1.5">
                            {(itemValue as string[]).map((str: string, si: number) => (
                              <div key={si} className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground w-4">{si + 1}.</span>
                                <input
                                  type="text"
                                  value={str}
                                  onChange={(e) => {
                                    const newContent = { ...content };
                                    const arr = [...(newContent[key] || [])];
                                    const nestedArr = [...(arr[index][itemKey] || [])];
                                    nestedArr[si] = e.target.value;
                                    arr[index] = { ...arr[index], [itemKey]: nestedArr };
                                    updateContent(key, arr);
                                  }}
                                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    // Regular string or number fields in objects
                    return (
                      <div key={itemKey}>
                        <label className="text-xs font-medium mb-1 block capitalize">{itemKey.replace(/-/g, " ")}</label>
                        {typeof itemValue === "string" && (itemValue as string).length > 80 ? (
                          <textarea
                            value={itemValue as string}
                            onChange={(e) => {
                              const newContent = { ...content };
                              const arr = [...(newContent[key] || [])];
                              arr[index] = { ...arr[index], [itemKey]: e.target.value };
                              updateContent(key, arr);
                            }}
                            rows={3}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none resize-none"
                          />
                        ) : (
                          <input
                            type="text"
                            value={itemValue as string}
                            onChange={(e) => {
                              const newContent = { ...content };
                              const arr = [...(newContent[key] || [])];
                              arr[index] = { ...arr[index], [itemKey]: e.target.value };
                              updateContent(key, arr);
                            }}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        );
      }

      // Array of plain strings (e.g. tags)
      if (value.length > 0 && typeof value[0] === "string") {
        return (
          <div key={key} className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4 capitalize">{key.replace(/-/g, " ")}</h3>
            <div className="space-y-2">
              {value.map((item: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{index + 1}.</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newArray = [...value];
                      newArray[index] = e.target.value;
                      updateContent(key, newArray);
                    }}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      }
    }

    // Object with specific known keys (e.g. cta with title, description, buttonText, buttonLink)
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      if (["title", "description", "buttonText", "buttonLink"].some((k) => k in value)) {
        return (
          <div key={key} className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4 capitalize">{key.replace(/-/g, " ")}</h3>
            <div className="space-y-3">
              {Object.entries(value).map(([subKey, subValue]) => (
                <div key={subKey}>
                  <label className="text-xs font-medium mb-1 block capitalize">{subKey.replace(/-/g, " ")}</label>
                  <input
                    type="text"
                    value={subValue as string}
                    onChange={(e) => updateNestedContent([key, subKey], e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      }
    }

    // Plain strings
    if (typeof value === "string") {
      if (value.startsWith("<")) {
        return (
          <div key={key} className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4 capitalize">{key.replace(/-/g, " ")}</h3>
            <textarea
              value={value}
              onChange={(e) => updateContent(key, e.target.value)}
              rows={10}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-mono focus:border-gold-500 focus:outline-none resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">HTML content supported</p>
          </div>
        );
      }

      return (
        <div key={key} className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4 capitalize">{key.replace(/-/g, " ")}</h3>
          {value.length > 80 ? (
            <textarea
              value={value}
              onChange={(e) => updateContent(key, e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none resize-none"
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => updateContent(key, e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none"
            />
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {Object.entries(content).map(([key, value]) => renderField(key, value))}
    </div>
  );
}