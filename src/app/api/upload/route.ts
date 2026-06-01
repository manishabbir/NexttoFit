import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
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

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files allowed (JPG, PNG, WebP)" }, { status: 400 });
    }

    // No file size limit - Sharp will optimize regardless of size
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    // Optimize with Sharp:
    // 1. Resize to max 1600px width (preserve aspect ratio)
    // 2. Convert to AVIF quality 80, fallback to WebP
    // 3. Strip EXIF/metadata
    let outputBuffer: Buffer;
    let ext: string;
    let format: string;

    try {
      // Try AVIF first (best compression/quality)
      outputBuffer = await sharp(inputBuffer)
        .resize(1600, null, { 
          withoutEnlargement: true,
          fit: "inside",
        })
        .avif({ quality: 80 })
        .withMetadata({ exif: undefined, icc: undefined })
        .toBuffer();
      ext = "avif";
      format = "AVIF";
    } catch {
      // Fallback to WebP if AVIF fails
      try {
        outputBuffer = await sharp(inputBuffer)
          .resize(1600, null, { 
            withoutEnlargement: true,
            fit: "inside",
          })
          .webp({ quality: 80 })
          .withMetadata({ exif: undefined, icc: undefined })
          .toBuffer();
        ext = "webp";
        format = "WebP";
      } catch {
        // Final fallback to JPEG
        outputBuffer = await sharp(inputBuffer)
          .resize(1600, null, { 
            withoutEnlargement: true,
            fit: "inside",
          })
          .jpeg({ quality: 80 })
          .withMetadata({ exif: undefined, icc: undefined })
          .toBuffer();
        ext = "jpg";
        format = "JPEG";
      }
    }

    // Calculate compression ratio
    const originalSizeKB = (file.size / 1024).toFixed(1);
    const optimizedSizeKB = (outputBuffer.length / 1024).toFixed(1);
    const savings = ((1 - outputBuffer.length / file.size) * 100).toFixed(1);

    // Create unique filename
    const filename = `${crypto.randomUUID()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, outputBuffer);

    // Return the URL and optimization info
    const url = `/uploads/${filename}`;

    return NextResponse.json({
      url,
      filename,
      format,
      originalSize: `${originalSizeKB} KB`,
      optimizedSize: `${optimizedSizeKB} KB`,
      savings: `${savings}%`,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}