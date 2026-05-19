import { Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();

  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-square overflow-hidden rounded-sm bg-card">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <button
          onClick={() => addItem(product)}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110"
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-3">
        <p className="font-body text-xs tracking-wider uppercase text-muted-foreground">{product.category}</p>
        <h3 className="font-display text-lg font-medium text-foreground mt-0.5">{product.name}</h3>
        <p className="font-body text-sm text-foreground mt-1">${product.price.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ProductCard;
