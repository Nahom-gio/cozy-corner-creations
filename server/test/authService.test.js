import assert from "node:assert/strict";
import test from "node:test";
import { createToken, hashPassword, verifyPassword, verifyToken } from "../services/authService.js";

process.env.JWT_SECRET = "test-secret";

test("password hashes are salted and verifiable", () => {
  const first = hashPassword("correct horse battery staple");
  const second = hashPassword("correct horse battery staple");
  assert.notEqual(first, second);
  assert.equal(verifyPassword("correct horse battery staple", first), true);
  assert.equal(verifyPassword("wrong password", first), false);
});

test("session tokens are signed and include the user identity", () => {
  const token = createToken({ _id: { toString: () => "user-1" }, role: "customer" });
  assert.equal(verifyToken(token).sub, "user-1");
  assert.throws(() => verifyToken(`${token}tampered`), /Invalid session token/);
});
