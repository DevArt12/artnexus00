
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
  // Original artworks
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
  
  // New artworks to have at least 10 per category
  // Abstract category (adding more)
  {
    id: "9",
    title: "Chromatic Cascade",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "A vibrant exploration of color theory through flowing abstract forms, creating a sense of movement and emotional resonance.",
    artistId: "2",
    createdAt: "2023-12-05",
    likes: 312,
    comments: 24,
    categories: ["Abstract", "Color Field"],
    dimensions: "40x60 inches",
    medium: "Acrylic on canvas",
    price: "$2,400",
    onSale: true,
  },
  {
    id: "10",
    title: "Geometric Meditation",
    image: "https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "A precise arrangement of geometric shapes creating a meditative visual experience through balance and symmetry.",
    artistId: "4",
    createdAt: "2023-11-17",
    likes: 285,
    comments: 19,
    categories: ["Abstract", "Geometric"],
    dimensions: "24x24 inches",
    medium: "Oil on canvas",
    price: "$1,600",
    onSale: false,
  },
  {
    id: "11",
    title: "Fluid Dynamics",
    image: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "An exploration of motion and fluidity through abstract forms that seem to flow across the canvas in a dance of color and shape.",
    artistId: "1",
    createdAt: "2023-10-22",
    likes: 367,
    comments: 28,
    categories: ["Abstract", "Fluid"],
    dimensions: "36x48 inches",
    medium: "Acrylic and resin on canvas",
    price: "$2,200",
    onSale: true,
  },
  {
    id: "12",
    title: "Fragmented Reality",
    image: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "A cubist-inspired piece that breaks down visual reality into fractured planes, challenging perceptions of space and form.",
    artistId: "2",
    createdAt: "2023-09-14",
    likes: 298,
    comments: 22,
    categories: ["Abstract", "Cubism"],
    dimensions: "30x40 inches",
    medium: "Oil on canvas",
    price: "$3,100",
    onSale: false,
  },
  {
    id: "13",
    title: "Ethereal Whispers",
    image: "https://images.unsplash.com/photo-1604871000636-074fa5117945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "Delicate, translucent layers of color create an atmospheric abstract landscape that evokes dreamlike emotional states.",
    artistId: "5",
    createdAt: "2023-12-12",
    likes: 341,
    comments: 27,
    categories: ["Abstract", "Atmospheric"],
    dimensions: "48x36 inches",
    medium: "Watercolor and ink on paper",
    price: "$1,800",
    onSale: true,
  },
  
  // Digital category (adding more)
  {
    id: "14",
    title: "Neural Network",
    image: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "A digital artwork exploring the complexity of artificial intelligence through interconnected neural patterns.",
    artistId: "5",
    createdAt: "2023-11-28",
    likes: 426,
    comments: 38,
    categories: ["Digital", "AI Art"],
    price: "$950",
    onSale: true,
  },
  {
    id: "15",
    title: "Pixel Renaissance",
    image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "A reinterpretation of classical painting techniques through digital pixel art, blending traditional and contemporary aesthetics.",
    artistId: "1",
    createdAt: "2023-10-05",
    likes: 352,
    comments: 29,
    categories: ["Digital", "Pixel Art"],
    price: "$680",
    onSale: false,
  },
  {
    id: "16",
    title: "Quantum Realm",
    image: "https://images.unsplash.com/photo-1633412802994-5c058f151b66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "A digital fractal artwork exploring the infinite complexities of quantum physics through mathematical patterns.",
    artistId: "5",
    createdAt: "2023-12-01",
    likes: 385,
    comments: 32,
    categories: ["Digital", "Fractal"],
    price: "$850",
    onSale: true,
  },
  {
    id: "17",
    title: "Cybernetic Symphony",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "A digital composition visualizing sound waves and music as flowing cybernetic structures in a vibrant virtual landscape.",
    artistId: "5",
    createdAt: "2023-09-18",
    likes: 412,
    comments: 35,
    categories: ["Digital", "Generative"],
    price: "$920",
    onSale: false,
  },
  {
    id: "18",
    title: "Virtual Eden",
    image: "https://images.unsplash.com/photo-1633621412960-6df85eff8c5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "A lush digital landscape reimagining the biblical Garden of Eden as a fantastical virtual realm filled with impossible flora and fauna.",
    artistId: "1",
    createdAt: "2023-11-09",
    likes: 378,
    comments: 31,
    categories: ["Digital", "Fantasy"],
    price: "$780",
    onSale: true,
  },
  {
    id: "19",
    title: "Algorithm Dreams",
    image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "A mesmerizing digital artwork created through algorithmic processes, revealing complex patterns that emerge from simple mathematical rules.",
    artistId: "5",
    createdAt: "2023-10-17",
    likes: 325,
    comments: 26,
    categories: ["Digital", "Algorithm Art"],
    price: "$890",
    onSale: false,
  },
  {
    id: "20",
    title: "Holographic Memories",
    image: "https://images.unsplash.com/photo-1604871000636-074fa5117945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "A digital artwork exploring the concept of memory as fragmented, glitchy holographic projections suspended in virtual space.",
    artistId: "1",
    createdAt: "2023-11-22",
    likes: 356,
    comments: 29,
    categories: ["Digital", "Holographic"],
    price: "$820",
    onSale: true,
  },
  
  // Photography category (adding more)
  {
    id: "21",
    title: "Urban Solitude",
    image: "https://images.unsplash.com/photo-1514539079130-25950c84af65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "A black and white photographic exploration of isolation within the urban landscape, capturing empty city spaces normally filled with people.",
    artistId: "3",
    createdAt: "2023-09-08",
    likes: 287,
    comments: 23,
    categories: ["Photography", "Street"],
    price: "$750",
    onSale: false,
  },
  {
    id: "22",
    title: "Microscopic Cosmos",
    image: "https://images.unsplash.com/photo-1574169208502-e40c3ae54fc0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "Breathtaking macro photography revealing the hidden universe within everyday objects and natural elements.",
    artistId: "3",
    createdAt: "2023-12-07",
    likes: 342,
    comments: 28,
    categories: ["Photography", "Macro"],
    price: "$890",
    onSale: true,
  },
  {
    id: "23",
    title: "Aerial Abstractions",
    image: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "Drone photography capturing abstract patterns and textures formed by landscapes, agriculture, and urban development from above.",
    artistId: "3",
    createdAt: "2023-10-12",
    likes: 375,
    comments: 31,
    categories: ["Photography", "Aerial"],
    price: "$950",
    onSale: false,
  },
  {
    id: "24",
    title: "Liquid Light",
    image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "Experimental long-exposure photography capturing the fluid movement of light through various mediums and environments.",
    artistId: "3",
    createdAt: "2023-11-03",
    likes: 329,
    comments: 27,
    categories: ["Photography", "Experimental"],
    price: "$820",
    onSale: true,
  },
  {
    id: "25",
    title: "Fading Traditions",
    image: "https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "Documentary photography series capturing vanishing cultural practices and traditions from around the world.",
    artistId: "3",
    createdAt: "2023-09-25",
    likes: 412,
    comments: 35,
    categories: ["Photography", "Documentary"],
    price: "$980",
    onSale: false,
  },
  {
    id: "26",
    title: "Botanical Studies",
    image: "https://images.unsplash.com/photo-1596825858573-e85ea2b5cc08?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "Detailed photographic studies of plant forms, inspired by classical botanical illustrations but with a contemporary approach.",
    artistId: "3",
    createdAt: "2023-12-15",
    likes: 298,
    comments: 24,
    categories: ["Photography", "Nature"],
    price: "$780",
    onSale: true,
  },
  {
    id: "27",
    title: "Urban Geometry",
    image: "https://images.unsplash.com/photo-1582845512747-e42001c95638?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "Architectural photography focusing on the geometric patterns and structural elements of modern urban environments.",
    artistId: "3",
    createdAt: "2023-10-28",
    likes: 354,
    comments: 29,
    categories: ["Photography", "Architecture"],
    price: "$920",
    onSale: false,
  },
  {
    id: "28",
    title: "Spectral Portraits",
    image: "https://images.unsplash.com/photo-1535340582796-799448c62e08?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "Infrared photography series presenting familiar landscapes and portraits in an otherworldly spectrum of light.",
    artistId: "3",
    createdAt: "2023-11-17",
    likes: 321,
    comments: 26,
    categories: ["Photography", "Infrared"],
    price: "$850",
    onSale: true,
  },
  
  // Sculpture category (adding new category)
  {
    id: "29",
    title: "Temporal Fragments",
    image: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "A sculptural installation made from reclaimed materials, exploring concepts of time, memory, and environmental change.",
    artistId: "4",
    createdAt: "2023-11-05",
    likes: 287,
    comments: 23,
    categories: ["Sculpture", "Installation"],
    dimensions: "Variable dimensions",
    medium: "Mixed media, reclaimed materials",
    price: "$4,500",
    onSale: false,
  },
  {
    id: "30",
    title: "Biomimetic Forms",
    image: "https://images.unsplash.com/photo-1529154631088-a0e516571c60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "Sculptural works inspired by biological structures and natural growth patterns, created using 3D printing technology.",
    artistId: "4",
    createdAt: "2023-12-08",
    likes: 326,
    comments: 27,
    categories: ["Sculpture", "3D Printing"],
    dimensions: "18x24x16 inches",
    medium: "3D printed bioplastic",
    price: "$3,200",
    onSale: true,
  },
  {
    id: "31",
    title: "Gravity's Embrace",
    image: "https://images.unsplash.com/photo-1576773689115-5cd2b0223523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "A suspended kinetic sculpture that responds to air currents, creating an ever-changing composition of balanced elements.",
    artistId: "4",
    createdAt: "2023-10-22",
    likes: 342,
    comments: 28,
    categories: ["Sculpture", "Kinetic"],
    dimensions: "60x48x36 inches",
    medium: "Steel, brass, nylon thread",
    price: "$5,800",
    onSale: false,
  },
  {
    id: "32",
    title: "Crystal Growth",
    image: "https://images.unsplash.com/photo-1605541885855-5a538260385c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "A series of glass sculptures exploring crystalline forms and patterns found in both natural and artificial structures.",
    artistId: "4",
    createdAt: "2023-09-15",
    likes: 298,
    comments: 24,
    categories: ["Sculpture", "Glass"],
    dimensions: "Various sizes",
    medium: "Blown and cast glass",
    price: "$2,900",
    onSale: true,
  },
  {
    id: "33",
    title: "Urban Remains",
    image: "https://images.unsplash.com/photo-1581874864387-53cc0d0acda5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "Sculptural assemblages crafted from urban debris and forgotten objects, giving new context and meaning to discarded materials.",
    artistId: "4",
    createdAt: "2023-11-30",
    likes: 312,
    comments: 25,
    categories: ["Sculpture", "Assemblage"],
    dimensions: "30x24x18 inches",
    medium: "Found objects, steel, concrete",
    price: "$3,400",
    onSale: false,
  },
  {
    id: "34",
    title: "Marble Dreams",
    image: "https://images.unsplash.com/photo-1518842013791-b4d5d3f29504?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "Contemporary marble sculptures that contrast classical techniques with modern subject matter, exploring themes of technology and nature.",
    artistId: "4",
    createdAt: "2023-10-05",
    likes: 376,
    comments: 31,
    categories: ["Sculpture", "Stone"],
    dimensions: "24x16x20 inches",
    medium: "Carrara marble",
    price: "$7,500",
    onSale: true,
  },
  {
    id: "35",
    title: "Folded Reality",
    image: "https://images.unsplash.com/photo-1561839561-b13bcfe95249?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "Paper and origami sculptures that transform flat materials into complex three-dimensional forms and spatial illusions.",
    artistId: "4",
    createdAt: "2023-12-01",
    likes: 289,
    comments: 23,
    categories: ["Sculpture", "Paper"],
    dimensions: "Various sizes",
    medium: "Handmade paper, archival adhesive",
    price: "$1,800",
    onSale: false,
  },
  {
    id: "36",
    title: "Reflective Surfaces",
    image: "https://images.unsplash.com/photo-1558365849-6ebd8b0454b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "Polished metal sculptures that play with light and reflection, creating dynamic visual experiences that change with the viewer's perspective.",
    artistId: "4",
    createdAt: "2023-09-28",
    likes: 335,
    comments: 27,
    categories: ["Sculpture", "Metal"],
    dimensions: "36x24x24 inches",
    medium: "Polished stainless steel, bronze",
    price: "$6,200",
    onSale: true,
  },
  
  // Mixed Media category (adding more)
  {
    id: "37",
    title: "Textural Landscapes",
    image: "https://images.unsplash.com/photo-1615210466215-29af057dfff4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "Mixed media works combining paint, textiles, and organic materials to create tactile landscapes inspired by geological formations.",
    artistId: "5",
    createdAt: "2023-11-12",
    likes: 312,
    comments: 25,
    categories: ["Mixed Media", "Textile"],
    dimensions: "36x48 inches",
    medium: "Acrylic, fabric, sand, natural pigments on canvas",
    price: "$2,400",
    onSale: false,
  },
  {
    id: "38",
    title: "Ephemeral Archives",
    image: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "A mixed media series exploring personal and collective memory through layered photographs, documents, and found objects.",
    artistId: "3",
    createdAt: "2023-10-17",
    likes: 287,
    comments: 23,
    categories: ["Mixed Media", "Collage"],
    dimensions: "24x30 inches",
    medium: "Vintage photographs, resin, paper, ink on wood panel",
    price: "$1,950",
    onSale: true,
  },
  {
    id: "39",
    title: "Digital Palimpsest",
    image: "https://images.unsplash.com/photo-1600132806608-231aa1c28cbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "Mixed media artwork combining traditional painting with digital printing and projection, creating layers of meaning and visual information.",
    artistId: "5",
    createdAt: "2023-12-05",
    likes: 342,
    comments: 28,
    categories: ["Mixed Media", "Digital"],
    dimensions: "40x60 inches",
    medium: "Oil paint, digital print, video projection",
    price: "$3,200",
    onSale: false,
  },
  {
    id: "40",
    title: "Material Memories",
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "A tactile mixed media series incorporating personal artifacts, textiles, and encaustic techniques to preserve and transform memories.",
    artistId: "2",
    createdAt: "2023-09-22",
    likes: 298,
    comments: 24,
    categories: ["Mixed Media", "Encaustic"],
    dimensions: "18x24 inches",
    medium: "Encaustic, fabric, found objects on wood",
    price: "$1,800",
    onSale: true,
  },
  {
    id: "41",
    title: "Sonic Translations",
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "Mixed media artworks visualizing sound and music through paint, ink, and relief elements, translating auditory experiences into visual form.",
    artistId: "1",
    createdAt: "2023-11-28",
    likes: 325,
    comments: 26,
    categories: ["Mixed Media", "Sound Art"],
    dimensions: "30x40 inches",
    medium: "Acrylic, ink, modeling paste on canvas",
    price: "$2,200",
    onSale: false,
  },
  {
    id: "42",
    title: "Botanical Impressions",
    image: "https://images.unsplash.com/photo-1579541591970-e5cf0a76f4ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "Mixed media botanical studies incorporating actual plant impressions, pigments, and drawing to create a contemporary herbarium.",
    artistId: "3",
    createdAt: "2023-10-09",
    likes: 276,
    comments: 22,
    categories: ["Mixed Media", "Botanical"],
    dimensions: "22x30 inches",
    medium: "Plant material, watercolor, graphite on paper",
    price: "$1,400",
    onSale: true,
  },
  {
    id: "43",
    title: "Woven Narratives",
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
    description: "Mixed media textile art telling personal and cultural stories through embroidery, printing, and quilting techniques.",
    artistId: "5",
    createdAt: "2023-12-15",
    likes: 312,
    comments: 25,
    categories: ["Mixed Media", "Textile"],
    dimensions: "48x60 inches",
    medium: "Hand-dyed fabric, thread, digital printing, found objects",
    price: "$3,800",
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
];

