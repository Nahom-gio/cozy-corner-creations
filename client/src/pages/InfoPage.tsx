import StoreHeader from "@/components/StoreHeader";
import CartDrawer from "@/components/CartDrawer";
import StoreFooter from "@/components/StoreFooter";
import { Link, useLocation } from "react-router-dom";

const infoPages: Record<string, { title: string; content: string }> = {
  "/about": {
    title: "About Ethio",
    content:
      "Ethio was founded with a simple belief: your home should reflect who you are. We curate timeless, high-quality furniture from artisans and workshops around the world. Every piece is chosen for its craftsmanship, materiality, and enduring design. We believe in furniture that lasts - both in quality and style.",
  },
  "/shipping": {
    title: "Shipping & Delivery",
    content:
      "We offer free white-glove delivery on all orders over $500. Standard delivery takes 2-4 weeks depending on your location and stock availability. All items are carefully packaged and delivered to your room of choice. We'll even remove the packaging for you.",
  },
  "/returns": {
    title: "Returns & Exchanges",
    content:
      "We want you to love every piece. If something doesn't feel right, you can return it within 30 days of delivery for a full refund. Items must be in original condition. Contact our team to arrange a pickup - we handle the rest.",
  },
  "/contact": {
    title: "Contact Us",
    content:
      "Have a question or need styling advice? We'd love to hear from you.\n\nEmail: hello@ethio.store\nPhone: +1 (555) 012-3456\nHours: Mon-Fri, 9am-6pm EST\n\nVisit our showroom at 142 Warren Street, New York, NY 10007.",
  },
};

const InfoPage = () => {
  const { pathname } = useLocation();
  const page = infoPages[pathname];

  if (!page) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      <main className="flex-1 container py-16 md:py-24 max-w-2xl">
        <Link to="/" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
          Back to Home
        </Link>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mt-6">{page.title}</h1>
        <div className="font-body text-foreground/80 mt-6 leading-relaxed whitespace-pre-line text-lg">
          {page.content}
        </div>
      </main>
      <CartDrawer />
      <StoreFooter />
    </div>
  );
};

export default InfoPage;
