
export interface ArtClass {
  id: string;
  title: string;
  description: string;
  image: string;
  instructor: {
    id: string;
    name: string;
    photo: string;
  };
  price: string;
  duration: string;
  level: string;
  category: string;
  video_url: string;
}

export const artClasses: ArtClass[] = [
  {
    id: "class-1",
    title: "Watercolor Landscapes for Beginners",
    description: "Learn the fundamentals of watercolor painting with a focus on capturing beautiful landscapes. This course covers basic techniques, color mixing, and composition.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    instructor: {
      id: "inst-1",
      name: "Maria Johnson",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    price: "$49.99",
    duration: "4 weeks",
    level: "beginner",
    category: "painting",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "class-2",
    title: "Digital Illustration Masterclass",
    description: "Master digital illustration techniques using industry-standard software. Learn character design, color theory, and digital painting workflows.",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    instructor: {
      id: "inst-2",
      name: "David Chen",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    price: "$79.99",
    duration: "8 weeks",
    level: "intermediate",
    category: "digital",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "class-3",
    title: "Sculpture Fundamentals",
    description: "Explore three-dimensional art through various sculpting techniques and materials. Learn about form, texture, and spatial relationships.",
    image: "https://images.unsplash.com/photo-1554755229-ca4470e07232?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    instructor: {
      id: "inst-3",
      name: "Sophia Rodriguez",
      photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    price: "$89.99",
    duration: "6 weeks",
    level: "beginner",
    category: "sculpture",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "class-4",
    title: "Advanced Oil Painting Techniques",
    description: "Take your oil painting skills to the next level with advanced techniques. Focus on realistic portraiture, lighting, and detailed textures.",
    image: "https://images.unsplash.com/photo-1579762593175-20226054cad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    instructor: {
      id: "inst-4",
      name: "Michael Thompson",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    price: "$99.99",
    duration: "10 weeks",
    level: "advanced",
    category: "painting",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "class-5",
    title: "Photography Basics",
    description: "Learn the fundamentals of photography including composition, exposure, and basic editing techniques. Suitable for anyone with a camera or smartphone.",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    instructor: {
      id: "inst-5",
      name: "Emma Wilson",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    price: "$59.99",
    duration: "6 weeks",
    level: "beginner",
    category: "photography",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "class-6",
    title: "Abstract Art Workshop",
    description: "Unleash your creativity with this abstract art workshop. Explore non-representational forms, colors, and techniques to express emotions and ideas.",
    image: "https://images.unsplash.com/photo-1541512416066-48200a266b1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    instructor: {
      id: "inst-6",
      name: "Robert Taylor",
      photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    price: "$69.99",
    duration: "4 weeks",
    level: "intermediate",
    category: "painting",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "class-7",
    title: "Ceramic Pottery for Beginners",
    description: "Get your hands dirty and learn the art of ceramic pottery. This course covers hand-building techniques, wheel throwing, glazing, and firing.",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    instructor: {
      id: "inst-7",
      name: "Lisa Chang",
      photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    price: "$79.99",
    duration: "8 weeks",
    level: "beginner",
    category: "crafts",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "class-8",
    title: "Portrait Drawing Masterclass",
    description: "Master the art of portrait drawing with techniques for capturing likeness, proportion, and expression. Work with graphite, charcoal, and other drawing media.",
    image: "https://images.unsplash.com/photo-1582201957424-5bb68eb65836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    instructor: {
      id: "inst-8",
      name: "James Wilson",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    price: "$89.99",
    duration: "6 weeks",
    level: "intermediate",
    category: "drawing",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }
];
