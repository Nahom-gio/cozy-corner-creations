import { useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import StoreHeader from "@/components/StoreHeader";
import StoreFooter from "@/components/StoreFooter";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = useMemo(() => products.find((p) => p.id === id), [id]);
  const { addItem, setIsOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) return <Navigate to="/404" replace />;

  // Build a small gallery (same image repeated; ready for real multi-images later)
  const gallery = [product.image, product.image, product.image];

  const related = products
    .filter((p) => p.id !== product.id && (p.room === product.room || p.category === product.category))
    .slice(0, 4);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
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
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <p className="font-body text-xs tracking-wider uppercase text-muted-foreground">
              {product.category} · {product.room}
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
              {product.description} Crafted with care to bring warmth and character to your space,
              this piece blends timeless materials with a quiet, modern silhouette.
            </p>

            <ul className="mt-6 grid grid-cols-2 gap-y-2 gap-x-6 font-body text-sm">
              <li className="text-muted-foreground">Material<span className="block text-foreground">Natural fibers & wood</span></li>
              <li className="text-muted-foreground">Origin<span className="block text-foreground">Handcrafted in Europe</span></li>
              <li className="text-muted-foreground">Ships in<span className="block text-foreground">2–3 weeks</span></li>
              <li className="text-muted-foreground">Warranty<span className="block text-foreground">10 years</span></li>
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
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-secondary transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <button
                onClick={handleAdd}
                className="w-full py-4 bg-primary text-primary-foreground font-body text-sm font-medium tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to cart · ${(product.price * quantity).toLocaleString()}
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
