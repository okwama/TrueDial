import watch1 from "@/assets/watches/watch-1.jpg";
import watch2 from "@/assets/watches/watch-2.jpg";
import watch3 from "@/assets/watches/watch-3.jpg";
import watch4 from "@/assets/watches/watch-4.jpg";
import watch5 from "@/assets/watches/watch-5.jpg";
import watch6 from "@/assets/watches/watch-6.jpg";

export type WatchCondition = "New" | "Excellent" | "Very Good" | "Good";

export interface Watch {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number; // in KES
  condition: WatchCondition;
  movement: "Automatic" | "Quartz";
  image: string;
  description: string;
  sold?: boolean;
}

export const watches: Watch[] = [
  {
    id: "1",
    name: "Seiko 5 Automatic",
    brand: "Seiko",
    model: "SNXS79",
    price: 18500,
    condition: "Excellent",
    movement: "Automatic",
    image: watch1,
    description: "Classic Seiko 5 with black sunburst dial. Stainless steel case and bracelet. 37mm case diameter.",
  },
  {
    id: "2",
    name: "Orient Bambino",
    brand: "Orient",
    model: "Bambino V4",
    price: 24500,
    condition: "New",
    movement: "Automatic",
    image: watch2,
    description: "Elegant dress watch with rose gold case and cream dial. 40.5mm case diameter. Includes box and papers.",
  },
  {
    id: "3",
    name: "Citizen Eco-Drive",
    brand: "Citizen",
    model: "BM7251-53A",
    price: 21000,
    condition: "Very Good",
    movement: "Quartz",
    image: watch3,
    description: "Solar-powered dress watch with white dial. Stainless steel case and bracelet. 40mm case diameter.",
  },
  {
    id: "4",
    name: "Casio MTP Blue",
    brand: "Casio",
    model: "MTP-1302D",
    price: 8500,
    condition: "New",
    movement: "Quartz",
    image: watch4,
    description: "Classic analog watch with stunning blue dial. Day-date display. Stainless steel bracelet.",
  },
  {
    id: "5",
    name: "Seiko SNXS Silver",
    brand: "Seiko",
    model: "SNXS73",
    price: 17500,
    condition: "Excellent",
    movement: "Automatic",
    image: watch5,
    description: "Seiko 5 with silver sunburst dial and day-date display. Compact 37mm case size.",
  },
  {
    id: "6",
    name: "Timex Marlin",
    brand: "Timex",
    model: "Marlin Hand-Wind",
    price: 22000,
    condition: "Good",
    movement: "Automatic",
    image: watch6,
    description: "Vintage-inspired hand-wind watch with champagne dial. Gold-tone case. 34mm classic size.",
  },
];