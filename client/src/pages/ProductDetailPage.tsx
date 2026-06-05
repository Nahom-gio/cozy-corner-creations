import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import StoreHeader from "@/components/StoreHeader";
import StoreFooter from "@/components/StoreFooter";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useProduct } from "@/hooks/useProducts";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { product, products, loading, error } = useProduct(id);
  const { addItem, setIsOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <StoreHeader />
        <main className="flex-1 container py-24">
          <p className="font-body text-muted-foreground">Loading product...</p>
        </main>
        <CartDrawer />
        <StoreFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <StoreHeader />
        <main className="flex-1 container py-24">
          <h1 className="font-display text-3xl font-semibold">Product unavailable</h1>
          <p className="font-body text-destructive mt-3">{error.message}</p>
        </main>
        <CartDrawer />
        <StoreFooter />
      </div>
    );
  }

  if (!product) return <Navigate to="/404" replace />;

  const gallery = product.images;

  const related = products
    .filter((p) => p.id !== product.id && (p.room === product.room || p.category === product.category))
    .slice(0, 4);

  const handleAdd = () => {
    addItem(product, quantity);
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      <main className="flex-1">
        <div className="container py-6">
          <Link to="/" className="inline-flex items-center gap-1 font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to collection
          </Link>
        </div>

        <section className="container grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 pb-16">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <div className="aspect-square overflow-hidden rounded-sm bg-card">
              <img
                key={activeImage}
                src={gallery[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover animate-fade-in"
              />
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square overflow-hidden rounded-sm bg-card border-2 transition-colors ${
                    activeImage === i ? "border-primary" : "border-transparent hover:border-muted"
                  }`}
                  aria-label={`Show image ${i + 1}`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <p className="font-body text-xs tracking-wider uppercase text-muted-foreground">
              {product.category} - {product.room}
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mt-2">
              {product.name}
            </h1>
            <p className="font-body text-2xl text-foreground mt-4">
              ${product.price.toLocaleString()}
            </p>

            <div className="my-8 border-t" />

            <h2 className="font-display text-lg font-medium text-foreground mb-2">Description</h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <ul className="mt-6 grid grid-cols-2 gap-y-2 gap-x-6 font-body text-sm">
              <li className="text-muted-foreground">Material<span className="block text-foreground">{product.material}</span></li>
              <li className="text-muted-foreground">Origin<span className="block text-foreground">{product.origin}</span></li>
              <li className="text-muted-foreground">Ships in<span className="block text-foreground">{product.shipping}</span></li>
              <li className="text-muted-foreground">Warranty<span className="block text-foreground">{product.warranty}</span></li>
            </ul>

            <div className="mt-auto pt-10 space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-body text-sm text-muted-foreground">Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-secondary transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-body w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-secondary transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <button
                onClick={handleAdd}
                disabled={product.stock === 0}
                className="w-full py-4 bg-primary text-primary-foreground font-body text-sm font-medium tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 disabled:bg-muted disabled:text-muted-foreground"
              >
                <ShoppingBag className="w-4 h-4" />
                {product.stock === 0 ? "Out of stock" : `Add to cart - $${(product.price * quantity).toLocaleString()}`}
              </button>
            </div>
          </motion.div>
        </section>

        {related.length > 0 && (
          <section className="container pb-20">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-8">
              You may also like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <CartDrawer />
      <StoreFooter />
    </div>
  );
};

export default ProductDetailPage;
