import type { Equipment, EquipmentCategory } from "@/types/equipment";

const owners = {
  arjun: {
    name: "Arjun Mehta",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    verified: true,
    rating: 4.9,
    reviewCount: 47,
    memberSince: "2024",
  },
  priya: {
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    verified: true,
    rating: 4.8,
    reviewCount: 32,
    memberSince: "2024",
  },
  rahul: {
    name: "Rahul Kapoor",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    verified: true,
    rating: 5.0,
    reviewCount: 28,
    memberSince: "2023",
  },
  sneha: {
    name: "Sneha Reddy",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    verified: true,
    rating: 4.7,
    reviewCount: 19,
    memberSince: "2024",
  },
};

export const equipmentList: Equipment[] = [
  {
    id: "1",
    slug: "sony-a7s-iii",
    name: "Sony A7S III",
    category: "camera",
    description:
      "Professional full-frame mirrorless camera perfect for filmmaking and low-light photography. Includes 2 batteries, charger, and 128GB CFexpress card.",
    pricePerDay: 3500,
    city: "Mumbai",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&h=800&fit=crop",
    ],
    rating: 4.9,
    reviewCount: 24,
    owner: owners.arjun,
    specifications: {
      Sensor: "12.1MP Full-Frame",
      "Video": "4K 120fps",
      "ISO Range": "80-102400",
      "Mount": "Sony E",
      Weight: "614g",
    },
    featured: true,
    popular: true,
    createdAt: "2025-11-01",
  },
  {
    id: "2",
    slug: "canon-r5-cinema",
    name: "Canon EOS R5 Cinema Kit",
    category: "camera",
    description:
      "8K cinema-ready setup with RF 24-70mm f/2.8 lens. Ideal for commercial shoots and documentary work.",
    pricePerDay: 4200,
    city: "Bangalore",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&h=800&fit=crop",
    ],
    rating: 4.8,
    reviewCount: 18,
    owner: owners.priya,
    specifications: {
      Sensor: "45MP Full-Frame",
      "Video": "8K RAW",
      "Lens": "RF 24-70mm f/2.8",
      "Mount": "Canon RF",
      Weight: "738g",
    },
    featured: true,
    popular: true,
    createdAt: "2025-10-15",
  },
  {
    id: "3",
    slug: "sigma-85mm-art",
    name: "Sigma 85mm f/1.4 DG DN Art",
    category: "lens",
    description:
      "Stunning portrait lens with creamy bokeh. Sony E mount. Includes lens hood and protective case.",
    pricePerDay: 800,
    city: "Delhi",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&h=800&fit=crop",
    ],
    rating: 4.9,
    reviewCount: 31,
    owner: owners.rahul,
    specifications: {
      "Focal Length": "85mm",
      Aperture: "f/1.4",
      Mount: "Sony E",
      "Filter Size": "77mm",
      Weight: "625g",
    },
    featured: true,
    createdAt: "2025-09-20",
  },
  {
    id: "4",
    slug: "dji-mavic-3-pro",
    name: "DJI Mavic 3 Pro",
    category: "drone",
    description:
      "Triple-camera drone with Hasselblad main sensor. Fly More combo with 3 batteries and ND filters.",
    pricePerDay: 2800,
    city: "Hyderabad",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&h=800&fit=crop",
    ],
    rating: 4.8,
    reviewCount: 15,
    owner: owners.sneha,
    specifications: {
      Camera: "Hasselblad 4/3 CMOS",
      "Flight Time": "43 min",
      "Max Range": "15 km",
      "Video": "5.1K 50fps",
      Weight: "958g",
    },
    featured: true,
    popular: true,
    createdAt: "2025-11-10",
  },
  {
    id: "5",
    slug: "aputure-600d-pro",
    name: "Aputure 600d Pro",
    category: "lighting",
    description:
      "Professional daylight LED with Bowens mount. Includes light stand, softbox, and wireless control.",
    pricePerDay: 1500,
    city: "Mumbai",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&h=800&fit=crop",
    ],
    rating: 4.7,
    reviewCount: 12,
    owner: owners.arjun,
    specifications: {
      Output: "600W equivalent",
      "Color Temp": "5600K",
      CRI: "96+",
      Mount: "Bowens",
      Weight: "7.5kg",
    },
    createdAt: "2025-08-05",
  },
  {
    id: "6",
    slug: "rode-ntg5-kit",
    name: "Rode NTG5 + Boom Kit",
    category: "audio",
    description:
      "Broadcast-grade shotgun mic with carbon fiber boom pole, shock mount, and XLR cable.",
    pricePerDay: 600,
    city: "Bangalore",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&h=800&fit=crop",
    ],
    rating: 4.6,
    reviewCount: 9,
    owner: owners.priya,
    specifications: {
      Pattern: "Supercardioid",
      "Frequency": "20Hz - 20kHz",
      "Self Noise": "10dB",
      Connector: "XLR",
      Weight: "76g",
    },
    createdAt: "2025-07-22",
  },
  {
    id: "7",
    slug: "dji-rs-4-pro",
    name: "DJI RS 4 Pro",
    category: "gimbal",
    description:
      "Professional 3-axis gimbal supporting up to 4.5kg. Includes focus motor and carrying case.",
    pricePerDay: 1200,
    city: "Chennai",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop",
    ],
    rating: 4.9,
    reviewCount: 21,
    owner: owners.rahul,
    specifications: {
      "Payload": "4.5kg",
      Battery: "12 hours",
      "Axis": "3-axis",
      Display: "1.8\" OLED",
      Weight: "1.4kg",
    },
    featured: true,
    createdAt: "2025-10-28",
  },
  {
    id: "8",
    slug: "red-komodo-6k",
    name: "RED Komodo 6K",
    category: "camera",
    description:
      "Compact cinema camera with global shutter. Includes Canon RF to PL mount adapter and 512GB media.",
    pricePerDay: 5500,
    city: "Mumbai",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&h=800&fit=crop",
    ],
    rating: 5.0,
    reviewCount: 8,
    owner: owners.sneha,
    specifications: {
      Sensor: "6K Super 35",
      "Global Shutter": "Yes",
      "Codec": "REDCODE RAW",
      Mount: "Canon RF",
      Weight: "1kg",
    },
    popular: true,
    createdAt: "2025-11-20",
  },
  {
    id: "9",
    slug: "canon-70-200-f28",
    name: "Canon RF 70-200mm f/2.8",
    category: "lens",
    description:
      "Professional telephoto zoom for sports and wildlife. Image stabilized with fast autofocus.",
    pricePerDay: 1100,
    city: "Pune",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&h=800&fit=crop",
    ],
    rating: 4.8,
    reviewCount: 14,
    owner: owners.arjun,
    specifications: {
      "Focal Length": "70-200mm",
      Aperture: "f/2.8",
      Mount: "Canon RF",
      IS: "5 stops",
      Weight: "1070g",
    },
    createdAt: "2025-09-01",
  },
  {
    id: "10",
    slug: "godox-ad600-pro",
    name: "Godox AD600 Pro",
    category: "lighting",
    description:
      "Portable studio strobe with 600Ws output. Includes wireless trigger and standard reflector.",
    pricePerDay: 900,
    city: "Delhi",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=800&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 7,
    owner: owners.priya,
    specifications: {
      Power: "600Ws",
      "Flash Duration": "1/220s",
      "Recycle Time": "0.01-2.5s",
      Mount: "Bowens",
      Weight: "3kg",
    },
    createdAt: "2025-06-15",
  },
  {
    id: "11",
    slug: "zoom-f6-recorder",
    name: "Zoom F6 Field Recorder",
    category: "audio",
    description:
      "32-bit float 6-channel recorder. Perfect for film production and podcast field recording.",
    pricePerDay: 750,
    city: "Bangalore",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&h=800&fit=crop",
    ],
    rating: 4.7,
    reviewCount: 11,
    owner: owners.rahul,
    specifications: {
      Channels: "6",
      "Bit Depth": "32-bit float",
      "Sample Rate": "192kHz",
      Inputs: "XLR/TRS",
      Weight: "520g",
    },
    createdAt: "2025-08-30",
  },
  {
    id: "12",
    slug: "dji-mini-4-pro",
    name: "DJI Mini 4 Pro",
    category: "drone",
    description:
      "Sub-250g drone with 4K HDR and omnidirectional obstacle sensing. Travel-friendly creator drone.",
    pricePerDay: 1200,
    city: "Goa",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&h=800&fit=crop",
    ],
    rating: 4.6,
    reviewCount: 16,
    owner: owners.sneha,
    specifications: {
      Weight: "249g",
      Camera: "1/1.3\" CMOS",
      "Flight Time": "34 min",
      "Video": "4K 60fps HDR",
      Range: "20 km",
    },
    createdAt: "2025-10-05",
  },
];

