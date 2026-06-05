import express from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { createToken, hashPassword, verifyPassword } from "../services/authService.js";

const router = express.Router();
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, wishlist: user.wishlist });

router.post("/register", asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email?.trim() || String(password).length < 8) {
    return res.status(400).json({ message: "Enter a name, email, and password with at least 8 characters" });
  }
  const user = await User.create({ name, email, passwordHash: hashPassword(password) });
  res.status(201).json({ token: createToken(user), user: publicUser(user) });
}));

router.post("/login", asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: String(req.body.email ?? "").toLowerCase() });
  if (!user || !verifyPassword(String(req.body.password ?? ""), user.passwordHash)) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.json({ token: createToken(user), user: publicUser(user) });
}));

router.get("/me", authenticate, (req, res) => res.json(publicUser(req.user)));

router.put("/wishlist/:productId", authenticate, asyncHandler(async (req, res) => {
  const product = await Product.findOne({ id: req.params.productId });
  if (!product) return res.status(404).json({ message: "Product not found" });
  const wishlist = new Set(req.user.wishlist);
  wishlist.has(product.id) ? wishlist.delete(product.id) : wishlist.add(product.id);
  req.user.wishlist = [...wishlist];
  await req.user.save();
  res.json(publicUser(req.user));
}));

export default router;
