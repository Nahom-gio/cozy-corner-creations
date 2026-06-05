export function buildOrderItems(requestedItems, products) {
  const productsById = new Map(products.map((product) => [product.id, product]));
  const quantitiesByProduct = new Map();
  requestedItems.forEach((item) => {
    const productId = String(item.productId);
    quantitiesByProduct.set(productId, (quantitiesByProduct.get(productId) ?? 0) + Number(item.quantity));
  });

  return [...quantitiesByProduct].map(([productId, quantity]) => {
    const product = productsById.get(productId);

    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20 || product.stock < quantity) {
      const error = new Error("One or more cart items are invalid");
      error.status = 400;
      throw error;
    }

    return {
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
      subtotal: product.price * quantity,
    };
  });
}
