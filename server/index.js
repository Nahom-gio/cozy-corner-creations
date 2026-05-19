import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "maison-api",
    database: mongoose.connection.readyState === 1 ? "connected" : "not connected",
  });
});

app.use("/api/products", productRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

await connectDB();

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
