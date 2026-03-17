import StoreHeader from "@/components/StoreHeader";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import CartDrawer from "@/components/CartDrawer";
import StoreFooter from "@/components/StoreFooter";

const Index = () => (
  <div className="min-h-screen flex flex-col">
    <StoreHeader />
    <main className="flex-1">
      <HeroSection />
      <ProductGrid />
    </main>
    <CartDrawer />
    <StoreFooter />
  </div>
);

export default Index;
