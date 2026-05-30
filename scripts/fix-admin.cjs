require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

async function main() {
  const email = "imranafmdc@gmail.com";
  const password = "Fatima7077Ayat";
  
  const hash = await bcrypt.hash(password, 12);
  console.log("Generated hash:", hash);
  
  const prisma = new PrismaClient();
  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hash, role: "ADMIN", isActive: true, name: "Imran Ali" },
    create: { name: "Imran Ali", email, password: hash, role: "ADMIN", isActive: true },
  });
  
  const verify = await bcrypt.compare(password, hash);
  console.log("User:", user.email, "Role:", user.role);
  console.log("Password verification:", verify ? "PASS ✅" : "FAIL ❌");
  
  await prisma.$disconnect();
}

main().catch(e => { 
  console.error("Error:", e.message);
  process.exit(1); 
});