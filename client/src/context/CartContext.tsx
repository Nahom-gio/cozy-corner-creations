import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Product, ProductVariant } from "@/data/products";

export type CartItem = Product & { quantity: number; cartKey: string; selectedVariant?: ProductVariant };

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (cartKey: string) => void;
  updateQuantity: (cartKey: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | null>(null);
const CART_STORAGE_KEY = "ethio-cart";

const loadCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  } catch {
    return [];
  }
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, quantity = 1, variant?: ProductVariant) => {
    setItems((prev) => {
      const cartKey = `${product.id}::${variant?.id ?? ""}`;
      const stock = variant?.stock ?? product.stock;
      const price = product.price + (variant?.priceAdjustment ?? 0);
      const existing = prev.find((i) => i.cartKey === cartKey);
      if (existing) {
        return prev.map((i) => (i.cartKey === cartKey ? { ...i, quantity: Math.min(stock, i.quantity + quantity), stock, price } : i));
      }
      return [...prev, { ...product, cartKey, selectedVariant: variant, stock, price, quantity: Math.min(stock, quantity) }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((cartKey: string) => {
    setItems((prev) => prev.filter((i) => i.cartKey !== cartKey));
  }, []);

  const updateQuantity = useCallback((cartKey: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.cartKey !== cartKey));
    } else {
      setItems((prev) => prev.map((i) => (i.cartKey === cartKey ? { ...i, quantity: Math.min(i.stock, qty) } : i)));
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
};
