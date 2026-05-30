import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "imranafmdc@gmail.com";
  const password = "Fatima7077Ayat";
  
  // Delete existing user if exists
  await prisma.user.deleteMany({ where: { email } });
  
  // Create fresh admin user with bcryptjs hash
  const hash = await bcrypt.hash(password, 12);
  console.log("New hash:", hash);
  
  const user = await prisma.user.create({
    data: {
      name: "Imran Ali",
      email,
      password: hash,
      role: "ADMIN",
      isActive: true,
    },
  });
  
  console.log("✅ Admin user created:", user.email);
  console.log("✅ Password:", password);
  console.log("✅ Verifying...");
  
  const verify = await bcrypt.compare(password, hash);
  console.log("✅ Password verification:", verify ? "PASS" : "FAIL");
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
});