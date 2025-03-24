
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Folder, X, Edit2, MoreHorizontal, Search } from 'lucide-react';
import { toast } from "sonner";
import { Artwork, artworks } from '@/data/mockData';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface Collection {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  artworks: string[]; // artwork IDs
  createdAt: string;
}

const Collections = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [showAddArtworkDialog, setShowAddArtworkDialog] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>(artworks);
  const [artworkSearchQuery, setArtworkSearchQuery] = useState('');
  
  // Load collections from localStorage on component mount
  useEffect(() => {
    const savedCollections = localStorage.getItem('userCollections');
    if (savedCollections) {
      try {
        setCollections(JSON.parse(savedCollections));
      } catch (error) {
        console.error("Error parsing saved collections:", error);
        toast.error("Error loading your collections");
      }
    } else {
      // Create default collection if none exist
      const defaultCollection: Collection = {
        id: crypto.randomUUID(),
        name: "My First Collection",
        description: "A place to save your favorite artworks",
        coverImage: artworks[0].image,
        artworks: [artworks[0].id, artworks[1].id],
        createdAt: new Date().toISOString()
      };
      
      setCollections([defaultCollection]);
      localStorage.setItem('userCollections', JSON.stringify([defaultCollection]));
    }
  }, []);
  
  // Filter artworks when search query changes
  useEffect(() => {
    if (artworkSearchQuery.trim() === '') {
      setFilteredArtworks(artworks);
    } else {
      const searchTerm = artworkSearchQuery.toLowerCase();
      setFilteredArtworks(
        artworks.filter(artwork => 
          artwork.title.toLowerCase().includes(searchTerm) ||
          artwork.description.toLowerCase().includes(searchTerm) ||
          artwork.categories.some(cat => cat.toLowerCase().includes(searchTerm))
        )
      );
    }
  }, [artworkSearchQuery]);
  
  // Save collections to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userCollections', JSON.stringify(collections));
  }, [collections]);
  
  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) {
      toast.error("Please enter a collection name");
      return;
    }
    
    const newCollection: Collection = {
      id: crypto.randomUUID(),
      name: newCollectionName,
      description: newCollectionDescription,
      coverImage: "https://images.unsplash.com/photo-1579783483458-83d02161294e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80", // Default image
      artworks: [],
      createdAt: new Date().toISOString()
    };
    
    setCollections([...collections, newCollection]);
    setNewCollectionName('');
    setNewCollectionDescription('');
    toast.success("Collection created successfully");
  };
  
  const handleUpdateCollection = () => {
    if (!editingCollection) return;
    
    setCollections(collections.map(collection => 
      collection.id === editingCollection.id ? editingCollection : collection
    ));
    
    setEditingCollection(null);
    toast.success("Collection updated successfully");
  };
  
  const handleDeleteCollection = (collectionId: string) => {
    setCollections(collections.filter(collection => collection.id !== collectionId));
    toast.success("Collection deleted");
  };
  
  const openAddArtworkDialog = (collectionId: string) => {
    setSelectedCollectionId(collectionId);
    setShowAddArtworkDialog(true);
  };
  
  const addArtworkToCollection = (artworkId: string) => {
    if (!selectedCollectionId) return;
    
    setCollections(collections.map(collection => {
      if (collection.id === selectedCollectionId) {
        // Only add if not already in collection
        if (!collection.artworks.includes(artworkId)) {
          const updatedArtworks = [...collection.artworks, artworkId];
          // Update cover image if this is the first artwork
          const updatedCover = collection.artworks.length === 0 
            ? artworks.find(a => a.id === artworkId)?.image || collection.coverImage
            : collection.coverImage;
            
          return {
            ...collection,
            artworks: updatedArtworks,
            coverImage: updatedCover
          };
        }
      }
      return collection;
    }));
    
    toast.success("Artwork added to collection");
  };
  
  const removeArtworkFromCollection = (collectionId: string, artworkId: string) => {
    setCollections(collections.map(collection => {
      if (collection.id === collectionId) {
        const updatedArtworks = collection.artworks.filter(id => id !== artworkId);
        // Update cover image if removing the artwork that was the cover
        const artworkToRemove = artworks.find(a => a.id === artworkId);
        let updatedCover = collection.coverImage;
        
        if (artworkToRemove && collection.coverImage === artworkToRemove.image) {
          // Set a new cover image from remaining artworks, or use default
          updatedCover = updatedArtworks.length > 0
            ? artworks.find(a => a.id === updatedArtworks[0])?.image || collection.coverImage
            : "https://images.unsplash.com/photo-1579783483458-83d02161294e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80";
        }
        
        return {
          ...collection,
          artworks: updatedArtworks,
          coverImage: updatedCover
        };
      }
      return collection;
    }));
    
    toast.success("Artwork removed from collection");
  };
  
  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Art Collections</h1>
            <p className="text-muted-foreground">Organize and curate your favorite artworks</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0">
                <Plus className="mr-2 h-4 w-4" />
                Create Collection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Collection</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name">Collection Name</label>
                  <Input
                    id="name"
                    placeholder="e.g., Abstract Favorites"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description">Description (optional)</label>
                  <Input
                    id="description"
                    placeholder="A brief description of your collection"
                    value={newCollectionDescription}
                    onChange={(e) => setNewCollectionDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleCreateCollection}>Create Collection</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search collections..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {filteredCollections.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-lg">
            <Folder className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No collections found</h3>
            <p className="text-muted-foreground mb-6">
              {collections.length === 0
                ? "Create your first collection to start organizing your favorite art"
                : "No collections match your search. Try a different search term."}
            </p>
            
            {collections.length === 0 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Collection
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Collection</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="name">Collection Name</label>
                      <Input
                        id="name"
                        placeholder="e.g., Abstract Favorites"
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="description">Description (optional)</label>
                      <Input
                        id="description"
                        placeholder="A brief description of your collection"
                        value={newCollectionDescription}
                        onChange={(e) => setNewCollectionDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleCreateCollection}>Create Collection</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.map((collection) => (
              <div 
                key={collection.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg"
              >
                <div 
                  className="h-40 bg-center bg-cover"
                  style={{ backgroundImage: `url(${collection.coverImage})` }}
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
                          <DropdownMenuItem onClick={() => setEditingCollection(collection)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit Collection
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-500 focus:text-red-500"
                            onClick={() => handleDeleteCollection(collection.id)}
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
                        {collection.artworks.length} {collection.artworks.length === 1 ? 'artwork' : 'artworks'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{collection.description}</p>
                  
                  <Tabs defaultValue="view">
                    <TabsList className="w-full mb-4">
                      <TabsTrigger value="view" className="flex-1">View Collection</TabsTrigger>
                      <TabsTrigger value="add" className="flex-1">Add Artwork</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="view">
                      {collection.artworks.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No artworks yet. Add some to your collection!
                        </p>
                      ) : (
                        <>
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            {collection.artworks.slice(0, 6).map((artworkId) => {
                              const artwork = artworks.find(a => a.id === artworkId);
                              if (!artwork) return null;
                              
                              return (
                                <div 
                                  key={artworkId} 
                                  className="aspect-square rounded overflow-hidden relative group"
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
                                      removeArtworkFromCollection(collection.id, artworkId);
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                          
                          {collection.artworks.length > 6 && (
                            <p className="text-center text-sm text-muted-foreground">
                              +{collection.artworks.length - 6} more artworks
                            </p>
                          )}
                          
                          <Button 
                            variant="outline" 
                            className="w-full mt-4"
                            onClick={() => navigate(`/ar-view/${collection.artworks[0]}`)}
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
                                  disabled={collection.artworks.includes(artwork.id)}
                                >
                                  {collection.artworks.includes(artwork.id) ? 'Added' : 'Add'}
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
            ))}
          </div>
        )}
      </div>
      
      {/* Edit Collection Dialog */}
      <Dialog open={!!editingCollection} onOpenChange={(open) => !open && setEditingCollection(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-name">Collection Name</label>
              <Input
                id="edit-name"
                value={editingCollection?.name || ''}
                onChange={(e) => setEditingCollection(prev => prev ? {...prev, name: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-description">Description</label>
              <Input
                id="edit-description"
                value={editingCollection?.description || ''}
                onChange={(e) => setEditingCollection(prev => prev ? {...prev, description: e.target.value} : null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCollection(null)}>Cancel</Button>
            <Button onClick={handleUpdateCollection}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Collections;
