import armchairOlive from "@/assets/products/armchair-olive.jpg";
import diningTable from "@/assets/products/dining-table.jpg";
import sofaTerracotta from "@/assets/products/sofa-terracotta.jpg";
import nightstand from "@/assets/products/nightstand.jpg";
import pendantLamp from "@/assets/products/pendant-lamp.jpg";
import coffeeTable from "@/assets/products/coffee-table.jpg";
import bookshelf from "@/assets/products/bookshelf.jpg";
import bedLinen from "@/assets/products/bed-linen.jpg";
import dresser from "@/assets/products/dresser.jpg";
import floorLamp from "@/assets/products/floor-lamp.jpg";
import diningChair from "@/assets/products/dining-chair.jpg";
import tvConsole from "@/assets/products/tv-console.jpg";
import tableLamp from "@/assets/products/table-lamp.jpg";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  room: string;
  image: string;
  description: string;
};

export const categories = ["All", "Seating", "Tables", "Storage", "Lighting"];

export const rooms = ["Living", "Dining", "Bedroom", "Lighting"] as const;
export type Room = (typeof rooms)[number];

export const roomDescriptions: Record<Room, { title: string; subtitle: string }> = {
  Living: { title: "Living Room", subtitle: "Sofas, armchairs, coffee tables, and everything to make your living space feel like home." },
  Dining: { title: "Dining Room", subtitle: "Tables, chairs, and storage to create the perfect gathering place." },
  Bedroom: { title: "Bedroom", subtitle: "Beds, nightstands, dressers, and lighting for your personal retreat." },
  Lighting: { title: "Lighting", subtitle: "Pendants, floor lamps, and table lamps to set the perfect mood." },
};

export const products: Product[] = [
  {
    id: "1",
    name: "Vesper Armchair",
    price: 1290,
    category: "Seating",
    room: "Living",
    image: armchairOlive,
    description: "Mid-century velvet armchair in olive green with walnut legs.",
  },
  {
    id: "2",
    name: "Norra Dining Table",
    price: 2450,
    category: "Tables",
    room: "Dining",
    image: diningTable,
    description: "Solid oak dining table with Scandinavian-inspired splayed legs.",
  },
  {
    id: "3",
    name: "Terracotta Linen Sofa",
    price: 3200,
    category: "Seating",
    room: "Living",
    image: sofaTerracotta,
    description: "Three-seater sofa in warm terracotta linen with metal legs.",
  },
  {
    id: "4",
    name: "Walnut Nightstand",
    price: 680,
    category: "Storage",
    room: "Bedroom",
    image: nightstand,
    description: "Walnut bedside table with brass handle and tapered legs.",
  },
  {
    id: "5",
    name: "Linen Pendant Lamp",
    price: 420,
    category: "Lighting",
    room: "Lighting",
    image: pendantLamp,
    description: "Brushed brass pendant with a natural linen drum shade.",
  },
  {
    id: "6",
    name: "Marble Coffee Table",
    price: 1850,
    category: "Tables",
    room: "Living",
    image: coffeeTable,
    description: "Round Carrara marble top with gold-finished cross base.",
  },
  {
    id: "7",
    name: "Oak Bookshelf",
    price: 1450,
    category: "Storage",
    room: "Living",
    image: bookshelf,
    description: "Mid-century oak bookshelf with drawers and open compartments.",
  },
  {
    id: "8",
    name: "Linen Upholstered Bed",
    price: 2800,
    category: "Seating",
    room: "Bedroom",
    image: bedLinen,
    description: "King-size bed with tufted linen headboard and walnut legs.",
  },
  {
    id: "9",
    name: "Walnut Dresser",
    price: 1950,
    category: "Storage",
    room: "Bedroom",
    image: dresser,
    description: "Six-drawer walnut dresser with brass pulls and splayed legs.",
  },
  {
    id: "10",
    name: "Brass Floor Lamp",
    price: 560,
    category: "Lighting",
    room: "Lighting",
    image: floorLamp,
    description: "Elegant brass floor lamp with white linen tapered shade.",
  },
  {
    id: "11",
    name: "Bouclé Dining Chair",
    price: 480,
    category: "Seating",
    room: "Dining",
    image: diningChair,
    description: "Cream bouclé dining chair with solid oak splayed legs.",
  },
  {
    id: "12",
    name: "Oak TV Console",
    price: 1680,
    category: "Storage",
    room: "Living",
    image: tvConsole,
    description: "Natural oak media console with sliding doors and open shelf.",
  },
  {
    id: "13",
    name: "Sage Ceramic Table Lamp",
    price: 320,
    category: "Lighting",
    room: "Lighting",
    image: tableLamp,
    description: "Sage green ceramic table lamp with natural linen shade.",
  },
];
