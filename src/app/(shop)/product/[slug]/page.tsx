import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Truck, Shield, RotateCcw } from "lucide-react";
import { calculateDiscount } from "@/lib/utils";
import { ProductDetailClient } from "./ProductDetailClient";

export const revalidate = 60;

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: "asc" } },
      categories: { include: { category: true } },
      variants: {
        include: { size: true, color: true },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const discount = product.comparePrice
    ? calculateDiscount(Number(product.price), Number(product.comparePrice))
    : 0;

  const sizes = product.variants
    .filter((v) => v.size)
    .map((v) => v.size!.size)
    .filter((v, i, a) => a.indexOf(v) === i);

  const colors = product.variants
    .filter((v) => v.color)
    .map((v) => ({
      name: v.color!.color,
      hex: v.color!.hexCode || "#000000",
    }))
    .filter((v, i, a) => a.findIndex((c) => c.name === v.name) === i);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/"
              className="hover:text-gold-500 transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href="/men"
              className="hover:text-gold-500 transition-colors"
            >
              Products
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ProductDetailClient
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: Number(product.price),
            comparePrice: product.comparePrice
              ? Number(product.comparePrice)
              : null,
            description: product.description,
            shortDescription: product.shortDescription,
            brand: product.brand || "NEXTFITT",
            sku: product.sku,
            material: product.material,
            careInstructions: product.careInstructions,
            rating: product.rating,
            reviewCount: product.reviewCount,
            quantity: product.quantity,
            images: product.images.map((img) => ({
              url: img.url,
              alt: img.alt || product.name,
            })),
            sizes,
            colors,
            discount,
          }}
        />

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold mb-8">
            Customer Reviews
          </h2>
          <div className="space-y-6">
            <p className="text-muted-foreground">
              No reviews yet for this product.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 rounded-2xl border border-border bg-card p-6">
          <div className="text-center">
            <Truck className="h-5 w-5 mx-auto text-gold-500" />
            <p className="mt-2 text-xs font-medium">Free Shipping</p>
            <p className="text-[10px] text-muted-foreground">
              On orders over Rs.5,000
            </p>
          </div>
          <div className="text-center">
            <Shield className="h-5 w-5 mx-auto text-gold-500" />
            <p className="mt-2 text-xs font-medium">Secure</p>
            <p className="text-[10px] text-muted-foreground">
              100% Protected
            </p>
          </div>
          <div className="text-center">
            <RotateCcw className="h-5 w-5 mx-auto text-gold-500" />
            <p className="mt-2 text-xs font-medium">Returns</p>
            <p className="text-[10px] text-muted-foreground">
              30-day policy
            </p>
          </div>
        </div>

        {/* Material & Care */}
        {(product.material || product.careInstructions) && (
          <div className="mt-6 space-y-3 rounded-2xl border border-border bg-card p-6">
            {product.material && (
              <div>
                <h3 className="text-sm font-semibold">Material</h3>
                <p className="text-sm text-muted-foreground">
                  {product.material}
                </p>
              </div>
            )}
            {product.careInstructions && (
              <div>
                <h3 className="text-sm font-semibold">Care Instructions</h3>
                <p className="text-sm text-muted-foreground">
                  {product.careInstructions}
                </p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-semibold">SKU</h3>
              <p className="text-sm text-muted-foreground">{product.sku}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}