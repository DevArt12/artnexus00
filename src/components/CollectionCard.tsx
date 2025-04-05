import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { X, Edit2, MoreHorizontal } from 'lucide-react';
import { artworks } from '@/data/mockData';
import { toast } from 'sonner';
import { collectionsService, supabase } from '@/integrations/supabase/client';

interface CollectionCardProps {
  collection: {
    id: string;
    name: string;
    description: string | null;
    cover_image: string | null;
    created_at: string;
    collection_items: {
      id: string;
      artwork_id: string;
    }[];
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

const CollectionCard = ({ collection, onEdit, onDelete, onUpdate }: CollectionCardProps) => {
  const navigate = useNavigate();
  const [artworkSearchQuery, setArtworkSearchQuery] = useState('');
  const [isAddingArtwork, setIsAddingArtwork] = useState(false);
  
  // Extract artwork IDs from collection items
  const artworkIds = collection.collection_items?.map(item => item.artwork_id) || [];
  const coverImage = collection.cover_image || "https://images.unsplash.com/photo-1579783483458-83d02161294e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80";
  
  // Filter artworks based on search query
  const filteredArtworks = artworkSearchQuery.trim() === ''
    ? artworks
    : artworks.filter(artwork => 
        artwork.title.toLowerCase().includes(artworkSearchQuery.toLowerCase()) ||
        artwork.description.toLowerCase().includes(artworkSearchQuery.toLowerCase()) ||
        artwork.categories.some(cat => cat.toLowerCase().includes(artworkSearchQuery.toLowerCase()))
      );
  
  const addArtworkToCollection = async (artworkId: string) => {
    try {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        toast.error("You must be logged in to add artwork to collections");
        return;
      }
      
      const { error } = await collectionsService.addToCollection(data.user.id, collection.id, artworkId);
      if (error) throw error;
      
      toast.success("Artwork added to collection");
      onUpdate();
    } catch (error) {
      console.error("Error adding artwork to collection:", error);
      toast.error("Failed to add artwork to collection");
    }
  };
  
  const removeArtworkFromCollection = async (artworkId: string) => {
    try {
      const { error } = await collectionsService.removeFromCollection(collection.id, artworkId);
      if (error) throw error;
      
      toast.success("Artwork removed from collection");
      onUpdate();
    } catch (error) {
      console.error("Error removing artwork from collection:", error);
      toast.error("Failed to remove artwork from collection");
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg">
      <div 
        className="h-40 bg-center bg-cover"
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        <div className="w-full h-full bg-black/30 p-4 flex flex-col justify-between">
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/20 hover:bg-black/40 text-white">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(collection.id)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Collection
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-500 focus:text-red-500"
                  onClick={() => onDelete(collection.id)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Delete Collection
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white">{collection.name}</h3>
            <p className="text-white/80 text-sm">
              {artworkIds.length} {artworkIds.length === 1 ? 'artwork' : 'artworks'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{collection.description}</p>
        
        <Tabs defaultValue="view" onValueChange={(value) => setIsAddingArtwork(value === 'add')}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="view" className="flex-1">View Collection</TabsTrigger>
            <TabsTrigger value="add" className="flex-1">Add Artwork</TabsTrigger>
          </TabsList>
          
          <TabsContent value="view">
            {artworkIds.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No artworks yet. Add some to your collection!
              </p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {artworkIds.slice(0, 6).map((artworkId) => {
                    const artwork = artworks.find(a => a.id === artworkId);
                    if (!artwork) return null;
                    
                    return (
                      <div 
                        key={artworkId} 
                        className="aspect-square rounded overflow-hidden relative group cursor-pointer"
                        onClick={() => navigate(`/artwork/${artworkId}`)}
                      >
                        <img 
                          src={artwork.image} 
                          alt={artwork.title} 
                          className="w-full h-full object-cover"
                        />
                        <button 
                          className="absolute top-1 right-1 h-6 w-6 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeArtworkFromCollection(artworkId);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                {artworkIds.length > 6 && (
                  <p className="text-center text-sm text-muted-foreground">
                    +{artworkIds.length - 6} more artworks
                  </p>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate(`/ar-view/${artworkIds[0]}`)}
                  disabled={artworkIds.length === 0}
                >
                  View in AR
                </Button>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="add">
            <div className="space-y-4">
              <Input
                placeholder="Search artworks..."
                value={artworkSearchQuery}
                onChange={(e) => setArtworkSearchQuery(e.target.value)}
                className="mb-4"
              />
              
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {filteredArtworks.map((artwork) => (
                    <div 
                      key={artwork.id}
                      className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                      onClick={() => addArtworkToCollection(artwork.id)}
                    >
                      <img 
                        src={artwork.image} 
                        alt={artwork.title} 
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{artwork.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {artwork.categories.join(', ')}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        disabled={artworkIds.includes(artwork.id)}
                      >
                        {artworkIds.includes(artwork.id) ? 'Added' : 'Add'}
                      </Button>
                    </div>
                  ))}
                  
                  {filteredArtworks.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      No artworks found matching your search
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CollectionCard;
