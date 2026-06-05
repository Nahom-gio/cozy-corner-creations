import { useSearchParams } from "react-router-dom";
import StoreHeader from "@/components/StoreHeader";
import StoreFooter from "@/components/StoreFooter";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";

const SearchPage = () => {
  const [params] = useSearchParams();
  const query = params.get("q")?.trim() || "";
  const { products, loading, error } = useProducts();
  const matches = products.filter((product) =>
    `${product.name} ${product.category} ${product.room} ${product.description}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      <main className="container flex-1 py-12 md:py-20">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">Search the collection</p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold mt-2">Results for “{query}”</h1>
        <p className="font-body text-muted-foreground mt-3">{matches.length} matching pieces</p>
        {loading && <p className="font-body text-muted-foreground mt-8">Loading products...</p>}
        {error && <p className="font-body text-destructive mt-8">{error.message}</p>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-10">{matches.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </main>
      <CartDrawer />
      <StoreFooter />
    </div>
  );
};

export default SearchPage;
