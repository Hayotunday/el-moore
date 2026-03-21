export interface Property {
  id: string;
  name: string;
  location: string;
  district: string;
  price: number;
  type: "Land" | "Terrace" | "Duplex" | "Flat";
  image: string;
  roiPercent: number;
  description: string;
  beds?: number;
  ownership: "JV Partnership" | "Direct Purchase";
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
}

export const properties: Property[] = [
  {
    id: "1",
    name: "The Emerald Heights",
    location: "Guzape District, Abuja",
    district: "Abuja - Central",
    price: 1250000,
    type: "Duplex",
    image: "assets/property-1.jpg",
    roiPercent: 18.5,
    description: "5 Bedroom Detached with Smart Home Integration",
    beds: 5,
    ownership: "Direct Purchase",
  },
  {
    id: "2",
    name: "Heritage Acres",
    location: "Idu Industrial Layout, Abuja",
    district: "Abuja - Central",
    price: 450000,
    type: "Land",
    image: "assets/property-2.jpg",
    roiPercent: 22,
    description: "2,500 SQM Prime Commercial Titled Land",
    ownership: "JV Partnership",
  },
  {
    id: "3",
    name: "Vellum Terraces",
    location: "Wuye Eco-District, Abuja",
    district: "Abuja - Maitama",
    price: 680000,
    type: "Terrace",
    image: "assets/property-3.jpg",
    roiPercent: 14.2,
    description: "4 Bedroom Modern Terrace with Rooftop Garden",
    beds: 4,
    ownership: "Direct Purchase",
  },
  {
    id: "4",
    name: "Azure Suites",
    location: "Katampe Extension, Abuja",
    district: "Abuja - Maitama",
    price: 320000,
    type: "Flat",
    image: "assets/property-4.jpg",
    roiPercent: 12,
    description: "Luxury 2 Bedroom Serviced Apartments",
    beds: 2,
    ownership: "Direct Purchase",
  },
];

export const articles: Article[] = [
  {
    id: "1",
    title: "Urban Density vs. Remote Luxury: The 2025 Shift",
    excerpt:
      "Exploration of post-digital migration patterns and their impact on high-end property valuation.",
    category: "Market Insights",
    readTime: "8 min read",
    image: "assets/property-1.jpg",
  },
  {
    id: "2",
    title: "Commercial to Residential: Conversion Opportunities",
    excerpt:
      "Identifying underperforming commercial assets prime for high-yield luxury residential conversion.",
    category: "Market Insights",
    readTime: "12 min read",
    image: "assets/property-3.jpg",
  },
  {
    id: "3",
    title: "Interest Rate Hedges for the Modern Landlord",
    excerpt:
      "Protecting your portfolio's cash flow in a volatile macroeconomic environment.",
    category: "Strategy",
    readTime: "6 min read",
    image: "assets/property-4.jpg",
  },
];

export const teamMembers = [
  {
    name: "Marcus El-Moore",
    role: "Principal Partner",
    bio: "Former Director of Capital Markets at V-Invest with a focus on luxury urban planning.",
  },
  {
    name: "Sarah Adeyemi",
    role: "Director of Investment",
    bio: "Specializing in high-yield commercial portfolios and legal risk mitigation.",
  },
  {
    name: "Julian Vane",
    role: "Head of Acquisition",
    bio: "Identifying emerging markets through proprietary data-driven forecasting.",
  },
  {
    name: "Dr. Elena Thorne",
    role: "General Counsel",
    bio: "Expert in title perfection and land governance across international jurisdictions.",
  },
];
