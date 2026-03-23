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
    id: "PROP-001",
    name: "Luxury 5-Bedroom Detached Duplex",
    location: "Maitama",
    district: "Abuja - Maitama",
    price: 1500000000, // ₦1.5B – typical high-end Maitama
    type: "Duplex",
    image:
      "https://images.nigeriapropertycentre.com/properties/images/3244455/06938386b8bfb9-luxury-spacious-5bedroom-fully-detached-unit-detached-duplexes-for-sale-maitama-district-abuja.jpg",
    roiPercent: 6.8,
    description:
      "Tastefully finished 5-bedroom detached duplex with BQ, swimming pool, modern kitchen, and smart home features in the heart of Maitama. Ideal for high-net-worth individuals or diplomats.",
    beds: 5,
    ownership: "Direct Purchase",
  },
  {
    id: "PROP-002",
    name: "Prime 1200sqm Residential Land",
    location: "Katampe District",
    district: "Abuja - Katampe",
    price: 180000000, // ₦180M – fast-growing luxury area
    type: "Land",
    image:
      "https://images.nigeriapropertycentre.com/properties/images/2956133/06866ad2b675c0-5000sqm-of-residential-land-at-katampe-mainby-bond-hotelfct-abuja-ni-residential-land-for-sale-katampe-district-abuja.jpeg",
    roiPercent: 11.2,
    description:
      "Prime 1200sqm plot of land in a developing highbrow area of Katampe Extension. Excellent appreciation potential due to proximity to Maitama and ongoing infrastructure.",
    ownership: "Direct Purchase",
  },
  {
    id: "PROP-003",
    name: "Modern 4-Bedroom Terrace Duplex",
    location: "Gwarinpa",
    district: "Abuja - Gwarinpa",
    price: 220000000,
    type: "Terrace",
    image:
      "https://images.nigeriapropertycentre.com/properties/images/3371989/069a86f9a19c5d-luxury-4-bedroom-terrace-duplex-terraced-duplexes-for-sale-gwarinpa-abuja.jpg",
    roiPercent: 8.5,
    description:
      "Brand new 4-bedroom terrace duplex with fitted kitchen, spacious living area, and good road access in a secure estate in Gwarinpa. Great for families and rental yield.",
    beds: 4,
    ownership: "JV Partnership",
  },
  {
    id: "PROP-004",
    name: "Elegant 3-Bedroom Flat",
    location: "Jabi",
    district: "Abuja - Jabi",
    price: 95000000,
    type: "Flat",
    image:
      "https://images.nigeriapropertycentre.com/properties/images/3362587/069a0afba0ec23-newly-built-3-bedroom-block-of-flat-for-rent-jabi-abuja.jpg",
    roiPercent: 9.1,
    description:
      "Spacious 3-bedroom apartment in a serviced estate with 24/7 security, gym, and swimming pool. Close to Jabi Lake Mall and Lakeview.",
    beds: 3,
    ownership: "Direct Purchase",
  },
  {
    id: "PROP-005",
    name: "Exclusive 1000sqm Land in Diplomatic Zone",
    location: "Asokoro",
    district: "Abuja - Asokoro",
    price: 650000000,
    type: "Land",
    image:
      "https://images.propertypro.ng/large/residential-land-measuring-1005sqm-2ciJVo6DdI6H7ZTeckkK.jpg",
    roiPercent: 5.4,
    description:
      "Large 1000sqm residential land in one of Abuja's most prestigious districts. Perfect for building a luxury villa or embassy residence.",
    ownership: "Direct Purchase",
  },
  {
    id: "PROP-006",
    name: "Newly Built 4-Bedroom Semi-Detached Duplex",
    location: "Lokogoma",
    district: "Abuja - Lokogoma",
    price: 320000000,
    type: "Duplex",
    image:
      "https://images.nigeriapropertycentre.com/properties/images/2816457/067fa6bb6ca829-4-bedroom-semi-detached-duplex-bq-semi-detached-duplexes-for-sale-lokogoma-district-abuja.jpeg",
    roiPercent: 7.9,
    description:
      "Contemporary 4-bedroom semi-detached duplex with modern finishes, ample parking, and green surroundings in fast-rising Lokogoma.",
    beds: 4,
    ownership: "JV Partnership",
  },
  {
    id: "PROP-007",
    name: "Affordable 500sqm Plot",
    location: "Lugbe",
    district: "Abuja - Lugbe",
    price: 25000000,
    type: "Land",
    image:
      "https://images.nigeriapropertycentre.com/properties/images/3389439/069b5c8ce4f163-well-located-1000sqm-plot-residential-land-for-sale-lugbe-district-abuja.jpg",
    roiPercent: 12.3,
    description:
      "Well-located 500sqm residential plot in Lugbe with good access roads. High potential for quick appreciation as the area develops.",
    ownership: "Direct Purchase",
  },
  {
    id: "PROP-008",
    name: "Luxury 5-Bedroom Terrace in Estate",
    location: "Guzape",
    district: "Abuja - Guzape",
    price: 480000000,
    type: "Terrace",
    image:
      "https://images.nigeriapropertycentre.com/properties/images/3318813/0697c7b0bf3711-luxury-and-exquisite-5-bedroom-detached-duplex-with-bq-detached-duplexes-for-sale-guzape-district-abuja.jpg",
    roiPercent: 7.2,
    description:
      "Elegant 5-bedroom terraced house in a gated estate in Guzape with top-notch security and proximity to Aso Rock area.",
    beds: 5,
    ownership: "Direct Purchase",
  },
  {
    id: "PROP-009",
    name: "Serviced 2-Bedroom Flat",
    location: "Wuse 2",
    district: "Abuja - Wuse",
    price: 85000000,
    type: "Flat",
    image:
      "https://images.nigeriapropertycentre.com/properties/images/3374117/069a9b7e5d808b-luxury-2bedroom-apartment-for-sale-wuse-2-abuja.jpg",
    roiPercent: 9.8,
    description:
      "Neat 2-bedroom flat in a prime Wuse 2 location, close to shopping malls, restaurants, and offices. Excellent rental demand.",
    beds: 2,
    ownership: "JV Partnership",
  },
  {
    id: "PROP-010",
    name: "Executive 6-Bedroom Detached Duplex + BQ",
    location: "Jahi",
    district: "Abuja - Jahi",
    price: 450000000,
    type: "Duplex",
    image:
      "https://images.nigeriapropertycentre.com/properties/images/3008530/0688b9ea385184-luxury-finished-6-bedroom-fully-detached-duplex-with-3-rooms-bq-availa-detached-duplexes-for-sale-guzape-district-abuja.jpeg",
    roiPercent: 8.0,
    description:
      "Spacious 6-bedroom fully detached duplex with boys' quarters, cinema room, and large compound in emerging luxury district Jahi.",
    beds: 6,
    ownership: "Direct Purchase",
  },
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
