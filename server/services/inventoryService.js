import Product from "../models/Product.js";

export async function reserveInventory(items) {
  const reserved = [];

  try {
    for (const item of items) {
      const product = await Product.findOneAndUpdate(
        { id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
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
    updateOne: { filter: { id: item.productId }, update: { $inc: { stock: item.quantity } } },
  })));
}
