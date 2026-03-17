const StoreFooter = () => (
  <footer className="border-t bg-card">
    <div className="container py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <span className="font-display text-xl font-semibold text-foreground">Maison</span>
        <p className="font-body text-sm text-muted-foreground mt-1">Timeless furniture, thoughtfully made.</p>
      </div>
      <div className="flex gap-6 font-body text-sm text-muted-foreground">
        <a href="#" className="hover:text-foreground transition-colors">About</a>
        <a href="#" className="hover:text-foreground transition-colors">Shipping</a>
        <a href="#" className="hover:text-foreground transition-colors">Returns</a>
        <a href="#" className="hover:text-foreground transition-colors">Contact</a>
      </div>
    </div>
  </footer>
);

export default StoreFooter;
