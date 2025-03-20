
export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  date: string;
  time: string;
  featured: boolean;
}

export const events: Event[] = [
  {
    id: "event-1",
    title: "Modern Art Exhibition: Future Perspectives",
    description: "Join us for an exclusive exhibition featuring cutting-edge works from emerging artists exploring themes of technology, sustainability, and human connection.",
    image: "https://images.unsplash.com/photo-1459749411175-04c550c00c9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    location: "ArtNexus Gallery, 123 Main St",
    date: "July 15, 2023",
    time: "6:00 PM - 9:00 PM",
    featured: true
  },
  {
    id: "event-2",
    title: "Interactive Sculpture Workshop",
    description: "Learn the art of sculpting with renowned artist Michael Chen. This hands-on workshop will guide you through creating your own small sculpture using clay and mixed media.",
    image: "https://images.unsplash.com/photo-1576698483491-8c43f0862543?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    location: "Community Arts Center, 45 Creative Ave",
    date: "July 22, 2023",
    time: "10:00 AM - 3:00 PM",
    featured: false
  },
  {
    id: "event-3",
    title: "Photography Exhibition: Urban Landscapes",
    description: "Experience the city through new eyes at this stunning photography exhibition featuring urban landscapes from photographers around the world.",
    image: "https://images.unsplash.com/photo-1514905552197-0610a4d8fd73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    location: "Light Box Gallery, 78 Vision Street",
    date: "August 5, 2023",
    time: "11:00 AM - 7:00 PM",
    featured: true
  },
  {
    id: "event-4",
    title: "Artists Meet & Greet",
    description: "Connect with local artists in an informal setting. Share ideas, discuss techniques, and build your creative network in this community event.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    location: "The Creative Hub, 22 Inspiration Blvd",
    date: "August 12, 2023",
    time: "7:00 PM - 10:00 PM",
    featured: false
  },
  {
    id: "event-5",
    title: "Annual Art Festival",
    description: "Our flagship event returns with over 100 artists, live performances, interactive installations, and food vendors. A celebration of all art forms!",
    image: "https://images.unsplash.com/photo-1486299267070-83823f5448dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    location: "Riverside Park",
    date: "September 8-10, 2023",
    time: "10:00 AM - 9:00 PM Daily",
    featured: true
  },
  {
    id: "event-6",
    title: "Digital Art Masterclass",
    description: "Learn advanced digital art techniques from industry professionals. This masterclass covers digital painting, animation basics, and portfolio development.",
    image: "https://images.unsplash.com/photo-1633355444132-695d5876cd00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    location: "Online (Zoom)",
    date: "September 15, 2023",
    time: "1:00 PM - 4:00 PM",
    featured: false
  }
];
