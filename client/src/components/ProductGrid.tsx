import { useState } from "react";
import { categories, rooms } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";

const ProductGrid = () => {
  const [active, setActive] = useState("All");
  const [room, setRoom] = useState("All");
  const [stock, setStock] = useState("all");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const { products, loading, error } = useProducts();

  const pageSize = 8;
  const filtered = products
    .filter((p) => active === "All" || p.category === active)
    .filter((p) => room === "All" || p.room === room)
    .filter((p) => stock === "all" || (stock === "in-stock" ? p.stock > 0 : p.stock === 0))
    .sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : sort === "rating" ? b.ratingAverage - a.ratingAverage : a.name.localeCompare(b.name));
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section id="products" className="container py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">The Collection</h2>
          <p className="font-body text-muted-foreground mt-2">Handpicked pieces for every room.</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActive(cat); setPage(1); }}
              className={`px-4 py-1.5 text-sm font-body rounded-full transition-colors ${
                active === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
          <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="px-3 py-1.5 text-sm font-body rounded-full border bg-background">
            <option value="featured">Name A-Z</option>
            <option value="rating">Top rated</option>
            <option value="price-low">Price low-high</option>
            <option value="price-high">Price high-low</option>
          </select>
          <select value={room} onChange={(e) => { setRoom(e.target.value); setPage(1); }} className="px-3 py-1.5 text-sm font-body rounded-full border bg-background">
            <option>All</option>
            {rooms.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={stock} onChange={(e) => { setStock(e.target.value); setPage(1); }} className="px-3 py-1.5 text-sm font-body rounded-full border bg-background">
            <option value="all">All stock</option>
            <option value="in-stock">In stock</option>
            <option value="out">Out of stock</option>
          </select>
        </div>
      </div>
      {loading && <p className="font-body text-sm text-muted-foreground mb-6">Loading products...</p>}
      {error && (
        <p className="font-body text-sm text-destructive mb-6">
          The catalog API is unavailable. Check the server and MongoDB connection.
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: pages }, (_, index) => (
            <button key={index} onClick={() => setPage(index + 1)} className={`w-9 h-9 rounded-full font-body text-sm ${page === index + 1 ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{index + 1}</button>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
