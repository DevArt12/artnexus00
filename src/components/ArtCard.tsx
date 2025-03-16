
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Eye } from 'lucide-react';
import { Artwork, Artist } from '@/data/mockData';

interface ArtCardProps {
  artwork: Artwork;
  artist: Artist;
  isExpanded?: boolean;
}

const ArtCard = ({ artwork, artist, isExpanded = false }: ArtCardProps) => {
  return (
    <div className="art-card group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
      <Link to={`/artwork/${artwork.id}`} className="block relative aspect-square overflow-hidden">
        <img 
          src={artwork.image} 
          alt={artwork.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full">
            <h3 className="text-white font-bold truncate">{artwork.title}</h3>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <Link to={`/artist/${artist.id}`} className="flex items-center space-x-2">
            <img 
              src={artist.profileImage} 
              alt={artist.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm font-medium">{artist.name}</span>
          </Link>
          <div className="flex items-center space-x-3 text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span className="text-xs">{artwork.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{artwork.comments}</span>
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {artwork.description}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {artwork.categories.map((category) => (
                <Link 
                  key={category} 
                  to={`/discover?category=${category}`}
                  className="text-xs bg-muted px-2 py-1 rounded-full hover:bg-muted/80 transition-colors"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtCard;
