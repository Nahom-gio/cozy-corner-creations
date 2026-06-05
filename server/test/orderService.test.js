import assert from "node:assert/strict";
import test from "node:test";
import { buildOrderItems } from "../services/orderService.js";

const products = [{ id: "chair-1", name: "Chair", image: "/chair.jpg", price: 250, stock: 5 }];

test("buildOrderItems trusts catalog prices and calculates subtotals", () => {
  const items = buildOrderItems([{ productId: "chair-1", quantity: 3, price: 1 }], products);

  assert.deepEqual(items, [{
    productId: "chair-1",
    name: "Chair",
    image: "/chair.jpg",
    price: 250,
    quantity: 3,
    subtotal: 750,
  }]);
});

test("buildOrderItems rejects missing products and invalid quantities", () => {
  assert.throws(() => buildOrderItems([{ productId: "missing", quantity: 1 }], products), /invalid/);
  assert.throws(() => buildOrderItems([{ productId: "chair-1", quantity: 0 }], products), /invalid/);
  assert.throws(() => buildOrderItems([{ productId: "chair-1", quantity: 21 }], products), /invalid/);
  assert.throws(() => buildOrderItems([{ productId: "chair-1", quantity: 6 }], products), /invalid/);
});

test("buildOrderItems merges duplicate product entries before validating stock", () => {
  const items = buildOrderItems([{ productId: "chair-1", quantity: 2 }, { productId: "chair-1", quantity: 3 }], products);
  assert.equal(items.length, 1);
  assert.equal(items[0].quantity, 5);
  assert.throws(() => buildOrderItems([{ productId: "chair-1", quantity: 3 }, { productId: "chair-1", quantity: 3 }], products), /invalid/);
});
