"use client";

import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, Search, Briefcase, MapPin, Clock } from "lucide-react";
import { useState } from "react";

const jobs = [
  { id: "1", title: "Senior Fashion Designer", type: "Full-time", location: "Lahore", dept: "Design", applicants: 12, status: "Active", date: "Jan 10, 2024" },
  { id: "2", title: "E-commerce Manager", type: "Full-time", location: "Lahore", dept: "Operations", applicants: 8, status: "Active", date: "Jan 8, 2024" },
  { id: "3", title: "Customer Service Lead", type: "Full-time", location: "Karachi", dept: "Support", applicants: 15, status: "Active", date: "Jan 5, 2024" },
  { id: "4", title: "Social Media Manager", type: "Full-time", location: "Remote", dept: "Marketing", applicants: 22, status: "Active", date: "Jan 3, 2024" },
  { id: "5", title: "Quality Control Inspector", type: "Full-time", location: "Lahore", dept: "Production", applicants: 6, status: "Active", date: "Dec 28, 2023" },
  { id: "6", title: "Junior Graphic Designer", type: "Internship", location: "Lahore", dept: "Design", applicants: 18, status: "Active", date: "Dec 20, 2023" },
];

export default function AdminCareersPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Careers</h1>
          <p className="text-sm text-muted-foreground">Manage job listings and applications</p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
          <Plus className="h-4 w-4" /> Add Position
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: "Total Positions", value: "6", change: "+2 this month" },
          { label: "Active", value: "6", change: "All open" },
          { label: "Total Applicants", value: "81", change: "+15.3%" },
          { label: "Fill Rate", value: "78%", change: "Positions filled" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-gold-500 mt-0.5">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-md mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search positions..." className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none" />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Position</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Department</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Type</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Location</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Applicants</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Date</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, i) => (
                <motion.tr key={job.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-gold-500/10 p-2"><Briefcase className="h-4 w-4 text-gold-500" /></div>
                      <span className="text-sm font-medium">{job.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{job.dept}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs"><Clock className="h-3 w-3" /> {job.type}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3 w-3" /> {job.location}</span>
                  </td>
                  <td className="py-3 px-4 text-center text-sm font-medium">{job.applicants}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-500">{job.status}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-muted-foreground">{job.date}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Eye className="h-4 w-4" /></button>
                      <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Edit className="h-4 w-4" /></button>
                      <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}