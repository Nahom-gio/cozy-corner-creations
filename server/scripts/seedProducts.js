import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import { sampleProducts } from "../data/sampleProducts.js";

dotenv.config();

if (!process.env.MONGODB_URI) {
  console.error("Missing MONGODB_URI. Create server/.env before running the seed script.");
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  await Product.deleteMany({});
  await Product.insertMany(sampleProducts);

  console.log(`Seeded ${sampleProducts.length} products into MongoDB.`);
  await mongoose.disconnect();
  process.exit(0);
} catch (error) {
  console.error("Product seed failed:", error.message);
  await mongoose.disconnect();
  process.exit(1);
}
