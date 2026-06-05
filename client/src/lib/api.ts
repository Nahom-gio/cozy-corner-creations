import type { Product } from "@/data/products";

type ApiErrorPayload = { message?: string };

export type ProductInput = Omit<Product, "id"> & { id?: string };

export type OrderInput = {
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    country: string;
  };
  items: Array<{ productId: string; quantity: number }>;
};

export type Order = {
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  customer: OrderInput["customer"];
  items: Array<{ productId: string; name: string; image: string; price: number; quantity: number; subtotal: number }>;
};

export type User = { id: string; name: string; email: string; role: "customer" | "admin"; wishlist: string[] };
export type Session = { token: string; user: User };

async function request<T>(path: string, options?: RequestInit, token?: string): Promise<T> {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options?.headers },
    ...options,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;
    throw new Error(payload.message || "The server could not complete your request");
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  getProducts: () => request<Product[]>("/api/products"),
  getProduct: (id: string) => request<Product>(`/api/products/${id}`),
  createProduct: (product: ProductInput, token: string) =>
    request<Product>("/api/products", { method: "POST", body: JSON.stringify(product) }, token),
  updateProduct: (id: string, product: ProductInput, token: string) =>
    request<Product>(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(product) }, token),
  deleteProduct: (id: string, token: string) => request<void>(`/api/products/${id}`, { method: "DELETE" }, token),
  register: (input: { name: string; email: string; password: string }) =>
    request<Session>("/api/auth/register", { method: "POST", body: JSON.stringify(input) }),
  login: (input: { email: string; password: string }) =>
    request<Session>("/api/auth/login", { method: "POST", body: JSON.stringify(input) }),
  getMe: (token: string) => request<User>("/api/auth/me", undefined, token),
  toggleWishlist: (productId: string, token: string) =>
    request<User>(`/api/auth/wishlist/${productId}`, { method: "PUT" }, token),
  createOrder: (order: OrderInput, token: string) =>
    request<Order>("/api/orders", { method: "POST", body: JSON.stringify(order) }, token),
  getOrders: (token: string) => request<Order[]>("/api/orders", undefined, token),
  updateOrderStatus: (orderNumber: string, status: string, token: string) =>
    request<Order>(`/api/orders/${orderNumber}/status`, { method: "PUT", body: JSON.stringify({ status }) }, token),
  uploadImage: async (file: File, token: string) => {
    const response = await fetch("/api/uploads", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": file.type },
      body: file,
    });
    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;
      throw new Error(payload.message || "Could not upload image");
    }
    return response.json() as Promise<{ url: string }>;
  },
};
