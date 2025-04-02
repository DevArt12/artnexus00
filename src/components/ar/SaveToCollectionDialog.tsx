
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { List } from 'lucide-react';
import { toast } from "sonner";

interface Collection {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  artworks: string[];
  createdAt: string;
}

interface SaveToCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artworkId: string;
  collections: Collection[];
  onSaveToCollection: (collectionId: string) => void;
}

const SaveToCollectionDialog = ({
  open,
  onOpenChange,
  artworkId,
  collections,
  onSaveToCollection
}: SaveToCollectionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save to Collection</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {collections.length === 0 ? (
            <div className="text-center py-8">
              <List className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">You don't have any collections yet.</p>
              <Button 
                asChild
                onClick={() => onOpenChange(false)}
              >
                <a href="/collections">Create Collection</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {collections.map(collection => (
                <div 
                  key={collection.id}
                  className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                  onClick={() => onSaveToCollection(collection.id)}
                >
                  <div className="h-12 w-12 rounded overflow-hidden">
                    <img 
                      src={collection.coverImage} 
                      alt={collection.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{collection.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {collection.artworks.length} {collection.artworks.length === 1 ? 'artwork' : 'artworks'}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    {collection.artworks.includes(artworkId) ? 'Added' : 'Add'}
                  </Button>
                </div>
              ))}
              
              <div className="pt-2 text-center">
                <Button variant="outline" asChild>
                  <a href="/collections">Manage Collections</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaveToCollectionDialog;
