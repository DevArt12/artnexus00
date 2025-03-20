
export interface Performance {
  id: string;
  title: string;
  description: string;
  image: string;
  artist: string;
  date: string;
  video_url: string;
  category?: string;
}

export const performances: Performance[] = [
  {
    id: "perf-1",
    title: "Dancing Through Time",
    description: "A mesmerizing contemporary dance performance that explores the relationship between movement and time, featuring innovative choreography and expressive dancers.",
    image: "https://images.unsplash.com/photo-1545128485-c400ce7f6a5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    artist: "Elena Marquez Dance Company",
    date: "June 12, 2023",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "dance"
  },
  {
    id: "perf-2",
    title: "Symphony of Colors",
    description: "An immersive musical experience where classical compositions meet visual art projections, creating a multi-sensory journey for the audience.",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    artist: "Metro Symphony Orchestra",
    date: "July 8, 2023",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "music"
  },
  {
    id: "perf-3",
    title: "The Unspoken Word",
    description: "A powerful spoken word performance addressing social issues through poetic expression, delivered by award-winning poets from across the country.",
    image: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    artist: "Collective Voice Poetry Group",
    date: "July 22, 2023",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "poetry"
  },
  {
    id: "perf-4",
    title: "Rhythms of the World",
    description: "A celebration of global music traditions featuring instruments and rhythms from Africa, Asia, Europe, and the Americas in one captivating performance.",
    image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    artist: "Global Beats Ensemble",
    date: "August 5, 2023",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "music"
  },
  {
    id: "perf-5",
    title: "Modern Myths",
    description: "An innovative theater performance reimagining ancient myths through a contemporary lens, with stunning visuals and original music compositions.",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    artist: "Avant-Garde Theater Company",
    date: "August 19, 2023",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "theater"
  },
  {
    id: "perf-6",
    title: "Fusion Dance Experiment",
    description: "A groundbreaking dance performance that blends ballet, hip-hop, and traditional cultural dances into a unique expression of movement and storytelling.",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    artist: "Cross-Cultural Dance Project",
    date: "September 2, 2023",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "dance"
  }
];
