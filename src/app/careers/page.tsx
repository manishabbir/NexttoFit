"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, DollarSign } from "lucide-react";
import Link from "next/link";

const positions = [
  { title: "Senior Fashion Designer", type: "Full-time", location: "Lahore", salary: "Market Competitive", dept: "Design", desc: "We're looking for an experienced fashion designer to lead our design team and create exceptional collections." },
  { title: "E-commerce Manager", type: "Full-time", location: "Lahore", salary: "Market Competitive", dept: "Operations", desc: "Manage our online store, optimize conversions, and drive digital growth." },
  { title: "Customer Service Lead", type: "Full-time", location: "Karachi", salary: "Market Competitive", dept: "Support", desc: "Lead our customer service team to deliver exceptional shopping experiences." },
  { title: "Social Media Manager", type: "Full-time", location: "Remote", salary: "Market Competitive", dept: "Marketing", desc: "Create engaging content and build our brand presence across social platforms." },
  { title: "Quality Control Inspector", type: "Full-time", location: "Lahore", salary: "Market Competitive", dept: "Production", desc: "Ensure all products meet our premium quality standards before shipping." },
  { title: "Junior Graphic Designer", type: "Internship", location: "Lahore", salary: "Stipend", dept: "Design", desc: "Join our creative team and gain hands-on experience in fashion design." },
];

export default function CareersPage() {
  return (
    <div>
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl font-bold md:text-5xl">Join Our Team</h1>
            <p className="mt-4 text-lg text-muted-foreground">Help us redefine fashion in Pakistan</p>
          </motion.div>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {positions.map((job, i) => (
            <motion.div key={job.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="rounded-2xl border border-border bg-card p-6 hover:border-gold-500/30 transition-colors group cursor-pointer">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold group-hover:text-gold-500 transition-colors">{job.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{job.desc}</p>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold-500/10 px-3 py-1 text-xs text-gold-500"><Briefcase className="h-3 w-3" /> {job.dept}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {job.type}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {job.location}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"><DollarSign className="h-3 w-3" /> {job.salary}</span>
                  </div>
                </div>
                <button className="rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600 whitespace-nowrap">
                  Apply Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-12 rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-xl font-semibold">Don't see the right position?</h2>
          <p className="mt-2 text-muted-foreground">Send us your resume and we'll keep you in mind for future opportunities.</p>
          <button className="mt-4 rounded-full border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-muted">
            Send Resume
          </button>
        </motion.div>
      </div>
    </div>
  );
}