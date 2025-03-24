
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArtCard from '@/components/ArtCard';
import FeaturedArtist from '@/components/FeaturedArtist';
import CategoryFilter from '@/components/CategoryFilter';
import { 
  artists, 
  artworks, 
  getArtistById, 
  categories,
  getArtworksByArtist 
} from '@/data/mockData';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Filter artworks based on selected category
  const filteredArtworks = selectedCategory
    ? artworks.filter(artwork => artwork.categories.includes(selectedCategory))
    : artworks;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero section */}
      <section className="relative py-16 md:py-24 hero-gradient">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-artnexus-purple/40 to-artnexus-teal/40 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1561214115-f2f134cc4912?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Where Art Creates Connection
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Discover, connect, and collect art from incredible artists around the world.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                className="bg-white text-artnexus-purple hover:bg-white/90 text-lg px-8 py-6"
                asChild
              >
                <Link to="/discover">Explore Artwork</Link>
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                asChild
              >
                <Link to="/auth">Join ArtNexus</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured artworks section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Artwork</h2>
              <p className="text-muted-foreground">Discover the latest and most inspiring creations</p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link 
                to="/collections" 
                className="inline-flex items-center text-artnexus-teal hover:text-artnexus-purple"
              >
                My Collections
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
              <Link 
                to="/discover" 
                className="inline-flex items-center text-artnexus-purple hover:text-artnexus-teal"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 animate-fade-in">
            {filteredArtworks.slice(0, 8).map((artwork) => {
              const artist = getArtistById(artwork.artistId)!;
              return (
                <ArtCard key={artwork.id} artwork={artwork} artist={artist} />
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Featured artists section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Artists</h2>
              <p className="text-muted-foreground">Connect with talented creators from around the world</p>
            </div>
            <Link 
              to="/artists" 
              className="inline-flex items-center text-artnexus-purple hover:text-artnexus-teal mt-4 md:mt-0"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {artists.map((artist) => (
              <FeaturedArtist 
                key={artist.id} 
                artist={artist} 
                artworks={getArtworksByArtist(artist.id)} 
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 bg-gradient-to-r from-artnexus-purple to-artnexus-teal">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to share your creativity?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our community of artists and art enthusiasts. Upload your art, connect with others, and start your creative journey today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              size="lg" 
              className="bg-white text-artnexus-purple hover:bg-white/90 px-8"
              asChild
            >
              <Link to="/auth">Join ArtNexus</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8"
              asChild
            >
              <Link to="/collections">Manage Collections</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
