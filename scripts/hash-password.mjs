import bcrypt from "bcryptjs";

const password = "Fatima7077Ayat";
bcrypt.hash(password, 12).then(hash => {
  console.log("Password:", password);
  console.log("Hash:", hash);
});