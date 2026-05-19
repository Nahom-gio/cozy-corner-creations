import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import { sampleProducts } from "../data/sampleProducts.js";

const router = express.Router();

const usingDatabase = () => mongoose.connection.readyState === 1;

router.get("/", async (_req, res) => {
  if (!usingDatabase()) {
    return res.json(sampleProducts);
  }

  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products.length > 0 ? products : sampleProducts);
});

router.get("/:id", async (req, res) => {
  if (!usingDatabase()) {
    const product = sampleProducts.find((item) => item.id === req.params.id);
    return product ? res.json(product) : res.status(404).json({ message: "Product not found" });
  }

  const product = await Product.findOne({ id: req.params.id });
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

export default router;
