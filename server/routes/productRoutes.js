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
  "variants",
];

const pickProductFields = (body) =>
  Object.fromEntries(productFields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]));

const normalizeVariants = (variants = []) =>
  Array.isArray(variants)
    ? variants.map((variant) => ({
      id: String(variant.id || crypto.randomUUID()),
      name: String(variant.name || "").trim(),
      priceAdjustment: Number(variant.priceAdjustment || 0),
      stock: Math.max(0, Number(variant.stock || 0)),
    })).filter((variant) => variant.name)
    : [];

const recalculateReviewSummary = (product) => {
  product.reviewCount = product.reviews.length;
  product.ratingAverage = product.reviewCount
    ? Number((product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviewCount).toFixed(1))
    : 0;
};

const productInput = (body) => {
  const fields = pickProductFields(body);
  if (fields.variants !== undefined) fields.variants = normalizeVariants(fields.variants);
  return fields;
};

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
      ...productInput(req.body),
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
    const product = await Product.findOneAndUpdate({ id: req.params.id }, productInput(req.body), {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  }),
);

router.post(
  "/:id/reviews",
  authenticate,
  asyncHandler(async (req, res) => {
    const rating = Number(req.body.rating);
    const comment = String(req.body.comment || "").trim();
    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || comment.length < 5) {
      return res.status(400).json({ message: "Add a rating from 1 to 5 and a review comment" });
    }

    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existing = product.reviews.find((review) => review.user.toString() === req.user._id.toString());
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      existing.name = req.user.name;
    } else {
      product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
    }
    recalculateReviewSummary(product);
    await product.save();
    res.status(existing ? 200 : 201).json(product);
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
