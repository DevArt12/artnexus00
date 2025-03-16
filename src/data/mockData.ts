
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
  },
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
