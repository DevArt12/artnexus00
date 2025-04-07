
import { Artwork } from '@/data/mockData';
import { motion } from 'framer-motion';
import { IndianRupee } from 'lucide-react';

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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {artworks.map((artwork, index) => (
          <motion.div 
            key={artwork.id} 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onSelectArtwork(artwork.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="aspect-square rounded-md overflow-hidden mb-2 bg-gray-100 dark:bg-gray-700">
              <img 
                src={artwork.image} 
                alt={artwork.title} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="text-sm font-medium truncate">{artwork.title}</p>
            <p className="text-xs text-muted-foreground truncate">{artwork.medium || artwork.categories.join(', ')}</p>
            {artwork.price && (
              <p className="text-xs font-medium text-artnexus-purple flex items-center mt-1">
                <IndianRupee className="h-3 w-3 mr-1" />
                {artwork.price.replace('$', '₹')}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedArtworks;
