import { FormEvent, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api, type Order } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import StoreHeader from "@/components/StoreHeader";
import StoreFooter from "@/components/StoreFooter";
import CartDrawer from "@/components/CartDrawer";
import { useAuth } from "@/context/AuthContext";

const emptyCustomer = { name: "", email: "", address: "", city: "", country: "" };

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const [customer, setCustomer] = useState(emptyCustomer);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) setCustomer((current) => ({ ...current, name: current.name || user.name, email: current.email || user.email }));
  }, [user]);

  const submitOrder = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const createdOrder = await api.createOrder({
        customer,
        items: items.map((item) => ({ productId: item.id, variantId: item.selectedVariant?.id, quantity: item.quantity })),
      }, token);
      setOrder(createdOrder);
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not place the order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      <main className="flex-1 container py-12 md:py-20 max-w-5xl">
        {!user ? (
          <section className="max-w-xl mx-auto text-center py-16">
            <p className="font-body text-xs tracking-wider uppercase text-muted-foreground">Ethio account</p>
            <h1 className="font-display text-4xl font-semibold mt-3">Sign in before checkout.</h1>
            <p className="font-body text-muted-foreground mt-4">Your account keeps your order history and delivery details connected to you.</p>
            <Link to="/auth" className="inline-block mt-8 px-6 py-3 bg-primary text-primary-foreground rounded-sm font-body">Sign in or register</Link>
          </section>
        ) : order ? (
          <section className="max-w-xl mx-auto text-center py-16">
            <p className="font-body text-xs tracking-wider uppercase text-accent">Order confirmed</p>
            <h1 className="font-display text-4xl font-semibold mt-3">Thank you for your order.</h1>
            <p className="font-body text-muted-foreground mt-4">
              Your order number is <strong className="text-foreground">{order.orderNumber}</strong>. The server
              calculated and stored your total of ${order.total.toLocaleString()}.
            </p>
            <Link to="/" className="inline-block mt-8 px-6 py-3 bg-primary text-primary-foreground rounded-sm font-body">
              Continue shopping
            </Link>
          </section>
        ) : items.length === 0 ? (
          <section className="text-center py-16">
            <h1 className="font-display text-4xl font-semibold">Your cart is empty.</h1>
            <Link to="/" className="inline-block mt-6 text-primary underline font-body">Browse the collection</Link>
          </section>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-12">
            <section>
              <h1 className="font-display text-4xl font-semibold">Checkout</h1>
              <p className="font-body text-muted-foreground mt-2">Enter your delivery details to place your order.</p>
              <form onSubmit={submitOrder} className="grid sm:grid-cols-2 gap-4 mt-8">
                {Object.keys(emptyCustomer).map((field) => (
                  <label key={field} className={`font-body text-sm capitalize ${field === "address" ? "sm:col-span-2" : ""}`}>
                    {field}
                    <input
                      required
                      type={field === "email" ? "email" : "text"}
                      value={customer[field as keyof typeof customer]}
                      onChange={(event) => setCustomer({ ...customer, [field]: event.target.value })}
                      className="mt-1 w-full border bg-background rounded-sm px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                    />
                  </label>
                ))}
                {error && <p className="sm:col-span-2 text-sm text-destructive font-body">{error}</p>}
                <button
                  disabled={submitting}
                  className="sm:col-span-2 mt-2 py-3 bg-primary text-primary-foreground rounded-sm font-body uppercase tracking-wider disabled:opacity-60"
                >
                  {submitting ? "Placing order..." : `Place order - $${totalPrice.toLocaleString()}`}
                </button>
              </form>
            </section>
            <aside className="bg-card p-6 rounded-sm h-fit">
              <h2 className="font-display text-2xl font-semibold">Order summary</h2>
              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm font-body">
                    <img src={item.image} alt="" className="w-14 h-14 object-cover rounded-sm" />
                    <div className="flex-1">
                      <p>{item.name}</p>
                      {item.selectedVariant && <p className="text-muted-foreground">{item.selectedVariant.name}</p>}
                      <p className="text-muted-foreground">Qty {item.quantity}</p>
                    </div>
                    <span>${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <p className="flex justify-between border-t mt-5 pt-4 font-body font-semibold">
                <span>Total</span><span>${totalPrice.toLocaleString()}</span>
              </p>
            </aside>
          </div>
        )}
      </main>
      <CartDrawer />
      <StoreFooter />
    </div>
  );
};

export default CheckoutPage;
