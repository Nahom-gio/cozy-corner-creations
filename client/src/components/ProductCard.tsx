import { Heart, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const { user, toggleWishlist } = useAuth();
  const isFavorite = user?.wishlist.includes(product.id);

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-sm bg-card">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              if (product.stock === 0) return;
              addItem(product);
              toast.success(`${product.name} added to your cart`);
            }}
            disabled={product.stock === 0}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 disabled:bg-muted disabled:text-muted-foreground"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={async (e) => {
              e.preventDefault();
              try {
                await toggleWishlist(product.id);
                toast.success(isFavorite ? "Removed from favorites" : "Saved to favorites");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Could not update favorites");
              }
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/85 backdrop-blur flex items-center justify-center transition-colors hover:bg-background"
            aria-label={isFavorite ? `Remove ${product.name} from favorites` : `Save ${product.name} to favorites`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-primary text-primary" : "text-foreground"}`} />
          </button>
        </div>
        <div className="mt-3">
          <p className="font-body text-xs tracking-wider uppercase text-muted-foreground">{product.category}</p>
          <h3 className="font-display text-lg font-medium text-foreground mt-0.5">{product.name}</h3>
          <p className="font-body text-sm text-foreground mt-1">${product.price.toLocaleString()}</p>
          <p className={`font-body text-xs mt-1 ${product.stock > 0 ? "text-accent" : "text-destructive"}`}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
