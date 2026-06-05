import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import StoreHeader from "@/components/StoreHeader";
import StoreFooter from "@/components/StoreFooter";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import { categories, rooms } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";

const SearchPage = () => {
  const [params] = useSearchParams();
  const query = params.get("q")?.trim() || "";
  const { products, loading, error } = useProducts();
  const [category, setCategory] = useState("All");
  const [room, setRoom] = useState("All");
  const [stock, setStock] = useState("all");
  const [sort, setSort] = useState("rating");

  const matches = products
    .filter((product) =>
      `${product.name} ${product.category} ${product.room} ${product.description}`.toLowerCase().includes(query.toLowerCase()),
    )
    .filter((product) => category === "All" || product.category === category)
    .filter((product) => room === "All" || product.room === room)
    .filter((product) => stock === "all" || (stock === "in-stock" ? product.stock > 0 : product.stock === 0))
    .sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : b.ratingAverage - a.ratingAverage);

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      <main className="container flex-1 py-12 md:py-20">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">Search the collection</p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold mt-2">Results for "{query}"</h1>
        <p className="font-body text-muted-foreground mt-3">{matches.length} matching pieces</p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="border bg-background rounded-sm px-3 py-2 font-body text-sm">
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={room} onChange={(event) => setRoom(event.target.value)} className="border bg-background rounded-sm px-3 py-2 font-body text-sm">
            <option>All</option>
            {rooms.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={stock} onChange={(event) => setStock(event.target.value)} className="border bg-background rounded-sm px-3 py-2 font-body text-sm">
            <option value="all">All stock</option>
            <option value="in-stock">In stock</option>
            <option value="out">Out of stock</option>
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="border bg-background rounded-sm px-3 py-2 font-body text-sm">
            <option value="rating">Top rated</option>
            <option value="price-low">Price low-high</option>
            <option value="price-high">Price high-low</option>
          </select>
        </div>
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
