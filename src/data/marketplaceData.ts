
export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  type: "original" | "print" | "digital";
  status: "available" | "sold" | "reserved";
  artist: {
    id: string;
    name: string;
    photo: string;
  };
  medium: string;
  dimensions?: string;
  year: string;
  category: string;
}

export const marketplaceItems: MarketplaceItem[] = [
  {
    id: "item-1",
    title: "Serenity in Blue",
    description: "An abstract expressionist painting exploring themes of tranquility and introspection through shades of blue and subtle textures.",
    image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    price: "$2,500",
    type: "original",
    status: "available",
    artist: {
      id: "artist-1",
      name: "Elena Rodriguez",
      photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    medium: "Oil on canvas",
    dimensions: "36 × 48 inches",
    year: "2023",
    category: "painting"
  },
  {
    id: "item-2",
    title: "Urban Reflections",
    description: "A contemporary photograph capturing the interplay of light and architecture in an urban landscape, printed on premium archival paper.",
    image: "https://images.unsplash.com/photo-1514924801778-1db0aba75e9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    price: "$850",
    type: "print",
    status: "available",
    artist: {
      id: "artist-2",
      name: "James Wilson",
      photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    medium: "Archival pigment print",
    dimensions: "24 × 36 inches",
    year: "2022",
    category: "photography"
  },
  {
    id: "item-3",
    title: "Digital Dreamscape",
    description: "A surreal digital illustration that blends organic and mechanical elements to create a dreamlike landscape of imagination.",
    image: "https://images.unsplash.com/photo-1604871000636-074fa5117945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    price: "$350",
    type: "digital",
    status: "available",
    artist: {
      id: "artist-3",
      name: "Sophia Lee",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    medium: "Digital art",
    year: "2023",
    category: "digital"
  },
  {
    id: "item-4",
    title: "Emergence",
    description: "A sculptural piece exploring themes of growth and transformation through the interplay of bronze and negative space.",
    image: "https://images.unsplash.com/photo-1570021974424-060d74287ec8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    price: "$3,800",
    type: "original",
    status: "available",
    artist: {
      id: "artist-4",
      name: "Marcus Chen",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    medium: "Bronze",
    dimensions: "18 × 12 × 8 inches",
    year: "2022",
    category: "sculpture"
  },
  {
    id: "item-5",
    title: "Golden Hour",
    description: "A vibrant landscape capturing the magical light of sunset over rolling hills, painted with expressive brushwork and warm colors.",
    image: "https://images.unsplash.com/photo-1552825896-9e8aa2ad2b1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    price: "$1,750",
    type: "original",
    status: "available",
    artist: {
      id: "artist-1",
      name: "Elena Rodriguez",
      photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    medium: "Acrylic on canvas",
    dimensions: "30 × 40 inches",
    year: "2022",
    category: "painting"
  },
  {
    id: "item-6",
    title: "Textural Study #7",
    description: "A mixed media piece exploring textures and patterns found in nature, combining handmade paper, natural fibers, and subtle pigments.",
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    price: "$1,200",
    type: "original",
    status: "available",
    artist: {
      id: "artist-5",
      name: "Olivia Parker",
      photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    medium: "Mixed media on panel",
    dimensions: "24 × 24 inches",
    year: "2023",
    category: "mixed-media"
  }
];
