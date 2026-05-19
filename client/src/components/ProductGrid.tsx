import { useState } from "react";
import { categories } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";

const ProductGrid = () => {
  const [active, setActive] = useState("All");
  const { products, loading } = useProducts();

  const filtered = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <section id="products" className="container py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">The Collection</h2>
          <p className="font-body text-muted-foreground mt-2">Handpicked pieces for every room.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-1.5 text-sm font-body rounded-full transition-colors ${
                active === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {loading && <p className="font-body text-sm text-muted-foreground mb-6">Loading products...</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
