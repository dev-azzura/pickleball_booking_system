export type Court = {
  id: string;
  name: string;
  description: string;
  category: "Indoor" | "Outdoor";
  pricePerHour: number;
  location: string;
  amenities: string[];
  operatingHours: string;
  openingTime: string;
  closingTime: string;
  operatingDays?: number[];
  artwork: "indoor" | "outdoor" | "championship";
  image?: string;
  available: boolean;
};

export const courts: Court[] = [
  {
    id: "indoor-premium",
    name: "Indoor Premium Court",
    description: "A bright, climate-controlled court made for all-day play.",
    category: "Indoor",
    pricePerHour: 400,
    location: "Makati City",
    amenities: ["Air-conditioned", "Equipment rental", "Changing rooms"],
    operatingHours: "Daily, 6:00 AM - 10:00 PM",
    openingTime: "06:00",
    closingTime: "22:00",
    artwork: "indoor",
    image: "/img/indoor-1.png",
    available: true,
  },
  {
    id: "outdoor-standard",
    name: "Outdoor Standard Court",
    description: "Fresh air, open skies, and a great game with friends.",
    category: "Outdoor",
    pricePerHour: 250,
    location: "Quezon City",
    amenities: ["Open-air", "Parking", "Water station"],
    operatingHours: "Daily, 6:00 AM - 8:00 PM",
    openingTime: "06:00",
    closingTime: "20:00",
    artwork: "outdoor",
    image: "/img/outdoor-1.png",
    available: true,
  },
  {
    id: "championship",
    name: "Championship Court",
    description: "A tournament-ready surface for your most competitive match.",
    category: "Indoor",
    pricePerHour: 500,
    location: "Pasig City",
    amenities: ["Pro surface", "Spectator seating", "Equipment rental"],
    operatingHours: "Daily, 7:00 AM - 11:00 PM",
    openingTime: "07:00",
    closingTime: "23:00",
    artwork: "championship",
    image: "/img/indoor-2.png",
    available: false,
  },
  {
    id: "garden-court",
    name: "Garden Side Court",
    description: "A relaxed outdoor court surrounded by a leafy community space.",
    category: "Outdoor",
    pricePerHour: 300,
    location: "Taguig City",
    amenities: ["Open-air", "Parking", "Cafe nearby"],
    operatingHours: "Daily, 6:00 AM - 7:00 PM",
    openingTime: "06:00",
    closingTime: "19:00",
    artwork: "outdoor",
    image: "/img/outdoor-2.png",
    available: true,
  },
  {
    id: "clubhouse-court",
    name: "Clubhouse Court",
    description: "A comfortable indoor setup for practice, lessons, and doubles.",
    category: "Indoor",
    pricePerHour: 350,
    location: "Mandaluyong City",
    amenities: ["Air-conditioned", "Changing rooms", "Water station"],
    operatingHours: "Daily, 6:00 AM - 10:00 PM",
    openingTime: "06:00",
    closingTime: "22:00",
    artwork: "indoor",
    image: "/img/indoor-3.png",
    available: false,
  },
  {
    id: "sunset-court",
    name: "Sunset Rally Court",
    description: "An open-air favorite for golden-hour rallies and weekend games.",
    category: "Outdoor",
    pricePerHour: 275,
    location: "Paranaque City",
    amenities: ["Open-air", "Lighting", "Parking"],
    operatingHours: "Daily, 6:00 AM - 9:00 PM",
    openingTime: "06:00",
    closingTime: "21:00",
    artwork: "championship",
    image: "/img/outdoor-3.png",
    available: true,
  },
];

export const featuredCourts = courts.slice(0, 3);
