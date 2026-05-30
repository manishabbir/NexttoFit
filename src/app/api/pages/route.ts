import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const DEFAULT_PAGES: Record<string, any> = {
  about: {
    title: "Our Story",
    subtitle: "NEXTFITT is a premium fashion brand dedicated to redefining style for the modern individual. We blend contemporary design with timeless craftsmanship.",
    features: [
      { icon: "Sparkles", title: "Premium Quality", description: "Handpicked fabrics and materials ensuring the highest standards of craftsmanship." },
      { icon: "Shield", title: "Authentic Designs", description: "Original designs created by our in-house team of fashion experts." },
      { icon: "Heart", title: "Customer First", description: "Your satisfaction is our priority. We're here to help every step of the way." },
      { icon: "Users", title: "Community", description: "Join thousands of satisfied customers who trust NEXTFITT for their style." },
    ],
    cta: { title: "Ready to Elevate Your Style?", description: "Explore our collections and discover fashion that speaks to you.", buttonText: "Shop Now", buttonLink: "/men" },
  },
  faqs: {
    title: "FAQs",
    subtitle: "Frequently asked questions",
    questions: [
      { question: "What is your shipping policy?", answer: "We offer free shipping on orders over Rs5,000. Standard delivery takes 3-5 business days within Pakistan. Express shipping (1-2 days) is available at an additional cost." },
      { question: "How can I track my order?", answer: "Once your order is shipped, you'll receive a tracking number via email and SMS. You can track your order on our Order Tracking page." },
      { question: "What is your return policy?", answer: "We offer a 30-day return policy for unworn items in original condition. Refunds are processed within 5-7 business days after we receive the return." },
      { question: "How do I find my size?", answer: "Check our Size Guide page for detailed measurements. You can also contact our customer service for personalized sizing advice." },
      { question: "Do you ship internationally?", answer: "Currently we ship within Pakistan only. International shipping will be available soon." },
      { question: "What payment methods do you accept?", answer: "We accept Cash on Delivery, Credit/Debit Cards, EasyPaisa, and JazzCash." },
    ],
  },
  "shipping-returns": {
    title: "Shipping & Returns",
    subtitle: "Everything you need to know about delivery and returns",
    sections: [
      { icon: "Truck", title: "Shipping Policy", items: ["Free shipping on orders over Rs5,000", "Standard delivery: 3-5 business days", "Express delivery: 1-2 business days", "We ship to all cities across Pakistan"] },
      { icon: "RotateCcw", title: "Return Policy", items: ["30-day return window from delivery date", "Items must be unworn with original tags", "Free returns on defective or wrong items", "Refund processed within 5-7 business days"] },
      { icon: "Shield", title: "Quality Guarantee", items: ["All products are quality inspected before shipping", "Premium materials and craftsmanship guaranteed", "Exchange available for size issues"] },
      { icon: "Clock", title: "Processing Time", items: ["Orders processed within 24 hours", "Custom orders may take 3-5 days", "Eid/Seasonal orders may have extended processing"] },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    subtitle: "Last updated: January 2024",
    sections: [
      { title: "Information We Collect", content: "We collect information you provide when creating an account, placing an order, or contacting us. This includes your name, email address, phone number, and shipping address." },
      { title: "How We Use Your Information", content: "We use your information to process orders, improve our services, send updates about your orders, and provide customer support. We do not sell your personal information to third parties." },
      { title: "Data Security", content: "We implement industry-standard security measures to protect your personal information. All payment transactions are encrypted using SSL technology." },
      { title: "Cookies", content: "We use cookies to enhance your browsing experience and analyze site traffic. You can control cookie settings in your browser preferences." },
      { title: "Third-Party Services", content: "We may share your information with trusted third parties for payment processing and shipping delivery. These parties are bound by confidentiality agreements." },
      { title: "Contact Us", content: "For privacy-related inquiries, please contact us at hello@nextfitt.com." },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    subtitle: "Last updated: January 2024",
    sections: [
      { title: "General", content: "By accessing and using NEXTFITT, you agree to these terms. If you do not agree, please do not use our services." },
      { title: "Products & Pricing", content: "We strive to display accurate product descriptions and pricing. Prices are subject to change without notice." },
      { title: "Orders", content: "All orders are subject to availability and confirmation. We reserve the right to cancel orders if fraud is suspected." },
      { title: "Payment", content: "Payment must be received before order processing. We accept Cash on Delivery, Credit/Debit Cards, EasyPaisa, and JazzCash." },
      { title: "Intellectual Property", content: "All content on NEXTFITT, including logos, designs, and product images, is our intellectual property." },
      { title: "Limitation of Liability", content: "NEXTFITT shall not be liable for any indirect, incidental, or consequential damages." },
    ],
  },
  contact: {
    title: "Contact Us",
    subtitle: "We'd love to hear from you",
    info: [
      { icon: "MapPin", label: "Visit Us", value: "Lahore, Pakistan" },
      { icon: "Phone", label: "Call Us", value: "+92 300 1234567" },
      { icon: "Mail", label: "Email Us", value: "hello@nextfitt.com" },
      { icon: "Clock", label: "Working Hours", value: "Mon - Sat: 10AM - 8PM" },
    ],
  },
  "size-guide": {
    title: "Size Guide",
    subtitle: "Find your perfect fit with our comprehensive sizing information",
    content: "<p>Please refer to the measurements below to find your perfect size.</p><h3>Men's Clothing</h3><table><tr><th>Size</th><th>Chest (inches)</th><th>Waist (inches)</th><th>Hip (inches)</th></tr><tr><td>S</td><td>36-38</td><td>30-32</td><td>36-38</td></tr><tr><td>M</td><td>38-40</td><td>32-34</td><td>38-40</td></tr><tr><td>L</td><td>40-42</td><td>34-36</td><td>40-42</td></tr><tr><td>XL</td><td>42-44</td><td>36-38</td><td>42-44</td></tr></table><h3>Women's Clothing</h3><table><tr><th>Size</th><th>Bust (inches)</th><th>Waist (inches)</th><th>Hip (inches)</th></tr><tr><td>XS</td><td>32-33</td><td>24-25</td><td>34-35</td></tr><tr><td>S</td><td>34-35</td><td>26-27</td><td>36-37</td></tr><tr><td>M</td><td>36-37</td><td>28-29</td><td>38-39</td></tr><tr><td>L</td><td>38-39</td><td>30-31</td><td>40-41</td></tr></table>",
  },
  "order-tracking": {
    title: "Order Tracking",
    subtitle: "Enter your order number and email to track your order",
  },
  careers: {
    title: "Careers",
    subtitle: "Join the NEXTFITT team and help us redefine fashion",
    content: "<p>We're always looking for talented individuals to join our growing team.</p><p>Send your resume to careers@nextfitt.com</p>",
  },
  "gift-cards": {
    title: "Gift Cards",
    subtitle: "The perfect gift for any occasion",
    content: "<p>Give the gift of style with a NEXTFITT gift card. Available in various denominations.</p>",
  },
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page");

  try {
    if (page) {
      const setting = await prisma.siteSetting.findUnique({
        where: { key: `page_${page}` },
      });

      const defaultContent = DEFAULT_PAGES[page] || null;
      const savedContent = setting?.value ? JSON.parse(setting.value) : null;

      return NextResponse.json({
        page,
        content: savedContent || defaultContent,
        isDefault: !savedContent,
      });
    }

    const settings = await prisma.siteSetting.findMany({
      where: {
        key: { startsWith: "page_" },
      },
    });

    const result: Record<string, any> = {};
    settings.forEach((s) => {
      const pageName = s.key.replace("page_", "");
      result[pageName] = JSON.parse(s.value);
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching page content:", error);
    return NextResponse.json(
      { error: "Failed to fetch page content" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { page, content } = body;

    if (!page || !content) {
      return NextResponse.json(
        { error: "Page name and content are required" },
        { status: 400 }
      );
    }

    const setting = await prisma.siteSetting.upsert({
      where: { key: `page_${page}` },
      update: { value: JSON.stringify(content) },
      create: { key: `page_${page}`, value: JSON.stringify(content) },
    });

    return NextResponse.json({ success: true, page, setting });
  } catch (error) {
    console.error("Error saving page content:", error);
    return NextResponse.json(
      { error: "Failed to save page content" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { page } = await request.json();

    if (!page) {
      return NextResponse.json(
        { error: "Page name is required" },
        { status: 400 }
      );
    }

    await prisma.siteSetting.delete({
      where: { key: `page_${page}` },
    });

    return NextResponse.json({
      success: true,
      message: `Page '${page}' reset to default content`,
    });
  } catch (error) {
    console.error("Error deleting page content:", error);
    return NextResponse.json(
      { error: "Failed to reset page content" },
      { status: 500 }
    );
  }
}