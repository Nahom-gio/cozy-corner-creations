import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useParams, Navigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, ChevronLeft, Star } from "lucide-react";
import { motion } from "framer-motion";
import StoreHeader from "@/components/StoreHeader";
import StoreFooter from "@/components/StoreFooter";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useProduct } from "@/hooks/useProducts";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { product, products, loading, error } = useProduct(id);
  const { addItem, setIsOpen } = useCart();
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSaving, setReviewSaving] = useState(false);

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
  const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId);
  const availableStock = selectedVariant?.stock ?? product.stock;
  const unitPrice = product.price + (selectedVariant?.priceAdjustment ?? 0);

  const related = products
    .filter((p) => p.id !== product.id && (p.room === product.room || p.category === product.category))
    .slice(0, 4);

  const handleAdd = () => {
    addItem(product, quantity, selectedVariant);
    setIsOpen(true);
  };

  const submitReview = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) {
      setReviewError("Sign in to review this product");
      return;
    }
    setReviewSaving(true);
    setReviewError("");
    try {
      await api.createReview(product.id, { rating: reviewRating, comment: reviewComment }, token);
      setReviewComment("");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", product.id] });
    } catch (requestError) {
      setReviewError(requestError instanceof Error ? requestError.message : "Could not save review");
    } finally {
      setReviewSaving(false);
    }
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
              ${unitPrice.toLocaleString()}
            </p>
            <div className="mt-3 flex items-center gap-2 font-body text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span>{product.reviewCount ? `${product.ratingAverage.toFixed(1)} from ${product.reviewCount} review${product.reviewCount === 1 ? "" : "s"}` : "No reviews yet"}</span>
            </div>

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

            {product.variants.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-lg font-medium text-foreground mb-3">Options</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => { setSelectedVariantId(""); setQuantity(1); }}
                    className={`border rounded-sm p-3 text-left font-body text-sm ${selectedVariantId === "" ? "border-primary bg-secondary" : "bg-background"}`}
                  >
                    <span className="block font-medium">Original</span>
                    <span className="text-muted-foreground">${product.price.toLocaleString()} - {product.stock} in stock</span>
                  </button>
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => { setSelectedVariantId(variant.id); setQuantity(1); }}
                      className={`border rounded-sm p-3 text-left font-body text-sm ${selectedVariantId === variant.id ? "border-primary bg-secondary" : "bg-background"}`}
                    >
                      <span className="block font-medium">{variant.name}</span>
                      <span className="text-muted-foreground">
                        ${(product.price + variant.priceAdjustment).toLocaleString()} - {variant.stock} in stock
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                    onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                    className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-secondary transition-colors"
                    aria-label="Increase quantity"
                    disabled={availableStock === 0}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <button
                onClick={handleAdd}
                disabled={availableStock === 0}
                className="w-full py-4 bg-primary text-primary-foreground font-body text-sm font-medium tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 disabled:bg-muted disabled:text-muted-foreground"
              >
                <ShoppingBag className="w-4 h-4" />
                {availableStock === 0 ? "Out of stock" : `Add to cart - $${(unitPrice * quantity).toLocaleString()}`}
              </button>
            </div>
          </motion.div>
        </section>

        <section className="container pb-16 grid lg:grid-cols-[360px_1fr] gap-10">
          <form onSubmit={submitReview} className="border bg-card rounded-sm p-5 h-fit">
            <h2 className="font-display text-2xl font-semibold">Review this product</h2>
            <label className="block mt-4 font-body text-sm">
              Rating
              <select value={reviewRating} onChange={(event) => setReviewRating(Number(event.target.value))} className="mt-1 w-full border bg-background rounded-sm px-3 py-2">
                {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
              </select>
            </label>
            <label className="block mt-4 font-body text-sm">
              Comment
              <textarea required minLength={5} value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} className="mt-1 w-full min-h-28 border bg-background rounded-sm px-3 py-2" />
            </label>
            {reviewError && <p className="mt-3 font-body text-sm text-destructive">{reviewError}</p>}
            <button disabled={reviewSaving || !user} className="mt-4 w-full py-3 bg-primary text-primary-foreground rounded-sm font-body disabled:opacity-60">
              {!user ? "Sign in to review" : reviewSaving ? "Saving..." : "Save review"}
            </button>
          </form>
          <div>
            <h2 className="font-display text-2xl font-semibold">Customer reviews</h2>
            {product.reviews.length === 0 && <p className="mt-4 font-body text-muted-foreground">No reviews yet.</p>}
            <div className="mt-5 space-y-4">
              {product.reviews.map((review) => (
                <article key={review.id || `${review.user}-${review.createdAt}`} className="border rounded-sm p-4 bg-card">
                  <div className="flex items-center justify-between gap-4">
                    <strong className="font-body">{review.name}</strong>
                    <span className="font-body text-sm text-accent">{review.rating}/5 stars</span>
                  </div>
                  <p className="font-body text-sm text-muted-foreground mt-2">{review.comment}</p>
                </article>
              ))}
            </div>
          </div>
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
