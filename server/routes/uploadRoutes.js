import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import { authenticate, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();
const uploadsDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../uploads");
const extensions = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

router.post(
  "/",
  authenticate,
  requireRole("admin"),
  express.raw({ type: "image/*", limit: "5mb" }),
  asyncHandler(async (req, res) => {
    const extension = extensions.get(req.get("content-type"));
    if (!extension || !Buffer.isBuffer(req.body) || req.body.length === 0) {
      return res.status(400).json({ message: "Upload a JPG, PNG, WEBP, or GIF image" });
    }

    await fs.mkdir(uploadsDirectory, { recursive: true });
    const filename = `${crypto.randomUUID()}${extension}`;
    await fs.writeFile(path.join(uploadsDirectory, filename), req.body);
    res.status(201).json({ url: `/uploads/${filename}` });
  }),
);

export { uploadsDirectory };
export default router;
