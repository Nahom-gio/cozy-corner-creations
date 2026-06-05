import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { categories, rooms, type Product } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { api, type ProductInput } from "@/lib/api";

const productCategories = categories.filter((category) => category !== "All");
const statuses = ["placed", "processing", "shipped", "delivered"];
const placeholderImage = "/products/armchair-olive.jpg";
const emptyProduct: ProductInput = {
  name: "",
  price: 0,
  stock: 0,
  category: "Seating",
  room: "Living",
  image: placeholderImage,
  images: [placeholderImage],
  description: "",
  material: "",
  origin: "",
  shipping: "",
  warranty: "",
};

const AdminPage = () => {
  const queryClient = useQueryClient();
  const { user, token, loading: authLoading } = useAuth();
  const { products, loading, error } = useProducts();
  const orders = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => api.getOrders(token),
    enabled: user?.role === "admin",
  });
  const [form, setForm] = useState<ProductInput>(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [section, setSection] = useState<"catalog" | "orders">("catalog");
  const [uploading, setUploading] = useState(false);

  const refreshCatalog = () => queryClient.invalidateQueries({ queryKey: ["products"] });
  const resetForm = () => {
    setEditingId(null);
    setForm(emptyProduct);
  };
  const saveMutation = useMutation({
    mutationFn: () => editingId ? api.updateProduct(editingId, form, token) : api.createProduct(form, token),
    onSuccess: () => {
      toast.success(editingId ? "Product updated" : "Product created");
      resetForm();
      refreshCatalog();
    },
    onError: (requestError) => toast.error(requestError.message),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteProduct(id, token),
    onSuccess: () => {
      toast.success("Product deleted");
      refreshCatalog();
    },
    onError: (requestError) => toast.error(requestError.message),
  });
  const statusMutation = useMutation({
    mutationFn: ({ orderNumber, status }: { orderNumber: string; status: string }) =>
      api.updateOrderStatus(orderNumber, status, token),
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (requestError) => toast.error(requestError.message),
  });

  if (authLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== "admin") return <Navigate to="/account" replace />;

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setForm(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    saveMutation.mutate();
  };
  const uploadImages = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const uploads = await Promise.all(Array.from(files).map((file) => api.uploadImage(file, token)));
      const urls = uploads.map(({ url }) => url);
      setForm((current) => {
        const isPlaceholder = current.image === placeholderImage && current.images.length === 1;
        const images = Array.from(new Set([...(isPlaceholder ? [] : current.images), ...urls]));
        return { ...current, image: isPlaceholder ? urls[0] : current.image, images };
      });
      toast.success(`${urls.length} image${urls.length === 1 ? "" : "s"} uploaded`);
    } catch (uploadError) {
      toast.error(uploadError instanceof Error ? uploadError.message : "Could not upload image");
    } finally {
      setUploading(false);
    }
  };
  const removeImage = (image: string) => {
    setForm((current) => {
      const images = current.images.filter((item) => item !== image);
      const nextImages = images.length ? images : [placeholderImage];
      return { ...current, image: current.image === image ? nextImages[0] : current.image, images: nextImages };
    });
  };
  const orderList = orders.data ?? [];
  const metrics = [
    { label: "Products", value: products.length.toLocaleString() },
    { label: "Orders", value: orderList.length.toLocaleString() },
    { label: "Revenue", value: `$${orderList.reduce((total, order) => total + order.total, 0).toLocaleString()}` },
    { label: "Low stock", value: products.filter((product) => product.stock <= 3).length.toLocaleString() },
  ];
  const fieldClass = "mt-1 w-full border bg-background rounded-sm px-3 py-2 font-body text-sm";

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container py-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">Private workspace</p>
            <h1 className="font-display text-4xl font-semibold mt-1">Ethio Admin</h1>
          </div>
          <div className="flex gap-4 font-body text-sm">
            <Link to="/" className="text-primary underline">View storefront</Link>
            <Link to="/account" className="text-muted-foreground underline">My account</Link>
          </div>
        </div>
      </header>
      <section className="container grid grid-cols-2 lg:grid-cols-4 gap-3 pt-6">
        {metrics.map((metric) => (
          <article key={metric.label} className="border bg-card rounded-sm px-4 py-3">
            <p className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground">{metric.label}</p>
            <p className="font-display text-2xl mt-1">{metric.value}</p>
          </article>
        ))}
      </section>
      <nav className="container flex gap-2 py-6">
        {(["catalog", "orders"] as const).map((item) => (
          <button key={item} onClick={() => setSection(item)} className={`px-5 py-2 rounded-full font-body text-sm capitalize ${section === item ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
            {item}
          </button>
        ))}
      </nav>
      {section === "catalog" ? (
        <div className="container pb-16 grid xl:grid-cols-[380px_1fr] gap-10">
          <section className="bg-card border rounded-sm p-5 h-fit">
            <h2 className="font-display text-2xl font-semibold">{editingId ? "Edit product" : "Add product"}</h2>
            <form onSubmit={submit} className="mt-5 space-y-3">
              <label className="block font-body text-sm">
                Product gallery
                <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => uploadImages(event.target.files)} className={`${fieldClass} file:mr-3 file:border-0 file:bg-secondary file:px-2 file:py-1`} />
                <span className="block mt-1 text-xs text-muted-foreground">{uploading ? "Uploading images..." : "Select one or more images. JPG, PNG, WEBP, or GIF, maximum 5 MB each."}</span>
              </label>
              <img src={form.image} alt="Primary product preview" className="w-full aspect-[4/3] object-cover rounded-sm border bg-background" />
              <div className="grid grid-cols-3 gap-2">
                {form.images.map((image) => (
                  <div key={image} className={`relative rounded-sm overflow-hidden border-2 ${image === form.image ? "border-primary" : "border-transparent"}`}>
                    <button type="button" onClick={() => setForm({ ...form, image })} className="block w-full" title="Use as primary image">
                      <img src={image} alt="" className="w-full aspect-square object-cover bg-background" />
                    </button>
                    <button type="button" onClick={() => removeImage(image)} className="absolute right-1 top-1 bg-background/90 px-1.5 py-0.5 rounded-sm font-body text-xs" title="Remove image">Remove</button>
                  </div>
                ))}
              </div>
              <p className="font-body text-xs text-muted-foreground">Click a thumbnail to make it the storefront cover image.</p>
              {(["name", "price", "stock", "description", "material", "origin", "shipping", "warranty"] as const).map((field) => (
                <label key={field} className="block font-body text-sm capitalize">
                  {field}
                  {field === "description" ? (
                    <textarea required value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className={`${fieldClass} min-h-24`} />
                  ) : (
                    <input required type={field === "price" || field === "stock" ? "number" : "text"} min={field === "price" || field === "stock" ? 0 : undefined} value={form[field]} onChange={(event) => setForm({ ...form, [field]: field === "price" || field === "stock" ? Number(event.target.value) : event.target.value })} className={fieldClass} />
                  )}
                </label>
              ))}
              <label className="block font-body text-sm">
                Category
                <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className={fieldClass}>{productCategories.map((item) => <option key={item}>{item}</option>)}</select>
              </label>
              <label className="block font-body text-sm">
                Room
                <select value={form.room} onChange={(event) => setForm({ ...form, room: event.target.value })} className={fieldClass}>{rooms.map((item) => <option key={item}>{item}</option>)}</select>
              </label>
              <button disabled={saveMutation.isPending || uploading} className="w-full py-3 bg-primary text-primary-foreground rounded-sm font-body">{editingId ? "Save changes" : "Create product"}</button>
              {editingId && <button type="button" onClick={resetForm} className="w-full font-body text-sm underline">Cancel editing</button>}
            </form>
          </section>
          <section>
            <h2 className="font-display text-3xl font-semibold">Catalog</h2>
            {loading && <p className="mt-4 font-body text-muted-foreground">Loading...</p>}
            {error && <p className="mt-4 text-destructive">{error.message}</p>}
            <div className="mt-5 grid md:grid-cols-2 gap-4">
              {products.map((product) => (
                <article key={product.id} className="border rounded-sm p-4 flex gap-4 bg-card">
                  <img src={product.image} alt="" className="w-20 h-20 object-cover rounded-sm" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg truncate">{product.name}</h3>
                    <p className="font-body text-sm text-muted-foreground">${product.price.toLocaleString()} - {product.stock} in stock</p>
                    {product.stock <= 3 && <p className="font-body text-xs text-destructive mt-1">Low stock</p>}
                    <div className="flex gap-3 mt-3 text-sm font-body">
                      <button onClick={() => startEdit(product)} className="text-primary underline">Edit</button>
                      <button onClick={() => window.confirm(`Delete ${product.name}?`) && deleteMutation.mutate(product.id)} className="text-destructive underline">Delete</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <section className="container pb-16">
          <h2 className="font-display text-3xl font-semibold">Customer orders</h2>
          {orders.isLoading && <p className="mt-4 font-body text-muted-foreground">Loading...</p>}
          {orders.error && <p className="mt-4 text-destructive">{orders.error.message}</p>}
          {!orders.isLoading && !orderList.length && <p className="mt-4 font-body text-muted-foreground">No orders yet.</p>}
          <div className="grid lg:grid-cols-2 gap-5 mt-6">
            {orderList.map((order) => (
              <article key={order.orderNumber} className="border bg-card rounded-sm p-5">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl">{order.orderNumber}</h3>
                    <p className="font-body text-sm text-muted-foreground mt-1">{order.customer.name} - {order.customer.email}</p>
                  </div>
                  <strong className="font-body">${order.total.toLocaleString()}</strong>
                </div>
                <select value={order.status} onChange={(event) => statusMutation.mutate({ orderNumber: order.orderNumber, status: event.target.value })} className={`${fieldClass} mt-5`}>
                  {statuses.map((status) => <option key={status}>{status}</option>)}
                </select>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default AdminPage;
