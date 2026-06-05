import crypto from "crypto";
import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { buildOrderItems } from "../services/orderService.js";
import { releaseInventory, reserveInventory } from "../services/inventoryService.js";

const router = express.Router();

const requiredCustomerFields = ["name", "email", "address", "city", "country"];

router.post(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const customer = req.body.customer ?? {};
    const requestedItems = Array.isArray(req.body.items) ? req.body.items : [];

    if (requiredCustomerFields.some((field) => !String(customer[field] ?? "").trim())) {
      return res.status(400).json({ message: "Complete all customer details before placing the order" });
    }

    if (requestedItems.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const productIds = requestedItems.map((item) => String(item.productId ?? ""));
    const products = await Product.find({ id: { $in: productIds } });
    const items = buildOrderItems(requestedItems, products);
    await reserveInventory(items);

    let order;
    try {
      order = await Order.create({
        user: req.user._id,
        orderNumber: `MAI-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        customer,
        items,
        total: items.reduce((sum, item) => sum + item.subtotal, 0),
      });
    } catch (error) {
      await releaseInventory(items);
      throw error;
    }

    res.status(201).json(order);
  }),
);

router.get("/", authenticate, asyncHandler(async (req, res) => {
  const query = req.user.role === "admin" ? {} : { user: req.user._id };
  const orders = await Order.find(query).sort({ createdAt: -1 });
  res.json(orders);
}));

router.put("/:orderNumber/status", authenticate, requireRole("admin"), asyncHandler(async (req, res) => {
  const order = await Order.findOneAndUpdate(
    { orderNumber: req.params.orderNumber },
    { status: req.body.status },
    { new: true, runValidators: true },
  );
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
}));

router.get(
  "/:orderNumber",
  authenticate,
  asyncHandler(async (req, res) => {
    const query = { orderNumber: req.params.orderNumber };
    if (req.user.role !== "admin") query.user = req.user._id;
    const order = await Order.findOne(query);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  }),
);

export default router;
