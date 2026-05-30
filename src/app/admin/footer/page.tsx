"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, GripVertical, Facebook, Instagram, Twitter, Youtube, Link, Mail, Phone, MapPin } from "lucide-react";
import toast from "react-hot-toast";

interface FooterLink {
  name: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  icon: string;
  href: string;
  label: string;
}

interface FooterData {
  brandName: string;
  brandDescription: string;
  address: string;
  phone: string;
  email: string;
  sections: FooterSection[];
  socialLinks: SocialLink[];
  copyright: string;
  paymentMethods: string;
  newsletterTitle: string;
  newsletterDescription: string;
}

const defaultFooterData: FooterData = {
  brandName: "NEXTFITT",
  brandDescription: "Premium fashion destination for the modern individual. Redefining style with exceptional craftsmanship and timeless designs.",
  address: "Lahore, Pakistan",
  phone: "+92 300 1234567",
  email: "hello@nextfitt.com",
  sections: [
    {
      title: "Shop",
      links: [
        { name: "New Arrivals", href: "/new-arrivals" },
        { name: "Men's Collection", href: "/men" },
        { name: "Women's Collection", href: "/women" },
        { name: "Sale", href: "/sale" },
        { name: "Gift Cards", href: "/gift-cards" },
      ],
    },
    {
      title: "Customer Care",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "FAQs", href: "/faqs" },
        { name: "Shipping & Returns", href: "/shipping-returns" },
        { name: "Size Guide", href: "/size-guide" },
        { name: "Order Tracking", href: "/order-tracking" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Journal", href: "/blog" },
        { name: "Careers", href: "/careers" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms & Conditions", href: "/terms" },
      ],
    },
  ],
  socialLinks: [
    { icon: "Facebook", href: "#", label: "Facebook" },
    { icon: "Instagram", href: "#", label: "Instagram" },
    { icon: "Twitter", href: "#", label: "Twitter" },
    { icon: "Youtube", href: "#", label: "Youtube" },
  ],
  copyright: "All rights reserved.",
  paymentMethods: "Visa, Mastercard, EasyPaisa, JazzCash",
  newsletterTitle: "Join the NEXTFITT Club",
  newsletterDescription: "Subscribe for exclusive access to new drops & 20% off your first order",
};

