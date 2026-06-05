import User from "../models/User.js";
import { verifyToken } from "../services/authService.js";
import { asyncHandler } from "./asyncHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ message: "Sign in to continue" });

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: "Account not found" });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

export const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) return res.status(403).json({ message: "You do not have permission to do that" });
  next();
};
