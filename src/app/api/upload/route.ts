import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files allowed" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    // Optimize with Sharp
    let outputBuffer: Buffer;
    let mimeType = "image/jpeg";
    let format = "JPEG";

    try {
      outputBuffer = await sharp(inputBuffer)
        .resize(1600, null, { withoutEnlargement: true, fit: "inside" })
        .avif({ quality: 80 })
        .toBuffer();
      mimeType = "image/avif";
      format = "AVIF";
    } catch {
      try {
        outputBuffer = await sharp(inputBuffer)
          .resize(1600, null, { withoutEnlargement: true, fit: "inside" })
          .webp({ quality: 80 })
          .toBuffer();
        mimeType = "image/webp";
        format = "WebP";
      } catch {
        outputBuffer = await sharp(inputBuffer)
          .resize(1600, null, { withoutEnlargement: true, fit: "inside" })
          .jpeg({ quality: 80 })
          .toBuffer();
        mimeType = "image/jpeg";
        format = "JPEG";
      }
    }

    const originalSizeKB = (file.size / 1024).toFixed(1);
    const optimizedSizeKB = (outputBuffer.length / 1024).toFixed(1);
    const savings = ((1 - outputBuffer.length / file.size) * 100).toFixed(1);

    // Convert to base64 data URL - works everywhere (local & Vercel serverless)
    const base64 = outputBuffer.toString("base64");
    const url = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      url,
      format,
      originalSize: `${originalSizeKB} KB`,
      optimizedSize: `${optimizedSizeKB} KB`,
      savings: `${savings}%`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}