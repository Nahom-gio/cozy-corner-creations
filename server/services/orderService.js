export function buildOrderItems(requestedItems, products) {
  const productsById = new Map(products.map((product) => [product.id, product]));
  const quantitiesByProduct = new Map();
  requestedItems.forEach((item) => {
    const productId = String(item.productId);
    const variantId = String(item.variantId ?? "");
    const key = `${productId}::${variantId}`;
    quantitiesByProduct.set(key, (quantitiesByProduct.get(key) ?? 0) + Number(item.quantity));
  });

  return [...quantitiesByProduct].map(([key, quantity]) => {
    const [productId, variantId] = key.split("::");
    const product = productsById.get(productId);
    const variant = variantId ? (product?.variants ?? []).find((item) => item.id === variantId) : null;
    const availableStock = variant ? variant.stock : product?.stock;
    const price = product ? product.price + (variant?.priceAdjustment ?? 0) : 0;

    if (!product || (variantId && !variant) || !Number.isInteger(quantity) || quantity < 1 || quantity > 20 || availableStock < quantity) {
      const error = new Error("One or more cart items are invalid");
      error.status = 400;
      throw error;
    }

    return {
      productId: product.id,
      variantId,
      variantName: variant?.name ?? "",
      name: variant ? `${product.name} - ${variant.name}` : product.name,
      image: product.image,
      price,
      quantity,
      subtotal: price * quantity,
    };
  });
}
