import crypto from "crypto";
import jwt from "jsonwebtoken";

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

export function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(candidate, Buffer.from(hash, "hex"));
}

export function createToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured on the server");

  return jwt.sign({
    sub: user._id.toString(),
    role: user.role,
  }, secret, { algorithm: "HS256", expiresIn: TOKEN_TTL_SECONDS });
}

export function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured on the server");

  try {
    return jwt.verify(token, secret, { algorithms: ["HS256"] });
  } catch (error) {
    if (error.name === "TokenExpiredError") throw new Error("Session expired");
    throw new Error("Invalid session token");
  }
}