export default function AdminFooterPage() {
  const [footerData, setFooterData] = useState<FooterData>(defaultFooterData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("brand");

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const res = await fetch("/api/site-settings?key=footer");
      const data = await res.json();
      if (data?.value) {
        setFooterData(JSON.parse(data.value));
      }
    } catch (error) {
      console.error("Error fetching footer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            footer: JSON.stringify(footerData),
          },
        }),
      });

      if (res.ok) {
        toast.success("Footer settings saved successfully!");
      } else {
        toast.error("Failed to save footer settings");
      }
    } catch (error) {
      toast.error("Error saving footer settings");
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (sectionIndex: number, updatedSection: FooterSection) => {
    const newSections = [...footerData.sections];
    newSections[sectionIndex] = updatedSection;
    setFooterData({ ...footerData, sections: newSections });
  };

  const addSection = () => {
    setFooterData({
      ...footerData,
      sections: [
        ...footerData.sections,
        { title: "New Section", links: [{ name: "Link", href: "/" }] },
      ],
    });
  };

  const removeSection = (sectionIndex: number) => {
    setFooterData({
      ...footerData,
      sections: footerData.sections.filter((_, i) => i !== sectionIndex),
    });
  };

  const addLinkToSection = (sectionIndex: number) => {
    const section = footerData.sections[sectionIndex];
    updateSection(sectionIndex, {
      ...section,
      links: [...section.links, { name: "New Link", href: "/" }],
    });
  };

  const removeLinkFromSection = (sectionIndex: number, linkIndex: number) => {
    const section = footerData.sections[sectionIndex];
    updateSection(sectionIndex, {
      ...section,
      links: section.links.filter((_, i) => i !== linkIndex),
    });
  };

  const updateLinkInSection = (sectionIndex: number, linkIndex: number, field: "name" | "href", value: string) => {
    const section = footerData.sections[sectionIndex];
    const updatedLinks = [...section.links];
    updatedLinks[linkIndex] = { ...updatedLinks[linkIndex], [field]: value };
    updateSection(sectionIndex, { ...section, links: updatedLinks });
  };

  const updateSocialLink = (index: number, field: "href" | "label", value: string) => {
    const newSocialLinks = [...footerData.socialLinks];
    newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
    setFooterData({ ...footerData, socialLinks: newSocialLinks });
  };

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

  const tabs = [
    { id: "brand", label: "Brand Info" },
    { id: "sections", label: "Link Sections" },
    { id: "social", label: "Social Links" },
    { id: "newsletter", label: "Newsletter" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Footer Settings</h1>
          <p className="text-sm text-muted-foreground">Manage footer content across your website</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-muted p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Brand Info Tab */}
        {activeTab === "brand" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Brand Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Brand Name</label>
                <input
                  type="text"
                  value={footerData.brandName}
                  onChange={(e) => setFooterData({ ...footerData, brandName: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Brand Description</label>
                <textarea
                  value={footerData.brandDescription}
                  onChange={(e) => setFooterData({ ...footerData, brandDescription: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none resize-none"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gold-500" /> Address
                  </label>
                  <input
                    type="text"
                    value={footerData.address}
                    onChange={(e) => setFooterData({ ...footerData, address: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gold-500" /> Phone
                  </label>
                  <input
                    type="text"
                    value={footerData.phone}
                    onChange={(e) => setFooterData({ ...footerData, phone: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gold-500" /> Email
                  </label>
                  <input
                    type="email"
                    value={footerData.email}
                    onChange={(e) => setFooterData({ ...footerData, email: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Copyright Text</label>
                  <input
                    type="text"
                    value={footerData.copyright}
                    onChange={(e) => setFooterData({ ...footerData, copyright: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Payment Methods</label>
                  <input
                    type="text"
                    value={footerData.paymentMethods}
                    onChange={(e) => setFooterData({ ...footerData, paymentMethods: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Link Sections Tab */}
        {activeTab === "sections" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {footerData.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(sectionIndex, { ...section, title: e.target.value })}
                      className="text-lg font-semibold bg-transparent border-b border-transparent hover:border-border focus:border-gold-500 focus:outline-none px-1"
                    />
                  </div>
                  <button
                    onClick={() => removeSection(sectionIndex)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <div key={linkIndex} className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-muted-foreground shrink-0" />
                      <input
                        type="text"
                        value={link.name}
                        onChange={(e) => updateLinkInSection(sectionIndex, linkIndex, "name", e.target.value)}
                        placeholder="Link Name"
                        className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => updateLinkInSection(sectionIndex, linkIndex, "href", e.target.value)}
                        placeholder="/path"
                        className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none font-mono"
                      />
                      <button
                        onClick={() => removeLinkFromSection(sectionIndex, linkIndex)}
                        className="rounded-lg p-2 text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => addLinkToSection(sectionIndex)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-gold-500 hover:text-gold-500 transition-colors"
                >
                  <Plus className="h-3 w-3" /> Add Link
                </button>
              </div>
            ))}

            <button
              onClick={addSection}
              className="w-full rounded-2xl border-2 border-dashed border-border p-6 text-center text-sm text-muted-foreground hover:border-gold-500 hover:text-gold-500 transition-colors"
            >
              <Plus className="h-5 w-5 mx-auto mb-1" />
              Add New Section
            </button>
          </motion.div>
        )}

        {/* Social Links Tab */}
        {activeTab === "social" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Social Media Links</h2>
            <div className="space-y-3">
              {footerData.socialLinks.map((social, index) => (
                <div key={index} className="flex items-center gap-3 rounded-xl border border-border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10">
                    {social.icon === "Facebook" && <Facebook className="h-4 w-4 text-gold-500" />}
                    {social.icon === "Instagram" && <Instagram className="h-4 w-4 text-gold-500" />}
                    {social.icon === "Twitter" && <Twitter className="h-4 w-4 text-gold-500" />}
                    {social.icon === "Youtube" && <Youtube className="h-4 w-4 text-gold-500" />}
                  </div>
                  <div className="flex-1 grid gap-2 sm:grid-cols-3">
                    <input
                      type="text"
                      value={social.label}
                      onChange={(e) => updateSocialLink(index, "label", e.target.value)}
                      placeholder="Label"
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={social.href}
                      onChange={(e) => updateSocialLink(index, "href", e.target.value)}
                      placeholder="https://..."
                      className="col-span-2 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-gold-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Newsletter Tab */}
        {activeTab === "newsletter" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Newsletter Section</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Newsletter Title</label>
                <input
                  type="text"
                  value={footerData.newsletterTitle}
                  onChange={(e) => setFooterData({ ...footerData, newsletterTitle: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Newsletter Description</label>
                <textarea
                  value={footerData.newsletterDescription}
                  onChange={(e) => setFooterData({ ...footerData, newsletterDescription: e.target.value })}
                  rows={2}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none resize-none"
                />
              </div>
              <div className="rounded-xl bg-muted/50 p-4">
                <h3 className="text-sm font-medium mb-2">Preview</h3>
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-sm font-semibold">{footerData.newsletterTitle}</p>
                  <p className="text-xs text-muted-foreground mt-1">{footerData.newsletterDescription}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}