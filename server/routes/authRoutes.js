import express from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { createToken, hashPassword, verifyPassword } from "../services/authService.js";

const router = express.Router();
const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  active: user.active,
  phone: user.phone,
  address: user.address,
  city: user.city,
  country: user.country,
  wishlist: user.wishlist,
});
const profileFields = ["name", "phone", "address", "city", "country"];

router.post("/register", asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email?.trim() || String(password).length < 8) {
    return res.status(400).json({ message: "Enter a name, email, and password with at least 8 characters" });
  }
  const normalizedEmail = String(email).trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({ message: "An account with this email already exists. Please sign in instead." });
  }
  const user = await User.create({ name, email: normalizedEmail, passwordHash: hashPassword(password) });
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

router.put("/me", authenticate, asyncHandler(async (req, res) => {
  profileFields.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = String(req.body[field]).trim();
  });
  if (!req.user.name) return res.status(400).json({ message: "Name is required" });
  await req.user.save();
  res.json(publicUser(req.user));
}));

router.put("/me/password", authenticate, asyncHandler(async (req, res) => {
  const currentPassword = String(req.body.currentPassword ?? "");
  const nextPassword = String(req.body.nextPassword ?? "");
  if (!verifyPassword(currentPassword, req.user.passwordHash)) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }
  if (nextPassword.length < 8) {
    return res.status(400).json({ message: "New password must be at least 8 characters" });
  }
  req.user.passwordHash = hashPassword(nextPassword);
  await req.user.save();
  res.status(204).end();
}));

router.get("/users", authenticate, requireRole("admin"), asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users.map(publicUser));
}));

router.put("/users/:id", authenticate, requireRole("admin"), asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.params.id && req.body.active === false) {
    return res.status(400).json({ message: "You cannot disable your own admin account" });
  }
  const updates = {};
  if (["customer", "admin"].includes(req.body.role)) updates.role = req.body.role;
  if (typeof req.body.active === "boolean") updates.active = req.body.active;
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(publicUser(user));
}));

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