// Helper function to get an artist by ID
export const getArtistById = (id: string): Artist | undefined => {
  return artists.find(artist => artist.id === id);
};

// Helper function to get an artwork by ID
export const getArtworkById = (id: string): Artwork | undefined => {
  return artworks.find(artwork => artwork.id === id);
};

// Helper function to get artworks by artist ID
export const getArtworksByArtist = (artistId: string): Artwork[] => {
  return artworks.filter(artwork => artwork.artistId === artistId);
};

// Helper function to get comments by artwork ID
export const getCommentsByArtwork = (artworkId: string): Comment[] => {
  return comments.filter(comment => comment.artworkId === artworkId);
};

// Helper function to get artworks by category
export const getArtworksByCategory = (category: string): Artwork[] => {
  return artworks.filter(artwork => artwork.categories.includes(category));
};

// New helper function to get artworks by multiple categories
export const getArtworksByCategories = (categories: string[]): Artwork[] => {
  if (categories.length === 0) return artworks;
  return artworks.filter(artwork => 
    categories.some(category => artwork.categories.includes(category))
  );
};

// New helper function to get recommended artworks based on artwork
export const getRecommendedArtworks = (artworkId: string, limit: number = 4): Artwork[] => {
  const artwork = getArtworkById(artworkId);
  if (!artwork) return [];
  
  // Get artworks with similar categories, excluding the current artwork
  const similar = artworks
    .filter(a => a.id !== artworkId && a.categories.some(cat => artwork.categories.includes(cat)))
    .sort((a, b) => {
      // Count matching categories
      const aMatches = a.categories.filter(cat => artwork.categories.includes(cat)).length;
      const bMatches = b.categories.filter(cat => artwork.categories.includes(cat)).length;
      return bMatches - aMatches;
    })
    .slice(0, limit);
    
  return similar;
};
