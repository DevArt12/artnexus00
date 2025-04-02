
import { Artwork } from '@/data/mockData';

interface SuggestedArtworksProps {
  artworks: Artwork[];
  onSelectArtwork: (artworkId: string) => void;
  title?: string;
}

const SuggestedArtworks = ({ 
  artworks, 
  onSelectArtwork,
  title = "Try More Artworks in AR"
}: SuggestedArtworksProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {artworks.map((artwork) => (
          <div 
            key={artwork.id} 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectArtwork(artwork.id)}
          >
            <div className="aspect-square rounded-md overflow-hidden mb-2">
              <img 
                src={artwork.image} 
                alt={artwork.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm font-medium truncate">{artwork.title}</p>
            <p className="text-xs text-muted-foreground truncate">{artwork.categories.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedArtworks;
