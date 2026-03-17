import { useParams, Link } from "react-router-dom";
import { products, roomDescriptions, type Room } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import StoreHeader from "@/components/StoreHeader";
import CartDrawer from "@/components/CartDrawer";
import StoreFooter from "@/components/StoreFooter";

const CategoryPage = () => {
  const { room } = useParams<{ room: string }>();
  const roomKey = room as Room;
  const info = roomDescriptions[roomKey];

  if (!info) {
    return (
      <div className="min-h-screen flex flex-col">
        <StoreHeader />
        <main className="flex-1 container py-24 text-center">
          <h1 className="font-display text-4xl font-semibold text-foreground">Category not found</h1>
          <Link to="/" className="mt-6 inline-block text-primary underline font-body">Back to Home</Link>
        </main>
        <CartDrawer />
        <StoreFooter />
      </div>
    );
  }

  const filtered = products.filter((p) => p.room === roomKey);

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      <main className="flex-1">
        <section className="container pt-12 pb-6 md:pt-20 md:pb-10">
          <Link to="/" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mt-4">{info.title}</h1>
          <p className="font-body text-muted-foreground mt-2 max-w-lg">{info.subtitle}</p>
        </section>
        <section className="container pb-16 md:pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>
      <CartDrawer />
      <StoreFooter />
    </div>
  );
};

export default CategoryPage;
