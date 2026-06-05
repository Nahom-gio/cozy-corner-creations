import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes, { uploadsDirectory } from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsDirectory));

app.get("/api/health", async (_req, res) => {
  try {
    await mongoose.connection.db.collection("products").findOne({});
    res.json({
      status: "ok",
      service: "ethio-api",
      database: "connected",
    });
  } catch {
    res.status(503).json({
      status: "error",
      service: "ethio-api",
      database: "unavailable",
    });
  }
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/uploads", uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

try {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("MongoDB connection failed:", error.message);
  process.exit(1);
}
