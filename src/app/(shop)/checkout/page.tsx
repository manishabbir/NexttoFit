"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Truck, Shield, Check, Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  paymentMethod: string;
  notes: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    paymentMethod: "cod",
    notes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const shipping = 0; // Free shipping
  const tax = Math.round(getSubtotal() * 0.05); // 5% tax
  const total = getSubtotal() + shipping + tax;

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const generatedOrderNumber = `NF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setOrderNumber(generatedOrderNumber);
    setOrderPlaced(true);
    clearCart();
    setSubmitting(false);
    toast.success("Order placed successfully!");
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
        <div className="rounded-full bg-muted p-6">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add items to your cart before checkout</p>
        <Link href="/men" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-sm font-semibold text-black">
          Start Shopping
        </Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="rounded-full bg-green-500/20 p-6">
          <Check className="h-16 w-16 text-green-500" />
        </motion.div>
        <h1 className="mt-6 font-display text-3xl font-bold">Order Placed! 🎉</h1>
        <p className="mt-2 text-muted-foreground">Your order has been confirmed</p>
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Order Number</p>
          <p className="text-2xl font-bold text-gold-500">{orderNumber}</p>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">We'll send a confirmation to {form.email}</p>
        <div className="mt-8 flex gap-4">
          <Link href="/" className="rounded-full bg-gold-500 px-8 py-4 text-sm font-semibold text-black">
            Continue Shopping
          </Link>
          <Link href="/account/orders" className="rounded-full border border-border px-8 py-4 text-sm font-medium">
            View Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </Link>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {["Shipping", "Payment", "Confirm"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
              step > i + 1 ? "bg-green-500 text-white" :
              step === i + 1 ? "bg-gold-500 text-black" : "bg-muted text-muted-foreground"
            }`}>
              {step > i + 1 ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`text-sm hidden sm:inline ${step === i + 1 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              {label}
            </span>
            {i < 2 && <div className={`hidden sm:block h-px w-12 ${step > i + 1 ? "bg-green-500" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl font-bold">Checkout</h1>

            {/* Step 1: Shipping */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Truck className="h-5 w-5 text-gold-500" /> Shipping Information
                  </h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">First Name *</label>
                      <input name="firstName" value={form.firstName} onChange={handleInputChange} placeholder="John" className={`w-full rounded-xl border ${errors.firstName ? "border-destructive" : "border-border"} bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none`} />
                      {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Last Name *</label>
                      <input name="lastName" value={form.lastName} onChange={handleInputChange} placeholder="Doe" className={`w-full rounded-xl border ${errors.lastName ? "border-destructive" : "border-border"} bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none`} />
                      {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Email *</label>
                      <input name="email" type="email" value={form.email} onChange={handleInputChange} placeholder="john@example.com" className={`w-full rounded-xl border ${errors.email ? "border-destructive" : "border-border"} bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none`} />
                      {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Phone *</label>
                      <input name="phone" value={form.phone} onChange={handleInputChange} placeholder="+92 300 1234567" className={`w-full rounded-xl border ${errors.phone ? "border-destructive" : "border-border"} bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none`} />
                      {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium mb-1.5 block">Address *</label>
                      <input name="address" value={form.address} onChange={handleInputChange} placeholder="123 Main Street, Gulberg" className={`w-full rounded-xl border ${errors.address ? "border-destructive" : "border-border"} bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none`} />
                      {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">City *</label>
                      <input name="city" value={form.city} onChange={handleInputChange} placeholder="Lahore" className={`w-full rounded-xl border ${errors.city ? "border-destructive" : "border-border"} bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none`} />
                      {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">State *</label>
                      <input name="state" value={form.state} onChange={handleInputChange} placeholder="Punjab" className={`w-full rounded-xl border ${errors.state ? "border-destructive" : "border-border"} bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none`} />
                      {errors.state && <p className="text-xs text-destructive mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">ZIP Code *</label>
                      <input name="zipCode" value={form.zipCode} onChange={handleInputChange} placeholder="54000" className={`w-full rounded-xl border ${errors.zipCode ? "border-destructive" : "border-border"} bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none`} />
                      {errors.zipCode && <p className="text-xs text-destructive mt-1">{errors.zipCode}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Order Notes (optional)</label>
                      <textarea name="notes" value={form.notes} onChange={handleInputChange} placeholder="Special instructions..." className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none" rows={3} />
                    </div>
                  </div>
                  <button onClick={handleNextStep} className="mt-6 w-full rounded-full bg-gold-500 px-6 py-4 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
                    Continue to Payment
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-gold-500" /> Payment Method
                  </h2>
                  <div className="mt-4 space-y-3">
                    {[
                      { value: "cod", label: "Cash on Delivery", desc: "Pay when you receive your order" },
                      { value: "card", label: "Credit/Debit Card", desc: "Visa, Mastercard supported" },
                      { value: "easypaisa", label: "EasyPaisa / JazzCash", desc: "Mobile wallet payment" },
                      { value: "bank", label: "Bank Transfer", desc: "Direct bank transfer" },
                    ].map((method) => (
                      <label key={method.value} className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-colors ${form.paymentMethod === method.value ? "border-gold-500 bg-gold-500/5" : "border-border hover:border-muted-foreground"}`}>
                        <input type="radio" name="paymentMethod" value={method.value} checked={form.paymentMethod === method.value} onChange={handleInputChange} className="accent-gold-500" />
                        <div>
                          <span className="text-sm font-medium">{method.label}</span>
                          <p className="text-xs text-muted-foreground">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(1)} className="flex-1 rounded-full border border-border px-6 py-4 text-sm font-medium transition-colors hover:bg-muted">
                      Back
                    </button>
                    <button onClick={() => setStep(3)} className="flex-1 rounded-full bg-gold-500 px-6 py-4 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
                      Review Order
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Check className="h-5 w-5 text-gold-500" /> Confirm Order
                  </h2>
                  <div className="mt-4 space-y-4">
                    <div className="rounded-xl bg-muted p-4">
                      <h3 className="text-sm font-semibold flex items-center gap-2"><Truck className="h-4 w-4 text-gold-500" /> Shipping To</h3>
                      <p className="text-sm mt-2">{form.firstName} {form.lastName}</p>
                      <p className="text-sm text-muted-foreground">{form.address}</p>
                      <p className="text-sm text-muted-foreground">{form.city}, {form.state} {form.zipCode}</p>
                      <p className="text-sm text-muted-foreground">{form.email} | {form.phone}</p>
                    </div>
                    <div className="rounded-xl bg-muted p-4">
                      <h3 className="text-sm font-semibold flex items-center gap-2"><CreditCard className="h-4 w-4 text-gold-500" /> Payment</h3>
                      <p className="text-sm mt-2 capitalize">{form.paymentMethod.replace(/_/g, " ")}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(2)} className="flex-1 rounded-full border border-border px-6 py-4 text-sm font-medium transition-colors hover:bg-muted">
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={submitting}
                      className="flex-1 rounded-full bg-gold-500 px-6 py-4 text-sm font-semibold text-black transition-colors hover:bg-gold-600 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                      ) : (
                        <>Place Order - {formatPrice(total)}</>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}{item.size ? ` | Size: ${item.size}` : ""}{item.color ? ` | ${item.color}` : ""}</p>
                  </div>
                  <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2 text-sm border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                <span className="font-medium">{formatPrice(getSubtotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-green-500">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (5%)</span>
                <span className="font-medium">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">{formatPrice(total)}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" /> Secure checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}