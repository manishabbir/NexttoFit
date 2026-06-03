import withBundleAnalyzer from "@next/bundle-analyzer";

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = withAnalyzer({
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "@radix-ui/react-icons"],
  },
  // Enable SWC minification (faster builds, smaller bundles)
  swcMinify: true,
  // Compress responses with gzip
  compress: true,
  // React strict mode off for production performance
  reactStrictMode: process.env.NODE_ENV === "development",
  // Enable HTTP/2 server push hinting
  poweredByHeader: false,
});

export default nextConfig;