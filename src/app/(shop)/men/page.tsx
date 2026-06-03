import Link from "next/link";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

async function fetchWithFallback() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
    const res = await fetch(`${baseUrl}/api/products?limit=20&category=suits`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    // Fallback: fetch featured as men's sample
    const fallbackRes = await fetch(`${baseUrl}/api/products?featured=true&limit=8`, {
      next: { revalidate: 60 },
    });
    const fallbackData = await fallbackRes.json();
    return Array.isArray(fallbackData) ? fallbackData : [];
  } catch {
    return [];
  }
}

export default async function MenPage() {
  const products = await fetchWithFallback();

  return (
    <div>
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div>
            <h1 className="font-display text-4xl font-bold md:text-5xl">Men's Collection</h1>
            <p className="mt-2 text-muted-foreground">Premium menswear crafted for the modern gentleman</p>
          </div>
        </div>
      </div>

      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{products.length} products</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No products found</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product: any, i: number) => {
              const img = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
              return (
                <div key={product.id} className="group">
                  <Link href={`/product/${product.slug}`}>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                      {img && <OptimizedImage src={img.url} alt={product.name} className="h-full w-full transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />}
                      {product.isNewArrival && <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase text-black">New</span>}
                      {product.isOnSale && <span className="absolute left-3 top-3 rounded-full bg-gold-500 px-3 py-1 text-[10px] font-semibold uppercase text-black">Sale</span>}
                      {product.comparePrice && Number(product.comparePrice) > 0 && (
                        <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2 py-1 text-[10px] font-semibold text-white">
                          -{Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)}%
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="mt-3 space-y-1">
                    <Link href={`/product/${product.slug}`} className="block text-sm font-medium transition-colors hover:text-gold-500">{product.name}</Link>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">Rs.{Number(product.price).toLocaleString()}</span>
                      {product.comparePrice && <span className="text-xs text-muted-foreground line-through">Rs.{Number(product.comparePrice).toLocaleString()}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}