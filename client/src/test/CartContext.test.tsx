import { act, render, screen } from "@testing-library/react";
import { CartProvider, useCart } from "@/context/CartContext";

const product = {
  id: "chair-1",
  name: "Chair",
  price: 250,
  stock: 10,
  category: "Seating",
  room: "Living",
  image: "/chair.jpg",
  images: ["/chair.jpg"],
  description: "A comfortable chair.",
  material: "Solid oak and linen",
  origin: "Crafted in Denmark",
  shipping: "2-3 weeks",
  warranty: "10 years",
};

const CartHarness = () => {
  const { addItem, totalItems, totalPrice } = useCart();
  return (
    <>
      <span>Items: {totalItems}</span>
      <span>Total: {totalPrice}</span>
      <button onClick={() => addItem(product, 3)}>Add chairs</button>
    </>
  );
};

describe("CartProvider", () => {
  beforeEach(() => localStorage.clear());

  it("adds quantities and persists the cart in localStorage", () => {
    render(<CartProvider><CartHarness /></CartProvider>);

    act(() => screen.getByRole("button", { name: "Add chairs" }).click());

    expect(screen.getByText("Items: 3")).toBeInTheDocument();
    expect(screen.getByText("Total: 750")).toBeInTheDocument();
    expect(localStorage.getItem("ethio-cart")).toContain('"quantity":3');
  });
});
