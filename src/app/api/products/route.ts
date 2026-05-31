import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const featured = searchParams.get("featured");
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

  try {
    const bestsellers = searchParams.get("bestsellers");

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (featured === "true") {
      where.isFeatured = true;
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = bestsellers === "true"
      ? { soldCount: "desc" }
      : { createdAt: "desc" };

    const products = await prisma.product.findMany({
      where,
      include: {
        images: {
          orderBy: { order: "asc" },
          take: 2,
        },
      },
      orderBy,
      take: limit,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(updates.isFeatured !== undefined && { isFeatured: updates.isFeatured }),
        ...(updates.isActive !== undefined && { isActive: updates.isActive }),
        ...(updates.isNewArrival !== undefined && { isNewArrival: updates.isNewArrival }),
        ...(updates.isOnSale !== undefined && { isOnSale: updates.isOnSale }),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}