export const categoryLabels: Record<EquipmentCategory, string> = {
  camera: "Camera",
  lens: "Lens",
  drone: "Drone",
  lighting: "Lighting",
  audio: "Audio",
  gimbal: "Gimbal",
};

export const categoryIcons: Record<EquipmentCategory, string> = {
  camera: "Camera",
  lens: "Aperture",
  drone: "Plane",
  lighting: "Lightbulb",
  audio: "Mic",
  gimbal: "Move3d",
};

export function getEquipmentBySlug(slug: string): Equipment | undefined {
  return equipmentList.find((item) => item.slug === slug);
}

export function getFeaturedEquipment(): Equipment[] {
  return equipmentList.filter((item) => item.featured);
}

export function getEquipmentSlugs(): string[] {
  return equipmentList.map((item) => item.slug);
}

export const cities = [...new Set(equipmentList.map((item) => item.city))].sort();

export const faqItems = [
  {
    question: "What is Gearbox?",
    answer:
      "Gearbox is a peer-to-peer marketplace for renting professional camera equipment from trusted creators in your city. Access premium gear without the premium price tag.",
  },
  {
    question: "When will Gearbox launch?",
    answer:
      "We're launching city by city, starting with Mumbai and Bangalore. Join the waitlist to be notified when we go live in your area.",
  },
  {
    question: "How does renting work?",
    answer:
      "Browse equipment near you, send a rental request to the owner, meet to pick up the gear, create amazing content, and return it when done. Simple as that.",
  },
  {
    question: "Is the equipment insured?",
    answer:
      "Yes. All rentals through Gearbox include insurance coverage. Both owners and renters are protected throughout the rental period.",
  },
  {
    question: "Can I list my own equipment?",
    answer:
      "Absolutely! If you have professional gear sitting idle, you can earn passive income by listing it on Gearbox. Join the owner waitlist to get early access.",
  },
  {
    question: "How are owners verified?",
    answer:
      "Every owner goes through identity verification and equipment authentication. We ensure all gear meets professional standards before listing.",
  },
];

