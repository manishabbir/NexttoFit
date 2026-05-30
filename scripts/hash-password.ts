import bcrypt from "bcryptjs";

const password = "Fatima7077Ayat";
const hash = await bcrypt.hash(password, 12);
console.log("Password:", password);
console.log("Hash:", hash);