import express from "express";
import crypto from "crypto";
import Product from "../models/Product.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

const productFields = [
  "name",
  "price",
  "stock",
  "category",
  "room",
  "image",
  "images",
  "description",
  "material",
  "origin",
  "shipping",
  "warranty",
];

const pickProductFields = (body) =>
  Object.fromEntries(productFields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]));

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  }),
);

router.post(
  "/",
  authenticate,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const product = await Product.create({
      id: req.body.id || crypto.randomUUID(),
      ...pickProductFields(req.body),
    });
    res.status(201).json(product);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  }),
);

router.put(
  "/:id",
  authenticate,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const product = await Product.findOneAndUpdate({ id: req.params.id }, pickProductFields(req.body), {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  }),
);

router.delete(
  "/:id",
  authenticate,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(204).end();
  }),
);

export default router;
