import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 60;

/**
 * Single endpoint that returns ALL homepage data in one request.
 * Eliminates 3 separate DB connections (huge speed improvement on serverless).
 */
export async function GET() {
  try {
    // Run all DB queries in parallel
    const [banners, featuredProducts, bestsellerProducts, siteSettings] = await Promise.all([
      prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        include: {
          images: { orderBy: { order: "asc" }, take: 2 },
        },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      prisma.product.findMany({
        where: { isActive: true },
        include: {
          images: { orderBy: { order: "asc" }, take: 2 },
        },
        orderBy: { soldCount: "desc" },
        take: 4,
      }),
      prisma.siteSetting.findFirst(),
    ]);

    return new NextResponse(
      JSON.stringify({ banners, featuredProducts, bestsellerProducts, siteSettings }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return NextResponse.json({ error: "Failed to load homepage" }, { status: 500 });
  }
}