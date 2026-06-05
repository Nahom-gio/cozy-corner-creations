import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useProducts() {
  const query = useQuery({ queryKey: ["products"], queryFn: api.getProducts });
  return { products: query.data ?? [], loading: query.isPending, error: query.error };
}

export function useProduct(id?: string) {
  const productsQuery = useProducts();
  const query = useQuery({
    queryKey: ["products", id],
    queryFn: () => api.getProduct(id!),
    enabled: Boolean(id),
  });

  return {
    product: query.data,
    products: productsQuery.products,
    loading: query.isPending,
    error: query.error,
  };
}
