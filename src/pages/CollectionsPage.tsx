
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Folder, Plus, Search, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionsService, supabase } from '@/integrations/supabase/client';
import CollectionCard from '@/components/CollectionCard';

const CollectionsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [editingCollection, setEditingCollection] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);
  
  // Check for authentication status
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      
      // Redirect to login if not authenticated
      if (data.session === null) {
        toast.error("Please sign in to manage your collections");
        navigate('/auth');
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        if (!session) {
          navigate('/auth');
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  // Fetch collections
  const { data: collections, isLoading, isError } = useQuery({
    queryKey: ['collections'],
    queryFn: collectionsService.getUserCollections,
    enabled: isAuthenticated === true,
  });
  
  // Create Collection Mutation
  const createCollectionMutation = useMutation({
    mutationFn: ({ name, description }: { name: string, description: string }) => 
      collectionsService.createCollection(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      setNewCollectionName('');
      setNewCollectionDescription('');
      toast.success("Collection created successfully");
    },
    onError: (error) => {
      console.error("Error creating collection:", error);
      toast.error("Failed to create collection");
    }
  });
  
  // Update Collection Mutation
  const updateCollectionMutation = useMutation({
    mutationFn: ({ id, name, description }: { id: string, name: string, description: string }) => 
      collectionsService.updateCollection(id, { name, description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      setEditingCollection(null);
      toast.success("Collection updated successfully");
    },
    onError: (error) => {
      console.error("Error updating collection:", error);
      toast.error("Failed to update collection");
    }
  });
  
  // Delete Collection Mutation
  const deleteCollectionMutation = useMutation({
    mutationFn: (id: string) => collectionsService.deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast.success("Collection deleted");
    },
    onError: (error) => {
      console.error("Error deleting collection:", error);
      toast.error("Failed to delete collection");
    }
  });
  
  // Handle create collection
  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) {
      toast.error("Please enter a collection name");
      return;
    }
    
    createCollectionMutation.mutate({
      name: newCollectionName,
      description: newCollectionDescription
    });
  };
  
  // Handle update collection
  const handleUpdateCollection = () => {
    if (!editingCollection) return;
    
    updateCollectionMutation.mutate({
      id: editingCollection.id,
      name: editingCollection.name,
      description: editingCollection.description
    });
  };
  
  // Filter collections based on search query
  const filteredCollections = !collections?.data 
    ? [] 
    : collections.data.filter(collection => 
        collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (collection.description && collection.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  
  // Loading or error states
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Checking authentication...</span>
      </div>
    );
  }
  
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
                <Button 
                  onClick={handleCreateCollection}
                  disabled={createCollectionMutation.isPending}
                >
                  {createCollectionMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : 'Create Collection'}
                </Button>
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
        
        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
            <p>Loading your collections...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-16 bg-muted/30 rounded-lg">
            <p className="text-red-500">Failed to load collections. Please try again later.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['collections'] })}
            >
              Retry
            </Button>
          </div>
        ) : filteredCollections.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-lg">
            <Folder className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No collections found</h3>
            <p className="text-muted-foreground mb-6">
              {!collections?.data || collections.data.length === 0
                ? "Create your first collection to start organizing your favorite art"
                : "No collections match your search. Try a different search term."}
            </p>
            
            {(!collections?.data || collections.data.length === 0) && (
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
              <CollectionCard
                key={collection.id}
                collection={collection}
                onEdit={(id) => {
                  const collectionToEdit = collections?.data?.find(c => c.id === id);
                  if (collectionToEdit) {
                    setEditingCollection({
                      id: collectionToEdit.id,
                      name: collectionToEdit.name,
                      description: collectionToEdit.description || ''
                    });
                  }
                }}
                onDelete={(id) => deleteCollectionMutation.mutate(id)}
                onUpdate={() => queryClient.invalidateQueries({ queryKey: ['collections'] })}
              />
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
            <Button 
              onClick={handleUpdateCollection}
              disabled={updateCollectionMutation.isPending}
            >
              {updateCollectionMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default CollectionsPage;
