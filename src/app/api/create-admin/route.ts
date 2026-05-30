import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const email = "imranafmdc@gmail.com";
    const password = "Fatima7077Ayat";
    
    // Generate hash using the SAME bcryptjs used in auth
    const hash = await bcrypt.hash(password, 12);
    console.log("Generated hash:", hash);
    
    // Verify hash works
    const testVerify = await bcrypt.compare(password, hash);
    console.log("Self-verify:", testVerify);
    
    const user = await prisma.user.upsert({
      where: { email },
      update: { password: hash, role: "ADMIN", isActive: true, name: "Imran Ali" },
      create: { name: "Imran Ali", email, password: hash, role: "ADMIN", isActive: true },
    });
    
    console.log("User:", user.email, user.role);
    
    // Final verification
    const verify = await bcrypt.compare(password, user.password!);
    console.log("Final verify:", verify);
    
    return NextResponse.json({ 
      success: true, 
      email: user.email, 
      role: user.role,
      hashGenerated: hash,
      passwordVerified: verify
    });
  } catch (error: any) {
    console.error("ERROR:", error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || "Unknown error",
      stack: error?.stack
    }, { status: 500 });
  }
}