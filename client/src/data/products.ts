export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  room: string;
  image: string;
  images: string[];
  description: string;
  material: string;
  origin: string;
  shipping: string;
  warranty: string;
};

export const categories = ["All", "Seating", "Tables", "Storage", "Lighting"];

export const rooms = ["Living", "Dining", "Bedroom", "Lighting"] as const;
export type Room = (typeof rooms)[number];

export const roomDescriptions: Record<Room, { title: string; subtitle: string }> = {
  Living: {
    title: "Living Room",
    subtitle: "Sofas, armchairs, coffee tables, and everything to make your living space feel like home.",
  },
  Dining: {
    title: "Dining Room",
    subtitle: "Tables, chairs, and storage to create the perfect gathering place.",
  },
  Bedroom: {
    title: "Bedroom",
    subtitle: "Beds, nightstands, dressers, and lighting for your personal retreat.",
  },
  Lighting: {
    title: "Lighting",
    subtitle: "Pendants, floor lamps, and table lamps to set the perfect mood.",
  },
};
