
export interface ForumTopic {
  id: string;
  title: string;
  category: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  created_at: string;
  reply_count: number;
  excerpt: string;
}

export interface ForumPost {
  id: string;
  topic_id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role?: string;
  };
  content: string;
  created_at: string;
}

export const forumTopics: ForumTopic[] = [
  {
    id: "topic-1",
    title: "What are your favorite art materials for beginners?",
    category: "materials",
    author: {
      id: "user-1",
      name: "ArtEnthusiast",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    created_at: "2023-06-15T14:32:00Z",
    reply_count: 24,
    excerpt: "I'm just starting my art journey and would love recommendations on essential materials that won't break the bank..."
  },
  {
    id: "topic-2",
    title: "Upcoming exhibition opportunities in the Northeast",
    category: "exhibitions",
    author: {
      id: "user-2",
      name: "GalleryOwner",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    created_at: "2023-06-18T09:45:00Z",
    reply_count: 12,
    excerpt: "I'm compiling a list of upcoming exhibition opportunities for emerging artists in the Northeast region..."
  },
  {
    id: "topic-3",
    title: "Digital art workflows - share your process",
    category: "digital",
    author: {
      id: "user-3",
      name: "DigitalCreator",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    created_at: "2023-06-20T16:22:00Z",
    reply_count: 18,
    excerpt: "Let's share our digital art workflows! I'm curious about how other artists organize their process from sketch to final piece..."
  },
  {
    id: "topic-4",
    title: "Art pricing strategies for new artists",
    category: "business",
    author: {
      id: "user-4",
      name: "EmergingArtist",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    created_at: "2023-06-23T11:05:00Z",
    reply_count: 32,
    excerpt: "I'm struggling with how to price my artwork as someone just starting to sell. Any advice on pricing strategies that have worked for you?"
  },
  {
    id: "topic-5",
    title: "Critique request: My latest landscape series",
    category: "critique",
    author: {
      id: "user-5",
      name: "LandscapeArtist",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    created_at: "2023-06-25T18:30:00Z",
    reply_count: 15,
    excerpt: "I've been working on a series of landscape paintings focusing on mood and atmosphere. Would appreciate some constructive feedback..."
  },
  {
    id: "topic-6",
    title: "How to approach galleries as an emerging artist",
    category: "business",
    author: {
      id: "user-6",
      name: "NewInTown",
      avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    created_at: "2023-06-28T13:15:00Z",
    reply_count: 27,
    excerpt: "I'm ready to start approaching galleries but I'm not sure about the etiquette. What's worked for you when contacting galleries for the first time?"
  }
];

export const forumPosts: Record<string, ForumPost[]> = {
  "topic-1": [
    {
      id: "post-1-1",
      topic_id: "topic-1",
      author: {
        id: "user-1",
        name: "ArtEnthusiast",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
      },
      content: "I'm just starting my art journey and would love recommendations on essential materials that won't break the bank. So far I've been using some basic student-grade supplies from the local craft store, but I'm ready to invest in some better quality items. What are your must-haves for beginners? Particularly interested in drawing and painting supplies!",
      created_at: "2023-06-15T14:32:00Z"
    },
    {
      id: "post-1-2",
      topic_id: "topic-1",
      author: {
        id: "user-7",
        name: "ArtTeacher",
        avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        role: "Moderator"
      },
      content: "Welcome to your art journey! For drawing, I recommend starting with a set of graphite pencils (2H, HB, 2B, 4B, 6B), a kneaded eraser, and a good sketchbook with at least 80lb paper. For painting, student-grade acrylics are a good starting point - Golden has a nice student line that's affordable but still good quality. A synthetic brush set with rounds and flats in various sizes will serve you well. Don't forget a palette (even a paper plate works for beginning) and a water container!",
      created_at: "2023-06-15T15:10:00Z"
    },
    {
      id: "post-1-3",
      topic_id: "topic-1",
      author: {
        id: "user-8",
        name: "MaterialsExpert",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
      },
      content: "One often overlooked item for beginners is good lighting! You don't need anything fancy, but a decent desk lamp that provides even, neutral-colored light will make a huge difference in how you see your work. As for actual art supplies, I second the recommendation for Golden acrylics. For paper, Strathmore 300 series is affordable and versatile for different media. Also, don't overlook the value of a good pencil sharpener - the Staedtler metal sharpeners are inexpensive and last forever.",
      created_at: "2023-06-15T16:45:00Z"
    }
  ]
};
