
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
  },
  {
    id: "item-7",
    title: "Chromatic Symphony",
    description: "A bold abstract painting exploring the relationships between colors and forms, creating a dynamic visual rhythm across the canvas.",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    price: "$3,200",
    type: "original",
    status: "available",
    artist: {
      id: "artist-6",
      name: "David Hernandez",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    medium: "Oil and acrylic on canvas",
    dimensions: "48 × 60 inches",
    year: "2023",
    category: "painting"
  },
  {
    id: "item-8",
    title: "Veiled Reflections",
    description: "A hauntingly beautiful portrait that uses translucent layers to create a sense of depth and mystery, inviting viewers to look beyond the surface.",
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    price: "$2,800",
    type: "original",
    status: "available",
    artist: {
      id: "artist-7",
      name: "Amara Johnson",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    medium: "Oil on linen",
    dimensions: "30 × 40 inches",
    year: "2022",
    category: "painting"
  },
  {
    id: "item-9",
    title: "Urban Wilderness",
    description: "A series of street photography capturing unexpected moments of nature reclaiming urban spaces, printed as a limited edition collection.",
    image: "https://images.unsplash.com/photo-1569974498991-d3c12a504f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    price: "$1,100",
    type: "print",
    status: "available",
    artist: {
      id: "artist-2",
      name: "James Wilson",
      photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    medium: "Archival pigment print",
    dimensions: "20 × 30 inches (set of 3)",
    year: "2023",
    category: "photography"
  },
  {
    id: "item-10",
    title: "Quantum Fragments",
    description: "A digital artwork exploring the intersection of quantum physics and visual art, rendered with cutting-edge algorithms and printed on metal.",
    image: "https://images.unsplash.com/photo-1561059488-916d69792237?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    price: "$950",
    type: "digital",
    status: "available",
    artist: {
      id: "artist-8",
      name: "Ray Zhang",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    medium: "Digital art printed on aluminum",
    dimensions: "36 × 36 inches",
    year: "2023",
    category: "digital"
  },
  {
    id: "item-11",
    title: "Ethereal Garden",
    description: "A delicate watercolor series depicting imaginary botanical specimens that blend reality and fantasy, exploring the beauty of the natural world.",
    image: "https://images.unsplash.com/photo-1579541637431-4e3cd6f6c9db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    price: "$1,400",
    type: "original",
    status: "available",
    artist: {
      id: "artist-9",
      name: "Lila Patel",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    medium: "Watercolor on paper",
    dimensions: "18 × 24 inches (set of 3)",
    year: "2022",
    category: "painting"
  },
  {
    id: "item-12",
    title: "Tectonic Forces",
    description: "A monumental ceramic sculpture inspired by geological formations and tectonic plate movements, glazed with earth tones and metallic finishes.",
    image: "https://images.unsplash.com/photo-1554222413-474689f1f1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    price: "$4,500",
    type: "original",
    status: "available",
    artist: {
      id: "artist-10",
      name: "Hiroshi Tanaka",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    medium: "Stoneware ceramic with custom glazes",
    dimensions: "24 × 18 × 16 inches",
    year: "2023",
    category: "sculpture"
  },
  {
    id: "item-13",
    title: "Nocturnal Reverie",
    description: "A moody nightscape painted with deep blues and purples, capturing the mysterious atmosphere of twilight and the emotions it evokes.",
    image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    price: "$1,850",
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
    id: "item-14",
    title: "Kaleidoscopic Dreams",
    description: "A vibrant digital artwork inspired by the patterns and symmetries of kaleidoscopes, exploring the boundaries between chaos and order.",
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    price: "$650",
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
    id: "item-15",
    title: "Memory Traces",
    description: "A mixed media collage incorporating personal photographs, vintage ephemera, and abstract painting elements to explore themes of memory and time.",
    image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    price: "$1,600",
    type: "original",
    status: "available",
    artist: {
      id: "artist-5",
      name: "Olivia Parker",
      photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    medium: "Mixed media collage on panel",
    dimensions: "24 × 36 inches",
    year: "2022",
    category: "mixed-media"
  },
  {
    id: "item-16",
    title: "Architectural Abstractions",
    description: "A series of minimalist black and white photographs exploring the geometric patterns and forms found in modern architecture.",
    image: "https://images.unsplash.com/photo-1555353540-64580b51c258?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    price: "$900",
    type: "print",
    status: "available",
    artist: {
      id: "artist-2",
      name: "James Wilson",
      photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    medium: "Silver gelatin print",
    dimensions: "16 × 20 inches (set of 4)",
    year: "2023",
    category: "photography"
  }
];
