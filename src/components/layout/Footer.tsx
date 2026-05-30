"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

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

const defaultFooter: FooterData = {
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

const socialIcons: Record<string, React.ElementType> = {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
};

export function Footer() {
  const [footerData, setFooterData] = useState<FooterData>(defaultFooter);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

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
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubscribed(true);
        setEmail("");
        setTimeout(() => setSubscribed(false), 3000);
      }
    } catch (error) {
      console.error("Error subscribing:", error);
    }
  };

  const getSocialIcon = (iconName: string) => {
    return socialIcons[iconName] || Facebook;
  };

  return (
    <footer className="border-t border-border bg-card">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h3 className="font-display text-2xl font-semibold">
                {footerData.newsletterTitle}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {footerData.newsletterDescription}
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm placeholder:text-muted-foreground focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gold-600"
              >
                {subscribed ? "Subscribed!" : "Subscribe"}
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold tracking-tighter">
                NEXT<span className="text-gold-500">FITT</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {footerData.brandDescription}
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-gold-500" />
                <span>{footerData.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-gold-500" />
                <span>{footerData.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-gold-500" />
                <span>{footerData.email}</span>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              {footerData.socialLinks.map((social) => {
                const Icon = getSocialIcon(social.icon);
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-gold-500 hover:text-gold-500"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {footerData.sections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 text-xs font-semibold tracking-widest uppercase text-foreground">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-gold-500"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {footerData.brandName}. {footerData.copyright}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Link href="/privacy" className="hover:text-gold-500 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-gold-500 transition-colors">
                Terms of Service
              </Link>
              <span>Payment methods: {footerData.paymentMethods}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}