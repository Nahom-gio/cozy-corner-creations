import { useEffect, useMemo, useState } from "react";
import { products as localProducts, type Product } from "@/data/products";

const normalizeProduct = (product: Product): Product => ({
  id: product.id,
  name: product.name,
  price: product.price,
  category: product.category,
  room: product.room,
  description: product.description,
  image: product.image,
});

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(localProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Could not load products");
        const data = (await response.json()) as Product[];
        if (active) setProducts(data.map(normalizeProduct));
      } catch {
        if (active) setProducts(localProducts);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  return { products, loading };
}

export function useProduct(id?: string) {
  const { products, loading } = useProducts();
  const product = useMemo(() => products.find((item) => item.id === id), [id, products]);

  return { product, products, loading };
}
