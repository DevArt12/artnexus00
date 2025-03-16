
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArtCard from '@/components/ArtCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getArtistById, 
  getArtworksByArtist,
  Artist,
  Artwork
} from '@/data/mockData';
import { Users, MapPin, Globe, Instagram, Twitter, Facebook } from 'lucide-react';

const ArtistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  
  useEffect(() => {
    if (id) {
      const foundArtist = getArtistById(id);
      if (foundArtist) {
        setArtist(foundArtist);
        setArtworks(getArtworksByArtist(id));
      }
    }
  }, [id]);
  
  if (!artist) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Artist not found</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Cover image */}
        <div className="h-56 md:h-72 lg:h-80 rounded-lg overflow-hidden relative mb-8">
          <img 
            src={artist.coverImage} 
            alt={`${artist.name}'s cover`} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Artist info */}
        <div className="flex flex-col md:flex-row md:items-end -mt-20 mb-12 relative">
          <img 
            src={artist.profileImage} 
            alt={artist.name} 
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-900 object-cover z-10 mx-auto md:mx-0"
          />
          
          <div className="mt-4 md:mt-0 md:ml-6 flex-grow text-center md:text-left">
            <h1 className="text-3xl font-bold">{artist.name}</h1>
            <div className="flex items-center justify-center md:justify-start mt-2 space-x-4 text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{artist.location}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{artist.followers.toLocaleString()} followers</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 flex justify-center md:justify-end space-x-4">
            <Button 
              variant={isFollowing ? "secondary" : "default"}
              size="sm"
              className={isFollowing ? "" : "bg-artnexus-purple hover:bg-artnexus-purple/90"}
              onClick={() => setIsFollowing(!isFollowing)}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
            <Button variant="outline" size="sm">
              Message
            </Button>
          </div>
        </div>
        
        {/* Social links and bio */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
            {artist.website && (
              <a 
                href={`https://${artist.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-muted-foreground hover:text-artnexus-purple transition-colors"
              >
                <Globe className="h-4 w-4 mr-1" />
                <span>{artist.website}</span>
              </a>
            )}
            {artist.social?.instagram && (
              <a 
                href={`https://instagram.com/${artist.social.instagram.replace('@', '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-muted-foreground hover:text-artnexus-purple transition-colors"
              >
                <Instagram className="h-4 w-4 mr-1" />
                <span>{artist.social.instagram}</span>
              </a>
            )}
            {artist.social?.twitter && (
              <a 
                href={`https://twitter.com/${artist.social.twitter.replace('@', '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-muted-foreground hover:text-artnexus-purple transition-colors"
              >
                <Twitter className="h-4 w-4 mr-1" />
                <span>{artist.social.twitter}</span>
              </a>
            )}
            {artist.social?.facebook && (
              <a 
                href={`https://facebook.com/${artist.social.facebook}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-muted-foreground hover:text-artnexus-purple transition-colors"
              >
                <Facebook className="h-4 w-4 mr-1" />
                <span>{artist.social.facebook}</span>
              </a>
            )}
          </div>
          
          <p className="text-muted-foreground max-w-3xl mx-auto md:mx-0">
            {artist.bio}
          </p>
        </div>
        
        {/* Artist content tabs */}
        <Tabs defaultValue="artwork" className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="artwork" className="flex-1">Artwork</TabsTrigger>
            <TabsTrigger value="collections" className="flex-1">Collections</TabsTrigger>
            <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="artwork" className="animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artworks.map((artwork) => (
                <ArtCard 
                  key={artwork.id} 
                  artwork={artwork} 
                  artist={artist} 
                  isExpanded={true}
                />
              ))}
              
              {artworks.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No artwork available</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="collections" className="animate-fade-in">
            <div className="text-center py-12">
              <p className="text-muted-foreground">No collections available</p>
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="animate-fade-in">
            <div className="max-w-3xl">
              <h3 className="text-xl font-bold mb-4">About {artist.name}</h3>
              <p className="text-muted-foreground mb-6">
                {artist.bio}
              </p>
              
              <h4 className="text-lg font-semibold mb-2">Location</h4>
              <p className="text-muted-foreground mb-6">{artist.location}</p>
              
              <h4 className="text-lg font-semibold mb-2">Member since</h4>
              <p className="text-muted-foreground mb-6">January 2023</p>
              
              <h4 className="text-lg font-semibold mb-2">Contact</h4>
              <p className="text-muted-foreground">
                For inquiries, please use the message feature or contact through social media.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default ArtistProfile;
