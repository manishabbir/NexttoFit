"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">Last updated: January 2024</p>
      </motion.div>
      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        {[
          { title: "Information We Collect", content: "We collect information you provide when creating an account, placing an order, or contacting us. This includes your name, email address, phone number, and shipping address." },
          { title: "How We Use Your Information", content: "We use your information to process orders, improve our services, send updates about your orders, and provide customer support. We do not sell your personal information to third parties." },
          { title: "Data Security", content: "We implement industry-standard security measures to protect your personal information. All payment transactions are encrypted using SSL technology." },
          { title: "Cookies", content: "We use cookies to enhance your browsing experience and analyze site traffic. You can control cookie settings in your browser preferences." },
          { title: "Third-Party Services", content: "We may share your information with trusted third parties for payment processing and shipping delivery. These parties are bound by confidentiality agreements." },
          { title: "Contact Us", content: "For privacy-related inquiries, please contact us at hello@nextfitt.com." },
        ].map((section, i) => (
          <motion.div key={section.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <h2 className="text-base font-semibold text-foreground mb-2">{section.title}</h2>
            <p>{section.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}