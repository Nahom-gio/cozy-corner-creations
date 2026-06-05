import { useQuery } from "@tanstack/react-query";
import { FormEvent, useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";
import StoreHeader from "@/components/StoreHeader";
import StoreFooter from "@/components/StoreFooter";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";

const AccountPage = () => {
  const { user, token, logout, loading, updateProfile, updatePassword } = useAuth();
  const { addItem, setIsOpen } = useCart();
  const orders = useQuery({ queryKey: ["orders", user?.id], queryFn: () => api.getOrders(token), enabled: Boolean(token) });
  const { products } = useProducts();
  const [profile, setProfile] = useState({ name: "", phone: "", address: "", city: "", country: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", nextPassword: "" });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (user) setProfile({ name: user.name, phone: user.phone || "", address: user.address || "", city: user.city || "", country: user.country || "" });
  }, [user]);
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await updateProfile(profile);
      setMessage("Profile updated");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await updatePassword(passwords.currentPassword, passwords.nextPassword);
      setPasswords({ currentPassword: "", nextPassword: "" });
      setMessage("Password updated");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update password");
    } finally {
      setSaving(false);
    }
  };

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
          <h2 className="font-display text-3xl font-semibold">Profile</h2>
          <div className="grid lg:grid-cols-2 gap-8 mt-6">
            <form onSubmit={saveProfile} className="border bg-card rounded-sm p-5 grid sm:grid-cols-2 gap-4">
              {(["name", "phone", "address", "city", "country"] as const).map((field) => (
                <label key={field} className={`font-body text-sm capitalize ${field === "address" ? "sm:col-span-2" : ""}`}>
                  {field}
                  <input value={profile[field]} onChange={(event) => setProfile({ ...profile, [field]: event.target.value })} className="mt-1 w-full border bg-background rounded-sm px-3 py-2" required={field === "name"} />
                </label>
              ))}
              <button disabled={saving} className="sm:col-span-2 py-3 bg-primary text-primary-foreground rounded-sm font-body disabled:opacity-60">Save profile</button>
            </form>
            <form onSubmit={savePassword} className="border bg-card rounded-sm p-5 space-y-4">
              <h3 className="font-display text-2xl font-semibold">Change password</h3>
              <label className="block font-body text-sm">
                Current password
                <input type="password" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} className="mt-1 w-full border bg-background rounded-sm px-3 py-2" required />
              </label>
              <label className="block font-body text-sm">
                New password
                <input type="password" minLength={8} value={passwords.nextPassword} onChange={(event) => setPasswords({ ...passwords, nextPassword: event.target.value })} className="mt-1 w-full border bg-background rounded-sm px-3 py-2" required />
              </label>
              <button disabled={saving} className="w-full py-3 bg-primary text-primary-foreground rounded-sm font-body disabled:opacity-60">Update password</button>
            </form>
          </div>
          {message && <p className="mt-4 font-body text-sm text-muted-foreground">{message}</p>}
        </section>
        <section className="border-t py-10">
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
            {products.filter((product) => user.wishlist.includes(product.id)).map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
                <button
                  onClick={() => { addItem(product); setIsOpen(true); }}
                  disabled={product.stock === 0}
                  className="mt-3 w-full py-2 border rounded-sm font-body text-sm disabled:opacity-60"
                >
                  Move to cart
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
      <StoreFooter />
    </div>
  );
};

export default AccountPage;
