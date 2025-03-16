
import { Link } from 'react-router-dom';
import { Artist, Artwork } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface FeaturedArtistProps {
  artist: Artist;
  artworks: Artwork[];
}

const FeaturedArtist = ({ artist, artworks }: FeaturedArtistProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-all">
      <div className="h-24 md:h-32 relative">
        <img 
          src={artist.coverImage} 
          alt={`${artist.name}'s cover`} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4 relative">
        <div className="flex items-end -mt-12 mb-4">
          <img 
            src={artist.profileImage} 
            alt={artist.name} 
            className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white dark:border-gray-800 object-cover"
          />
          
          <div className="ml-4 flex-grow">
            <h3 className="text-lg font-bold">{artist.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-3 w-3 mr-1" />
              <span>{artist.followers.toLocaleString()} followers</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="hover:text-artnexus-purple hover:border-artnexus-purple transition-colors"
          >
            Follow
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {artist.bio}
        </p>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          {artworks.slice(0, 3).map((artwork) => (
            <Link key={artwork.id} to={`/artwork/${artwork.id}`} className="block aspect-square rounded-md overflow-hidden">
              <img 
                src={artwork.image} 
                alt={artwork.title} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </Link>
          ))}
        </div>
        
        <Link to={`/artist/${artist.id}`} className="text-artnexus-purple hover:text-artnexus-teal text-sm font-medium transition-colors">
          View Full Portfolio →
        </Link>
      </div>
    </div>
  );
};

export default FeaturedArtist;
