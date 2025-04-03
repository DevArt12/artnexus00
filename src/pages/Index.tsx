
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeaturedArtist from '@/components/FeaturedArtist';
import ArtCard from '@/components/ArtCard';
import ARExploreSection from '@/components/ar/ARExploreSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Import mock data as fallback
import { artworks as mockArtworks, artists, featuredArtists, getArtistById } from '@/data/mockData';

const fetchFeaturedArtworks = async () => {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .select(`
        *,
        profiles:artist_id(*)
      `)
      .order('created_at', { ascending: false })
      .limit(8);
    
    if (error) throw error;
    
    if (data && data.length) {
      // Format for our app's structure
      return data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        image: item.image,
        categories: [item.category],
        artistId: item.artist_id,
        artist: item.profiles ? {
          id: item.profiles.id,
          name: item.profiles.username,
          profileImage: item.profiles.avatar,
        } : undefined
      }));
    }
    
    // Fallback to mock data
    return mockArtworks.slice(0, 8);
  } catch (error) {
    console.error('Error fetching featured artworks:', error);
    return mockArtworks.slice(0, 8);
  }
};

const Index = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [
    'https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1577720580479-7d839d829c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1590598016995-e7c63e6b5ba9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  ];
  
  // Fetch featured artworks with React Query
  const { data: featuredArtworks, isLoading } = useQuery({
    queryKey: ['featuredArtworks'],
    queryFn: fetchFeaturedArtworks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Use mock data if still loading or query failed
  const artworksToShow = featuredArtworks || mockArtworks.slice(0, 8);
  
  // Cycle through hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroImages.length]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt="Featured artwork"
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />
          </div>
        ))}
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            ArtNexus
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-white mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explore, experience, and collect contemporary art in new ways
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button asChild size="lg" className="bg-artnexus-purple hover:bg-artnexus-purple/90">
              <Link to="/discover">Explore Artwork</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white">
              <Link to="/marketplace">Visit Marketplace</Link>
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* AR Explore Section */}
      <ARExploreSection />
      
      {/* Featured Artworks Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Artwork</h2>
            <Button asChild variant="outline" className="group">
              <Link to="/discover" className="flex items-center">
                View All 
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              // Loading skeletons
              Array(8).fill(null).map((_, index) => (
                <Card key={index}>
                  <Skeleton className="h-64 w-full rounded-t-lg" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : (
              artworksToShow.map((artwork) => (
                <ArtCard
                  key={artwork.id}
                  artwork={artwork}
                  artist={artwork.artist || getArtistById(artwork.artistId)!}
                />
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Featured Artists Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Artists</h2>
            <Button asChild variant="outline" className="group">
              <Link to="/discover" className="flex items-center">
                Explore Artists
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArtists.map((artistId) => {
              const artist = artists.find((a) => a.id === artistId);
              if (!artist) return null;
              return <FeaturedArtist key={artist.id} artist={artist} />;
            })}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-artnexus-purple text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Art Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join ArtNexus to discover new artists, collect artwork, and connect with a community of art enthusiasts.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-white text-artnexus-purple hover:bg-gray-100">
            <Link to="/auth">Sign Up Now</Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
