import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "@/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchModal } from "@/components/search/SearchModal";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NEXTFITT | Premium Fashion",
    template: "%s | NEXTFITT",
  },
  description:
    "Discover premium fashion at NEXTFITT. Shop the latest trends in men's and women's clothing with luxury designs and unparalleled quality.",
  keywords: [
    "fashion",
    "premium clothing",
    "Pakistani fashion",
    "men's wear",
    "women's wear",
    "luxury brand",
  ],
  openGraph: {
    title: "NEXTFITT | Premium Fashion",
    description:
      "Discover premium fashion at NEXTFITT. Shop the latest trends in men's and women's clothing.",
    siteName: "NEXTFITT",
    type: "website",
    locale: "en_PK",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXTFITT | Premium Fashion",
    description:
      "Discover premium fashion at NEXTFITT. Shop the latest trends.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <Providers>
          <AnnouncementBar />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
          <SearchModal />
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}