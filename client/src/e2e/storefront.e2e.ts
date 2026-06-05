import { expect, test } from "@playwright/test";

test("loads the live catalog and adds a product to the cart", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "The Collection" })).toBeVisible();
  const addToCart = page.getByRole("button", { name: /^Add .+ to cart$/ }).first();
  await expect(addToCart).toBeVisible();
  await addToCart.click();

  await expect(page.getByRole("heading", { name: "Your Cart" })).toBeVisible();
  await expect(page.getByText("Subtotal")).toBeVisible();
  await expect(page.getByRole("link", { name: "Checkout" })).toBeVisible();
});
