import armchairOlive from "@/assets/products/armchair-olive.jpg";
import diningTable from "@/assets/products/dining-table.jpg";
import sofaTerracotta from "@/assets/products/sofa-terracotta.jpg";
import nightstand from "@/assets/products/nightstand.jpg";
import pendantLamp from "@/assets/products/pendant-lamp.jpg";
import coffeeTable from "@/assets/products/coffee-table.jpg";
import bookshelf from "@/assets/products/bookshelf.jpg";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
};

export const categories = ["All", "Seating", "Tables", "Storage", "Lighting"];

export const products: Product[] = [
  {
    id: "1",
    name: "Vesper Armchair",
    price: 1290,
    category: "Seating",
    image: armchairOlive,
    description: "Mid-century velvet armchair in olive green with walnut legs.",
  },
  {
    id: "2",
    name: "Norra Dining Table",
    price: 2450,
    category: "Tables",
    image: diningTable,
    description: "Solid oak dining table with Scandinavian-inspired splayed legs.",
  },
  {
    id: "3",
    name: "Terracotta Linen Sofa",
    price: 3200,
    category: "Seating",
    image: sofaTerracotta,
    description: "Three-seater sofa in warm terracotta linen with metal legs.",
  },
  {
    id: "4",
    name: "Walnut Nightstand",
    price: 680,
    category: "Storage",
    image: nightstand,
    description: "Walnut bedside table with brass handle and tapered legs.",
  },
  {
    id: "5",
    name: "Linen Pendant Lamp",
    price: 420,
    category: "Lighting",
    image: pendantLamp,
    description: "Brushed brass pendant with a natural linen drum shade.",
  },
  {
    id: "6",
    name: "Marble Coffee Table",
    price: 1850,
    category: "Tables",
    image: coffeeTable,
    description: "Round Carrara marble top with gold-finished cross base.",
  },
  {
    id: "7",
    name: "Oak Bookshelf",
    price: 1450,
    category: "Storage",
    image: bookshelf,
    description: "Mid-century oak bookshelf with drawers and open compartments.",
  },
];
