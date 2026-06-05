import { Link } from "react-router-dom";

const StoreFooter = () => (
  <footer className="border-t bg-card">
    <div className="container py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <span className="font-display text-xl font-semibold text-foreground">Ethio</span>
        <p className="font-body text-sm text-muted-foreground mt-1">Timeless furniture, thoughtfully made.</p>
      </div>
      <div className="flex gap-6 font-body text-sm text-muted-foreground">
        <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
        <Link to="/shipping" className="hover:text-foreground transition-colors">Shipping</Link>
        <Link to="/returns" className="hover:text-foreground transition-colors">Returns</Link>
        <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
        <Link to="/admin" className="hover:text-foreground transition-colors">Admin</Link>
      </div>
    </div>
  </footer>
);

export default StoreFooter;
