import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";

const StoreHeader = () => {
  const { totalItems, setIsOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
          Maison
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-body text-sm tracking-wide text-muted-foreground">
          <Link to="/category/Living" className="hover:text-foreground transition-colors">Living</Link>
          <Link to="/category/Dining" className="hover:text-foreground transition-colors">Dining</Link>
          <Link to="/category/Bedroom" className="hover:text-foreground transition-colors">Bedroom</Link>
          <Link to="/category/Lighting" className="hover:text-foreground transition-colors">Lighting</Link>
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