export const ownerFaqItems = [
  {
    question: "How much can I earn?",
    answer:
      "Owners typically earn ₹15,000–₹50,000 per month from idle gear, depending on equipment type and demand in their city.",
  },
  {
    question: "What about insurance?",
    answer:
      "Gearbox provides comprehensive insurance for every rental. Your equipment is protected from damage, theft, and loss.",
  },
  {
    question: "How do I get paid?",
    answer:
      "Payments are processed securely through Gearbox and deposited directly to your bank account after each completed rental.",
  },
  {
    question: "Can I choose who rents my gear?",
    answer:
      "Yes. You review each rental request and can accept or decline based on the renter's profile and reviews.",
  },
];

export const testimonials = [
  {
    name: "Vikram Singh",
    role: "Documentary Filmmaker",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    quote:
      "Finally, a way to access cinema cameras without buying a ₹5 lakh setup. Gearbox is exactly what indie filmmakers needed.",
    rating: 5,
  },
  {
    name: "Ananya Patel",
    role: "Wedding Photographer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    quote:
      "I've been waiting for something like this in India. Renting from fellow creators feels so much more trustworthy than random rental shops.",
    rating: 5,
  },
  {
    name: "Karan Malhotra",
    role: "YouTube Creator",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    quote:
      "The gear I need for one shoot shouldn't cost me a fortune. Gearbox makes professional equipment accessible for every project.",
    rating: 5,
  },
];

export const trustedLogos = [
  "Film Companion",
  "Mumbai Creators",
  "Bangalore Film Society",
  "Indie Reels",
  "Creator Hub",
  "Frame Stories",
];
