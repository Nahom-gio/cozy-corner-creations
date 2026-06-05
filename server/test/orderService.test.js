import assert from "node:assert/strict";
import test from "node:test";
import { buildOrderItems } from "../services/orderService.js";

const products = [{ id: "chair-1", name: "Chair", image: "/chair.jpg", price: 250, stock: 5, variants: [] }];

test("buildOrderItems trusts catalog prices and calculates subtotals", () => {
  const items = buildOrderItems([{ productId: "chair-1", quantity: 3, price: 1 }], products);

  assert.deepEqual(items, [{
    productId: "chair-1",
    variantId: "",
    variantName: "",
    name: "Chair",
    image: "/chair.jpg",
    price: 250,
    quantity: 3,
    subtotal: 750,
  }]);
});

test("buildOrderItems supports product variants with their own price and stock", () => {
  const items = buildOrderItems([{ productId: "chair-1", variantId: "linen", quantity: 2 }], [{
    ...products[0],
    variants: [{ id: "linen", name: "Linen", priceAdjustment: 40, stock: 2 }],
  }]);

  assert.equal(items[0].name, "Chair - Linen");
  assert.equal(items[0].price, 290);
  assert.equal(items[0].subtotal, 580);
  assert.throws(() => buildOrderItems([{ productId: "chair-1", variantId: "linen", quantity: 3 }], [{
    ...products[0],
    variants: [{ id: "linen", name: "Linen", priceAdjustment: 40, stock: 2 }],
  }]), /invalid/);
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
