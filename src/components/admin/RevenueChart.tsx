"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";

const revenueData = [
  { name: "Jan", revenue: 45000, orders: 120 },
  { name: "Feb", revenue: 52000, orders: 145 },
  { name: "Mar", revenue: 48000, orders: 135 },
  { name: "Apr", revenue: 61000, orders: 168 },
  { name: "May", revenue: 55000, orders: 152 },
  { name: "Jun", revenue: 67000, orders: 185 },
  { name: "Jul", revenue: 72000, orders: 198 },
];

export default function RevenueChart() {
  return (
    <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Revenue Overview</h2>
          <p className="text-sm text-muted-foreground">
            Monthly revenue and order trends
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gold-500" /> Revenue
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" /> Orders
          </div>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
              }}
            />
            <Bar
              dataKey="revenue"
              fill="#d4941a"
              radius={[4, 4, 0, 0]}
              name="Revenue"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}