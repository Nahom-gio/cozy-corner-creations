import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
const Index = lazy(() => import("./pages/Index.tsx"));
const CategoryPage = lazy(() => import("./pages/CategoryPage.tsx"));
const InfoPage = lazy(() => import("./pages/InfoPage.tsx"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage.tsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.tsx"));
const AuthPage = lazy(() => import("./pages/AuthPage.tsx"));
const AccountPage = lazy(() => import("./pages/AccountPage.tsx"));
const SearchPage = lazy(() => import("./pages/SearchPage.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<p className="container py-16 font-body text-muted-foreground">Loading...</p>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/category/:room" element={<CategoryPage />} />
              <Route path="/about" element={<InfoPage />} />
              <Route path="/shipping" element={<InfoPage />} />
              <Route path="/returns" element={<InfoPage />} />
              <Route path="/contact" element={<InfoPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
