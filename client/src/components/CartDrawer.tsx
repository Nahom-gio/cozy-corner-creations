import { Link } from "react-router-dom";
import { X, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md bg-background flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Your Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="font-body text-muted-foreground">Your cart is empty.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto mt-6 space-y-6 pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-sm bg-card" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-sm font-medium text-foreground truncate">{item.name}</h4>
                    <p className="font-body text-sm text-muted-foreground">${item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-secondary transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-body text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-secondary transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="self-start p-1 hover:bg-secondary rounded transition-colors">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t pt-6 mt-4 space-y-4">
              <div className="flex items-center justify-between font-body">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-lg font-semibold text-foreground">${totalPrice.toLocaleString()}</span>
              </div>
              <Link
                to="/checkout"
                onClick={() => setIsOpen(false)}
                className="block text-center w-full py-3 bg-primary text-primary-foreground font-body text-sm font-medium tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
