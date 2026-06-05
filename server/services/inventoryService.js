import Product from "../models/Product.js";

export async function reserveInventory(items) {
  const reserved = [];

  try {
    for (const item of items) {
      const filter = item.variantId
        ? { id: item.productId, variants: { $elemMatch: { id: item.variantId, stock: { $gte: item.quantity } } } }
        : { id: item.productId, stock: { $gte: item.quantity } };
      const update = item.variantId
        ? { $inc: { "variants.$.stock": -item.quantity } }
        : { $inc: { stock: -item.quantity } };
      const product = await Product.findOneAndUpdate(
        filter,
        update,
        { new: true },
      );
      if (!product) throw Object.assign(new Error("One or more products no longer have enough stock"), { status: 409 });
      reserved.push(item);
    }
  } catch (error) {
    await releaseInventory(reserved);
    throw error;
  }
}

export async function releaseInventory(items) {
  if (items.length === 0) return;
  await Product.bulkWrite(items.map((item) => ({
    updateOne: item.variantId
      ? { filter: { id: item.productId, "variants.id": item.variantId }, update: { $inc: { "variants.$.stock": item.quantity } } }
      : { filter: { id: item.productId }, update: { $inc: { stock: item.quantity } } },
  })));
}
