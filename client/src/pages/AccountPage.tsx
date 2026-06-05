import { useQuery } from "@tanstack/react-query";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import StoreHeader from "@/components/StoreHeader";
import StoreFooter from "@/components/StoreFooter";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";

const AccountPage = () => {
  const { user, token, logout, loading } = useAuth();
  const orders = useQuery({ queryKey: ["orders", user?.id], queryFn: () => api.getOrders(token), enabled: Boolean(token) });
  const { products } = useProducts();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      <main className="container flex-1 py-12 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-8">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">Your account</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold mt-2">Welcome, {user.name}.</h1>
            <p className="font-body text-muted-foreground mt-2">{user.email}</p>
          </div>
          <div className="flex gap-4 font-body text-sm">
            {user.role === "admin" && <Link to="/admin" className="text-primary underline">Open admin</Link>}
            <button onClick={logout} className="text-muted-foreground underline">Sign out</button>
          </div>
        </div>
        <section className="py-10">
          <h2 className="font-display text-3xl font-semibold">Order history</h2>
          {orders.isPending && <p className="font-body text-muted-foreground mt-5">Loading orders...</p>}
          {orders.data?.length === 0 && <p className="font-body text-muted-foreground mt-5">You have not placed an order yet.</p>}
          <div className="grid lg:grid-cols-2 gap-5 mt-6">
            {orders.data?.map((order) => (
              <article key={order.orderNumber} className="border bg-card rounded-sm p-5">
                <div className="flex justify-between gap-4">
                  <div><p className="font-display text-xl">{order.orderNumber}</p><p className="font-body text-xs text-muted-foreground mt-1">{new Date(order.createdAt).toLocaleDateString()}</p></div>
                  <span className="font-body text-xs uppercase tracking-wider text-accent">{order.status}</span>
                </div>
                <div className="border-t mt-4 pt-4 font-body text-sm flex justify-between"><span>{order.items.length} item types</span><strong>${order.total.toLocaleString()}</strong></div>
              </article>
            ))}
          </div>
        </section>
        <section className="border-t py-10">
          <h2 className="font-display text-3xl font-semibold">Saved favorites</h2>
          {user.wishlist.length === 0 && <p className="font-body text-muted-foreground mt-5">Save pieces you love from the collection.</p>}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {products.filter((product) => user.wishlist.includes(product.id)).map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      </main>
      <StoreFooter />
    </div>
  );
};

export default AccountPage;
