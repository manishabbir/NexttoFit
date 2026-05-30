"use client";

import { motion } from "framer-motion";

const mensSizes = [
  { size: "XS", chest: "34-36", waist: "28-30", length: "26-27" },
  { size: "S", chest: "36-38", waist: "30-32", length: "27-28" },
  { size: "M", chest: "38-40", waist: "32-34", length: "28-29" },
  { size: "L", chest: "40-42", waist: "34-36", length: "29-30" },
  { size: "XL", chest: "42-44", waist: "36-38", length: "30-31" },
  { size: "XXL", chest: "44-46", waist: "38-40", length: "31-32" },
];

const womensSizes = [
  { size: "XS", bust: "32-33", waist: "24-25", hips: "34-35" },
  { size: "S", bust: "34-35", waist: "26-27", hips: "36-37" },
  { size: "M", bust: "36-37", waist: "28-29", hips: "38-39" },
  { size: "L", bust: "38-39", waist: "30-31", hips: "40-41" },
  { size: "XL", bust: "40-41", waist: "32-33", hips: "42-43" },
];

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Size Guide</h1>
        <p className="mt-4 text-muted-foreground">Find your perfect fit with our measurements</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Men's Clothing (inches)</h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted">
              <th className="text-left py-3 px-4 font-medium">Size</th>
              <th className="text-left py-3 px-4 font-medium">Chest</th>
              <th className="text-left py-3 px-4 font-medium">Waist</th>
              <th className="text-left py-3 px-4 font-medium">Length</th>
            </tr></thead>
            <tbody>
              {mensSizes.map((s) => (
                <tr key={s.size} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 font-semibold">{s.size}</td>
                  <td className="py-3 px-4 text-muted-foreground">{s.chest}</td>
                  <td className="py-3 px-4 text-muted-foreground">{s.waist}</td>
                  <td className="py-3 px-4 text-muted-foreground">{s.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h2 className="text-xl font-semibold mb-4">Women's Clothing (inches)</h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted">
              <th className="text-left py-3 px-4 font-medium">Size</th>
              <th className="text-left py-3 px-4 font-medium">Bust</th>
              <th className="text-left py-3 px-4 font-medium">Waist</th>
              <th className="text-left py-3 px-4 font-medium">Hips</th>
            </tr></thead>
            <tbody>
              {womensSizes.map((s) => (
                <tr key={s.size} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 font-semibold">{s.size}</td>
                  <td className="py-3 px-4 text-muted-foreground">{s.bust}</td>
                  <td className="py-3 px-4 text-muted-foreground">{s.waist}</td>
                  <td className="py-3 px-4 text-muted-foreground">{s.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 text-sm text-muted-foreground text-center">
        Measurements may vary slightly between styles. Contact us for personalized sizing assistance.
      </motion.p>
    </div>
  );
}