import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import { hashPassword } from "../services/authService.js";

dotenv.config();

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!process.env.MONGODB_URI || !email || !password) {
  console.error("Set MONGODB_URI, ADMIN_EMAIL, and ADMIN_PASSWORD before running the admin seed.");
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { name: "Ethio Admin", email, passwordHash: hashPassword(password), role: "admin" },
    { upsert: true, runValidators: true },
  );
  console.log(`Admin account ready: ${email}`);
  await mongoose.disconnect();
} catch (error) {
  console.error("Admin seed failed:", error.message);
  await mongoose.disconnect();
  process.exit(1);
}
