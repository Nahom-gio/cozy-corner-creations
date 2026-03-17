import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

const StoreHeader = () => {
  const { totalItems, setIsOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <a href="/" className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
          Maison
        </a>
        <nav className="hidden md:flex items-center gap-8 font-body text-sm tracking-wide text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Living</a>
          <a href="#" className="hover:text-foreground transition-colors">Dining</a>
          <a href="#" className="hover:text-foreground transition-colors">Bedroom</a>
          <a href="#" className="hover:text-foreground transition-colors">Lighting</a>
        </nav>
        <button
          onClick={() => setIsOpen(true)}
          className="relative p-2 hover:bg-secondary rounded-full transition-colors"
          aria-label="Open cart"
        >
          <ShoppingBag className="w-5 h-5 text-foreground" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-body font-semibold">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default StoreHeader;
