import { useState } from "react";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { products } from "@/data/products";

const navLinks = [
  { to: "/category/Living", label: "Living" },
  { to: "/category/Dining", label: "Dining" },
  { to: "/category/Bedroom", label: "Bedroom" },
  { to: "/category/Lighting", label: "Lighting" },
];

const StoreHeader = () => {
  const { totalItems, setIsOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = query.trim()
    ? products
        .filter((p) =>
          (p.name + " " + p.category + " " + p.room + " " + p.description)
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
        .slice(0, 6)
    : [];

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 -ml-2 hover:bg-secondary rounded-full transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <Link to="/" className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Maison
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-body text-sm tracking-wide text-muted-foreground">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-foreground" />
          </button>
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
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/30 animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 left-0 bottom-0 w-72 bg-background shadow-xl animate-slide-in-right p-6 flex flex-col" style={{ animation: "slide-in-right 0.3s ease-out reverse" }}>
            <div className="flex items-center justify-between mb-8">
              <span className="font-display text-2xl font-semibold">Maison</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-secondary rounded-full" aria-label="Close menu">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 font-body">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 px-2 text-lg text-foreground hover:bg-secondary rounded-md transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              <div className="border-t my-4" />
              {[
                { to: "/about", label: "About" },
                { to: "/shipping", label: "Shipping" },
                { to: "/returns", label: "Returns" },
                { to: "/contact", label: "Contact" },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="py-2 px-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 animate-fade-in">
          <div className="absolute inset-0 bg-foreground/40" onClick={closeSearch} />
          <div className="relative bg-background border-b shadow-lg">
            <div className="container py-4 flex items-center gap-3">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search furniture, lighting, rooms…"
                className="flex-1 bg-transparent outline-none font-body text-lg placeholder:text-muted-foreground"
              />
              <button onClick={closeSearch} className="p-2 hover:bg-secondary rounded-full" aria-label="Close search">
                <X className="w-5 h-5" />
              </button>
            </div>
            {query && (
              <div className="container pb-6 max-h-[60vh] overflow-y-auto">
                {results.length === 0 ? (
                  <p className="font-body text-muted-foreground py-6 text-center">No products match "{query}".</p>
                ) : (
                  <ul className="divide-y">
                    {results.map((p) => (
                      <li key={p.id}>
                        <button
                          onClick={() => {
                            navigate(`/product/${p.id}`);
                            closeSearch();
                          }}
                          className="flex items-center gap-4 w-full py-3 text-left hover:bg-secondary/50 px-2 rounded-md transition-colors"
                        >
                          <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded-sm bg-card" />
                          <div className="flex-1 min-w-0">
                            <p className="font-display text-base text-foreground truncate">{p.name}</p>
                            <p className="font-body text-xs text-muted-foreground uppercase tracking-wide">{p.category} · {p.room}</p>
                          </div>
                          <span className="font-body text-sm text-foreground">${p.price.toLocaleString()}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default StoreHeader;
