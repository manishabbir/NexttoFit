import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        description: body.description || "Premium quality product",
        shortDescription: body.shortDescription || "",
        brand: body.brand || "NEXTFITT",
        price: parseFloat(body.price) || 0,
        comparePrice: body.comparePrice ? parseFloat(body.comparePrice) : null,
        sku: body.sku || `NF-${Date.now().toString(36).toUpperCase()}`,
        quantity: parseInt(body.quantity) || 0,
        isActive: body.isActive ?? true,
        isFeatured: body.isFeatured ?? false,
        isNewArrival: body.isNewArrival ?? false,
        isOnSale: body.isOnSale ?? false,
      },
    });

    if (body.imageUrl) {
      await prisma.productImage.create({
        data: { productId: product.id, url: body.imageUrl, isPrimary: true, order: 0 },
      });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const featured = searchParams.get("featured");
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

  try {
    const bestsellers = searchParams.get("bestsellers");
    const where: Prisma.ProductWhereInput = { isActive: true };
    if (featured === "true") where.isFeatured = true;

    const orderBy: Prisma.ProductOrderByWithRelationInput = bestsellers === "true"
      ? { soldCount: "desc" }
      : { createdAt: "desc" };

    const products = await prisma.product.findMany({
      where,
      include: { images: { orderBy: { order: "asc" }, take: 2 } },
      orderBy,
      take: limit,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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

    const data: any = {};
    if (updates.name !== undefined) data.name = updates.name;
    if (updates.slug !== undefined) data.slug = updates.slug;
    if (updates.description !== undefined) data.description = updates.description;
    if (updates.price !== undefined) data.price = parseFloat(updates.price);
    if (updates.comparePrice !== undefined) data.comparePrice = updates.comparePrice ? parseFloat(updates.comparePrice) : null;
    if (updates.quantity !== undefined) data.quantity = parseInt(updates.quantity);
    if (updates.isActive !== undefined) data.isActive = updates.isActive;
    if (updates.isFeatured !== undefined) data.isFeatured = updates.isFeatured;
    if (updates.isNewArrival !== undefined) data.isNewArrival = updates.isNewArrival;
    if (updates.isOnSale !== undefined) data.isOnSale = updates.isOnSale;
    if (updates.sku !== undefined) data.sku = updates.sku;

    const product = await prisma.product.update({ where: { id }, data });

    if (updates.imageUrl) {
      const existing = await prisma.productImage.findFirst({ where: { productId: id, isPrimary: true } });
      if (existing) {
        await prisma.productImage.update({ where: { id: existing.id }, data: { url: updates.imageUrl } });
      } else {
        await prisma.productImage.create({ data: { productId: id, url: updates.imageUrl, isPrimary: true, order: 0 } });
      }
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
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