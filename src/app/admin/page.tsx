"use client";

import { motion } from "framer-motion";
import { Package, ShoppingCart, Users, TrendingUp, DollarSign, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, AreaChart, Area, CartesianGrid, Tooltip } from "recharts";

const stats = [
  { name: "Total Revenue", value: "₹12,50,000", change: "+12.5%", up: true, icon: DollarSign, color: "from-gold-400 to-gold-600" },
  { name: "Total Orders", value: "1,234", change: "+8.2%", up: true, icon: ShoppingCart, color: "from-blue-400 to-blue-600" },
  { name: "Active Products", value: "456", change: "+3.1%", up: true, icon: Package, color: "from-green-400 to-green-600" },
  { name: "Total Users", value: "3,789", change: "+18.7%", up: true, icon: Users, color: "from-purple-400 to-purple-600" },
];

const revenueData = [
  { name: "Jan", revenue: 45000, orders: 120 },
  { name: "Feb", revenue: 52000, orders: 145 },
  { name: "Mar", revenue: 48000, orders: 135 },
  { name: "Apr", revenue: 61000, orders: 168 },
  { name: "May", revenue: 55000, orders: 152 },
  { name: "Jun", revenue: 67000, orders: 185 },
  { name: "Jul", revenue: 72000, orders: 198 },
];

const recentOrders = [
  { id: "NF-001", customer: "Ahmed Khan", status: "Delivered", total: "₹18,500", date: "2 hours ago", items: 2 },
  { id: "NF-002", customer: "Sara Ali", status: "Processing", total: "₹32,000", date: "5 hours ago", items: 1 },
  { id: "NF-003", customer: "Usman R.", status: "Shipped", total: "₹12,500", date: "1 day ago", items: 3 },
  { id: "NF-004", customer: "Fatima Z.", status: "Pending", total: "₹28,000", date: "2 days ago", items: 2 },
  { id: "NF-005", customer: "Bilal M.", status: "Delivered", total: "₹22,500", date: "3 days ago", items: 1 },
];

const topProducts = [
  { name: "Premium Executive Suit", sales: 234, revenue: "₹43.3L" },
  { name: "Luxury Cashmere Coat", sales: 189, revenue: "₹60.5L" },
  { name: "Designer Kurta Shalwar", sales: 312, revenue: "₹39L" },
  { name: "Italian Leather Loafers", sales: 156, revenue: "₹24.6L" },
  { name: "Handcrafted Leather Bag", sales: 98, revenue: "₹22.1L" },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Your e-commerce overview for today</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This year</option>
            </select>
            <button className="rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
              Download Report
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className={`rounded-xl bg-gradient-to-br ${stat.color} p-3`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? "text-green-500" : "text-destructive"}`}>
                {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {stat.change}
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.name}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Revenue Overview</h2>
              <p className="text-sm text-muted-foreground">Monthly revenue and order trends</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-gold-500" /> Revenue</div>
              <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-blue-500" /> Orders</div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                <Bar dataKey="revenue" fill="#d4941a" radius={[4, 4, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Top Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                  </div>
                </div>
                <span className="text-sm font-semibold">{product.revenue}</span>
              </div>
            ))}
          </div>
          <Link href="/admin/products" className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:bg-muted transition-colors">
            View All Products
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <p className="text-sm text-muted-foreground">Latest customer orders</p>
          </div>
          <Link href="/admin/orders" className="text-sm text-gold-500 hover:text-gold-400 transition-colors">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Order</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Customer</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Items</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Total</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium">{order.id}</td>
                  <td className="py-3 px-4 text-muted-foreground">{order.customer}</td>
                  <td className="py-3 px-4">{order.items}</td>
                  <td className="py-3 px-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      order.status === "Delivered" ? "bg-green-500/20 text-green-500" :
                      order.status === "Processing" ? "bg-blue-500/20 text-blue-500" :
                      order.status === "Shipped" ? "bg-gold-500/20 text-gold-500" :
                      "bg-yellow-500/20 text-yellow-500"
                    }`}>{order.status}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium">{order.total}</td>
                  <td className="py-3 px-4 text-right text-muted-foreground">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Add Product", href: "/admin/products", desc: "Add new item to catalog" },
          { label: "View Orders", href: "/admin/orders", desc: "Process pending orders" },
          { label: "Create Coupon", href: "/admin/coupons", desc: "Launch promotion" },
          { label: "Analytics", href: "/admin/analytics", desc: "View detailed reports" },
        ].map((action) => (
          <Link key={action.label} href={action.href} className="rounded-xl border border-border bg-card p-4 hover:bg-muted transition-colors">
            <p className="font-medium text-sm">{action.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}