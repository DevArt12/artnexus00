export interface Artist {
  id: string;
  name: string;
  profileImage: string;
  coverImage: string;
  bio: string;
  location: string;
  followers: number;
  following: number;
  website?: string;
  social?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface Artwork {
  id: string;
  title: string;
  image: string;
  description: string;
  artistId: string;
  createdAt: string;
  likes: number;
  comments: number;
  categories: string[];
  dimensions?: string;
  medium?: string;
  price?: string;
  onSale?: boolean;
}

export interface Comment {
  id: string;
  artworkId: string;
  userId: string;
  userName: string;
  userImage: string;
  content: string;
  createdAt: string;
}

export const artists: Artist[] = [
  {
    id: "1",
    name: "Elena Rodriguez",
    profileImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    coverImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=890&q=80",
    bio: "Contemporary artist exploring the intersection of digital and traditional media. My work reflects the harmony and chaos of urban environments.",
    location: "Barcelona, Spain",
    followers: 2478,
    following: 312,
    website: "elenaart.com",
    social: {
      instagram: "@elena_creates",
      twitter: "@elena_rodriguez",
    },
  },
  {
    id: "2",
    name: "Marcus Chen",
    profileImage: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    coverImage: "https://images.unsplash.com/photo-1551913902-c92207136625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=890&q=80",
    bio: "Abstract expressionist painter focusing on emotions through color and form. My paintings are a window into the subconscious mind.",
    location: "New York, USA",
    followers: 5121,
    following: 487,
    website: "marcuschen.art",
    social: {
      instagram: "@marcus_abstracts",
      facebook: "MarcusChenArt",
    },
  },
  {
    id: "3",
    name: "Aisha Patel",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    coverImage: "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=890&q=80",
    bio: "Photographer and mixed media artist exploring cultural identity and displacement. My art is a dialogue between heritage and modernity.",
    location: "London, UK",
    followers: 3689,
    following: 521,
    social: {
      instagram: "@aisha_lens",
      twitter: "@aisha_creates",
    },
  },
  {
    id: "4",
    name: "Hiroshi Tanaka",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    coverImage: "https://images.unsplash.com/photo-1606819717115-9159c900370b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=890&q=80",
    bio: "Sculptor and installation artist exploring the relationship between space, light, and perception. My work invites viewers to experience familiar environments in new ways.",
    location: "Tokyo, Japan",
    followers: 4233,
    following: 198,
    website: "hiroshitanaka.co.jp",
    social: {
      instagram: "@hiroshi_sculptures",
    },
  },
  {
    id: "5",
    name: "Sophia Williams",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    coverImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=890&q=80",
    bio: "Digital artist and animator creating immersive experiences that blend technology with traditional storytelling. My work explores themes of identity in the digital age.",
    location: "Berlin, Germany",
    followers: 3127,
    following: 287,
    website: "sophiawilliams.de",
    social: {
      instagram: "@sophia_digitalart",
      twitter: "@sophia_creates",
    },
  }
];

export const artworks: Artwork[] = [
  {
    id: "1",
    title: "Urban Symphony",
    image: "https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=765&q=80",
    description: "A vibrant exploration of city life through abstract shapes and bold colors. This piece captures the energy and movement of urban spaces.",
    artistId: "1",
    createdAt: "2023-10-15",
    likes: 342,
    comments: 28,
    categories: ["Abstract", "Urban"],
    dimensions: "30x40 inches",
    medium: "Acrylic on canvas",
    price: "$1,200",
    onSale: true,
  },
  {
    id: "2",
    title: "Digital Dreams",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    description: "A digital artwork exploring the subconscious mind through surreal imagery and dreamlike elements.",
    artistId: "1",
    createdAt: "2023-09-22",
    likes: 287,
    comments: 19,
    categories: ["Digital", "Surrealism"],
    price: "$800",
    onSale: true,
  },
  {
    id: "3",
    title: "Emotional Spectrum",
    image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=765&q=80",
    description: "An abstract expression of human emotions represented through a spectrum of colors and textures.",
    artistId: "2",
    createdAt: "2023-11-05",
    likes: 524,
    comments: 47,
    categories: ["Abstract", "Expressionism"],
    dimensions: "48x36 inches",
    medium: "Oil on canvas",
    price: "$3,500",
    onSale: true,
  },
  {
    id: "4",
    title: "Fragments of Memory",
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=765&q=80",
    description: "A mixed media collage exploring memories and the passage of time through layered imagery and textures.",
    artistId: "2",
    createdAt: "2023-08-17",
    likes: 318,
    comments: 23,
    categories: ["Mixed Media", "Conceptual"],
    dimensions: "24x24 inches",
    medium: "Mixed media on wood panel",
    price: "$1,800",
    onSale: false,
  },
  {
    id: "5",
    title: "Cultural Tapestry",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=770&q=80",
    description: "A photographic series exploring cultural identity through portraits and landscapes from around the world.",
    artistId: "3",
    createdAt: "2023-10-28",
    likes: 412,
    comments: 35,
    categories: ["Photography", "Documentary"],
    price: "$950",
    onSale: true,
  },
  {
    id: "6",
    title: "Between Worlds",
    image: "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=536&q=80",
    description: "A mixed media installation exploring the concept of liminality and the spaces between defined states of being.",
    artistId: "3",
    createdAt: "2023-07-14",
    likes: 276,
    comments: 18,
    categories: ["Installation", "Conceptual"],
    price: "$2,200",
    onSale: false,
  },
  {
    id: "7",
    title: "Neon Nostalgia",
    image: "https://images.unsplash.com/photo-1559030623-0226b1241edd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    description: "A digital artwork exploring themes of nostalgia through retro-futuristic imagery and neon aesthetics.",
    artistId: "1",
    createdAt: "2023-09-03",
    likes: 389,
    comments: 31,
    categories: ["Digital", "Retro"],
    price: "$750",
    onSale: true,
  },
  {
    id: "8",
    title: "Organic Abstractions",
    image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    description: "A series of abstract paintings inspired by natural forms and organic structures, celebrating the beauty of the microscopic world.",
    artistId: "2",
    createdAt: "2023-11-20",
    likes: 467,
    comments: 42,
    categories: ["Abstract", "Nature"],
    dimensions: "36x48 inches",
    medium: "Acrylic and ink on canvas",
    price: "$2,800",
    onSale: true,
  },
  
  {
    id: "painting-1",
    title: "Abstract Landscape",
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=765&q=80",
    description: "Abstract landscape inspired by the rolling hills and vibrant colors of rural India.",
    artistId: "1",
    createdAt: "2023-10-15",
    likes: 342,
    comments: 28,
    categories: ["Painting", "Abstract"],
    dimensions: "36x48 inches",
    medium: "Acrylic on canvas",
    price: "₹95,000",
    onSale: true,
  },
  {
    id: "painting-2",
    title: "Sunset Serenity",
    image: "https://www.freepik.com/search?format=search&img=1&last_filter=img&last_value=1&query=Painting&selection=1",
    description: "A warm and inviting sunset scene painted with traditional techniques.",
    artistId: "2",
    createdAt: "2023-11-20",
    likes: 254,
    comments: 19,
    categories: ["Painting", "Landscape"],
    dimensions: "24x36 inches",
    medium: "Oil on canvas",
    price: "₹78,500",
    onSale: true,
  },
  
  {
    id: "sculpture-1",
    title: "Bronze Harmony",
    image: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "A flowing bronze sculpture inspired by the forms of classical Indian dance.",
    artistId: "4",
    createdAt: "2023-09-25",
    likes: 187,
    comments: 15,
    categories: ["Sculpture", "Bronze"],
    dimensions: "18x12x30 inches",
    medium: "Bronze",
    price: "₹265,000",
    onSale: true,
  },
  {
    id: "sculpture-2",
    title: "Marble Meditation",
    image: "https://images.unsplash.com/photo-1565267945232-253c914e47e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80",
    description: "A serene marble sculpture exploring themes of mindfulness and inner peace.",
    artistId: "4",
    createdAt: "2023-08-12",
    likes: 215,
    comments: 22,
    categories: ["Sculpture", "Marble"],
    dimensions: "24x18x16 inches",
    medium: "Marble",
    price: "₹320,000",
    onSale: false,
  },
  
  {
    id: "digital-1",
    title: "Cybernetic Dreams",
    image: "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80",
    description: "A futuristic digital landscape exploring the relationship between humans and technology.",
    artistId: "5",
    createdAt: "2023-11-02",
    likes: 326,
    comments: 31,
    categories: ["Digital Art", "Futurism"],
    dimensions: "Adjustable to print size",
    medium: "Digital illustration",
    price: "₹46,500",
    onSale: true,
  },
  {
    id: "digital-2",
    title: "Quantum Consciousness",
    image: "https://images.unsplash.com/photo-1575286368486-a9bd023a3d1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80",
    description: "An exploration of human consciousness through abstract digital forms and patterns.",
    artistId: "5",
    createdAt: "2023-12-01",
    likes: 289,
    comments: 25,
    categories: ["Digital Art", "Abstract"],
    dimensions: "Adjustable to print size",
    medium: "Digital artwork",
    price: "₹39,900",
    onSale: true,
  },
  
  {
    id: "photography-1",
    title: "Ancient Alleys",
    image: "https://images.unsplash.com/photo-1603134743646-638bead13150?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80",
    description: "A photographic journey through the narrow alleyways of ancient Indian cities.",
    artistId: "3",
    createdAt: "2023-10-05",
    likes: 243,
    comments: 19,
    categories: ["Photography", "Street"],
    dimensions: "20x30 inches",
    medium: "Archival digital print",
    price: "₹28,500",
    onSale: true,
  },
  {
    id: "photography-2",
    title: "Monsoon Rhythms",
    image: "https://images.unsplash.com/photo-1523891724653-34d9c7e5c4c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80",
    description: "Capturing the beauty and intensity of the Indian monsoon season.",
    artistId: "3",
    createdAt: "2023-08-22",
    likes: 275,
    comments: 24,
    categories: ["Photography", "Nature"],
    dimensions: "24x36 inches",
    medium: "Photographic print on metallic paper",
    price: "₹35,900",
    onSale: false,
  },
  
  {
    id: "mixed-media-1",
    title: "Cultural Tapestry",
    image: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80",
    description: "A mixed media piece incorporating textiles, paper, and paint to explore cultural identity.",
    artistId: "1",
    createdAt: "2023-11-15",
    likes: 198,
    comments: 17,
    categories: ["Mixed Media", "Cultural"],
    dimensions: "36x48 inches",
    medium: "Textiles, acrylic, paper on canvas",
    price: "₹87,500",
    onSale: true,
  },
  {
    id: "mixed-media-2",
    title: "Ephemeral Memories",
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80",
    description: "A layered exploration of memory through found objects, photographs, and paint.",
    artistId: "2",
    createdAt: "2023-09-30",
    likes: 204,
    comments: 18,
    categories: ["Mixed Media", "Conceptual"],
    dimensions: "24x24 inches",
    medium: "Mixed media on wood panel",
    price: "₹65,000",
    onSale: true,
  },
  
  {
    id: "drawing-1",
    title: "Urban Sketches",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80",
    description: "A series of charcoal sketches capturing the energy and architecture of urban environments.",
    artistId: "2",
    createdAt: "2023-10-22",
    likes: 167,
    comments: 14,
    categories: ["Drawing", "Urban"],
    dimensions: "14x17 inches each (set of 3)",
    medium: "Charcoal on paper",
    price: "₹43,000",
    onSale: false,
  },
  {
    id: "drawing-2",
    title: "Botanical Studies",
    image: "https://images.unsplash.com/photo-1579783928621-7a13d66a8b33?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80",
    description: "Detailed botanical illustrations combining scientific accuracy with artistic expression.",
    artistId: "3",
    createdAt: "2023-11-10",
    likes: 183,
    comments: 16,
    categories: ["Drawing", "Nature"],
    dimensions: "11x14 inches each (set of 4)",
    medium: "Ink and watercolor on paper",
    price: "₹37,500",
    onSale: true,
  },
  
  {
    id: "printmaking-1",
    title: "Urban Impressions",
    image: "https://images.unsplash.com/photo-1578301977886-43be98062ec9?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80",
    description: "A series of linocut prints exploring urban landscapes and city life.",
    artistId: "1",
    createdAt: "2023-09-18",
    likes: 156,
    comments: 13,
    categories: ["Printmaking", "Urban"],
    dimensions: "18x24 inches",
    medium: "Linocut print on Japanese paper",
    price: "₹24,500",
    onSale: true,
  },
  {
    id: "printmaking-2",
    title: "Natural Patterns",
    image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80",
    description: "Abstract patterns inspired by natural forms, created using traditional woodblock printing techniques.",
    artistId: "3",
    createdAt: "2023-10-30",
    likes: 172,
    comments: 15,
    categories: ["Printmaking", "Abstract"],
    dimensions: "16x20 inches",
    medium: "Woodblock print",
    price: "₹28,900",
    onSale: false,
  },
  
  {
    id: "textile-1",
    title: "Woven Narratives",
    image: "https://images.unsplash.com/photo-1528255915607-9012fda0f838?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80",
    description: "A handwoven tapestry incorporating traditional Indian motifs and contemporary design elements.",
    artistId: "5",
    createdAt: "2023-11-25",
    likes: 189,
    comments: 16,
    categories: ["Textile", "Traditional"],
    dimensions: "48x60 inches",
    medium: "Handwoven cotton and silk",
    price: "₹115,000",
    onSale: true,
  },
  {
    id: "textile-2",
    title: "Indigo Dreams",
    image: "https://images.unsplash.com/photo-1528255915607-9012fda0f838?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80",
    description: "A textile piece exploring the rich history and cultural significance of indigo dyeing in India.",
    artistId: "1",
    createdAt: "2023-10-12",
    likes: 197,
    comments: 17,
    categories: ["Textile", "Traditional"],
    dimensions: "36x48 inches",
    medium: "Natural indigo dye on handloom cotton",
    price: "₹92,500",
    onSale: false,
  }
];

export const comments: Comment[] = [
  {
    id: "1",
    artworkId: "1",
    userId: "user1",
    userName: "Sarah Johnson",
    userImage: "https://randomuser.me/api/portraits/women/32.jpg",
    content: "I love the use of color in this piece! The way you've captured the energy of the city is remarkable.",
    createdAt: "2023-11-10T14:32:00Z",
  },
  {
    id: "2",
    artworkId: "1",
    userId: "user2",
    userName: "David Chen",
    userImage: "https://randomuser.me/api/portraits/men/68.jpg",
    content: "The composition is so dynamic. I can feel the movement just by looking at it.",
    createdAt: "2023-11-11T09:15:00Z",
  },
  {
    id: "3",
    artworkId: "3",
    userId: "user3",
    userName: "Amelia Park",
    userImage: "https://randomuser.me/api/portraits/women/45.jpg",
    content: "The emotional depth in this piece is incredible. I find something new every time I look at it.",
    createdAt: "2023-11-15T16:48:00Z",
  },
];

export const categories = [
  "Abstract",
  "Portraits",
  "Landscapes",
  "Urban",
  "Surrealism",
  "Digital",
  "Photography",
  "Installation",
  "Expressionism",
  "Conceptual",
  "Minimalism",
  "Mixed Media",
  "Sculpture",
  "Illustration",
  "Street Art",
  "Painting",
  "Sculpture",
  "Digital Art",
  "Photography",
  "Mixed Media",
  "Drawing",
  "Printmaking",
  "Textile",
];

export const getArtistById = (id: string): Artist | undefined => {
  return artists.find(artist => artist.id === id);
};

export const getArtworkById = (id: string): Artwork | undefined => {
  return artworks.find(artwork => artwork.id === id);
};

export const getArtworksByArtist = (artistId: string): Artwork[] => {
  return artworks.filter(artwork => artwork.artistId === artistId);
};

export const getCommentsByArtwork = (artworkId: string): Comment[] => {
  return comments.filter(comment => comment.artworkId === artworkId);
};

export const getArtworksByCategory = (category: string): Artwork[] => {
  return artworks.filter(artwork => artwork.categories.includes(category));
};

export const getArtworksByCategories = (categories: string[]): Artwork[] => {
  if (categories.length === 0) return artworks;
  return artworks.filter(artwork => 
    categories.some(category => artwork.categories.includes(category))
  );
};

export const getRecommendedArtworks = (artworkId: string, limit: number = 4): Artwork[] => {
  const artwork = getArtworkById(artworkId);
  if (!artwork) return [];
  
  const similar = artworks
    .filter(a => a.id !== artworkId && a.categories.some(cat => artwork.categories.includes(cat)))
    .sort((a, b) => {
      const aMatches = a.categories.filter(cat => artwork.categories.includes(cat)).length;
      const bMatches = b.categories.filter(cat => artwork.categories.includes(cat)).length;
      return bMatches - aMatches;
    })
    .slice(0, limit);
    
  return similar;
};
