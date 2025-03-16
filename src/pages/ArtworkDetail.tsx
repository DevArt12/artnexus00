
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArtCard from '@/components/ArtCard';
import { 
  getArtworkById, 
  getArtistById, 
  getCommentsByArtwork,
  getArtworksByArtist,
  Artwork,
  Artist,
  Comment
} from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Calendar, 
  Ruler 
} from 'lucide-react';

const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedArtworks, setRelatedArtworks] = useState<Artwork[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  useEffect(() => {
    if (id) {
      const foundArtwork = getArtworkById(id);
      if (foundArtwork) {
        setArtwork(foundArtwork);
        
        const foundArtist = getArtistById(foundArtwork.artistId);
        if (foundArtist) {
          setArtist(foundArtist);
          
          // Get related artworks (by same artist, excluding current artwork)
          const artistArtworks = getArtworksByArtist(foundArtist.id)
            .filter(a => a.id !== id);
          setRelatedArtworks(artistArtworks);
        }
        
        setComments(getCommentsByArtwork(id));
      }
    }
  }, [id]);
  
  const handleAddComment = () => {
    if (!commentText.trim()) return;
    
    const newComment: Comment = {
      id: `temp-${Date.now()}`,
      artworkId: id!,
      userId: 'current-user',
      userName: 'You',
      userImage: 'https://randomuser.me/api/portraits/women/90.jpg',
      content: commentText,
      createdAt: new Date().toISOString(),
    };
    
    setComments([newComment, ...comments]);
    setCommentText('');
  };
  
  if (!artwork || !artist) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Artwork not found</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Artwork image */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
              <img 
                src={artwork.image} 
                alt={artwork.title} 
                className="w-full h-auto object-contain max-h-[70vh]"
              />
              
              <div className="p-4 flex justify-between items-center">
                <div className="flex space-x-4">
                  <button 
                    className={`flex items-center space-x-1 ${isLiked ? 'text-artnexus-rose' : 'text-muted-foreground'}`}
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-artnexus-rose' : ''}`} />
                    <span>{isLiked ? artwork.likes + 1 : artwork.likes}</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 text-muted-foreground">
                    <MessageCircle className="h-5 w-5" />
                    <span>{comments.length}</span>
                  </button>
                </div>
                
                <div className="flex space-x-4">
                  <button className="text-muted-foreground hover:text-foreground">
                    <Share2 className="h-5 w-5" />
                  </button>
                  
                  <button 
                    className={`${isSaved ? 'text-artnexus-amber' : 'text-muted-foreground'}`}
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-artnexus-amber' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Comments section */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-6">Comments</h3>
              
              <div className="mb-6">
                <Textarea
                  placeholder="Add a comment..."
                  className="resize-none mb-2"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button 
                  onClick={handleAddComment} 
                  disabled={!commentText.trim()}
                  className="bg-artnexus-purple hover:bg-artnexus-purple/90"
                >
                  Post Comment
                </Button>
              </div>
              
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-4">
                    <img 
                      src={comment.userImage} 
                      alt={comment.userName} 
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-grow">
                      <div className="flex items-baseline justify-between">
                        <h4 className="font-medium">{comment.userName}</h4>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
                
                {comments.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Artwork info */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold mb-2">{artwork.title}</h1>
              
              <Link 
                to={`/artist/${artist.id}`} 
                className="flex items-center space-x-2 mb-4 hover:text-artnexus-purple transition-colors"
              >
                <img 
                  src={artist.profileImage} 
                  alt={artist.name} 
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">{artist.name}</span>
              </Link>
              
              <Separator className="my-4" />
              
              <p className="text-muted-foreground mb-6">
                {artwork.description}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Created: </span>
                  <span className="ml-auto">{new Date(artwork.createdAt).toLocaleDateString()}</span>
                </div>
                
                {artwork.dimensions && (
                  <div className="flex items-center text-sm">
                    <Ruler className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Dimensions: </span>
                    <span className="ml-auto">{artwork.dimensions}</span>
                  </div>
                )}
                
                {artwork.medium && (
                  <div className="flex items-center text-sm">
                    <span className="text-muted-foreground">Medium: </span>
                    <span className="ml-auto">{artwork.medium}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Categories</h4>
                <div className="flex flex-wrap gap-2">
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
            </div>
            
            {/* Artist info card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">About the Artist</h3>
              
              <Link 
                to={`/artist/${artist.id}`} 
                className="flex items-center space-x-3 mb-4 hover:text-artnexus-purple transition-colors"
              >
                <img 
                  src={artist.profileImage} 
                  alt={artist.name} 
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-medium">{artist.name}</h4>
                  <p className="text-sm text-muted-foreground">{artist.location}</p>
                </div>
              </Link>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {artist.bio}
              </p>
              
              <Link 
                to={`/artist/${artist.id}`}
                className="text-sm text-artnexus-purple hover:text-artnexus-teal font-medium transition-colors"
              >
                View Full Profile
              </Link>
            </div>
            
            {/* More from this artist */}
            {relatedArtworks.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold mb-4">More from this Artist</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {relatedArtworks.slice(0, 2).map((artwork) => (
                    <Link 
                      key={artwork.id} 
                      to={`/artwork/${artwork.id}`}
                      className="flex items-center space-x-3 group"
                    >
                      <img 
                        src={artwork.image} 
                        alt={artwork.title} 
                        className="w-16 h-16 object-cover rounded-md group-hover:opacity-80 transition-opacity"
                      />
                      <div>
                        <h4 className="font-medium group-hover:text-artnexus-purple transition-colors">{artwork.title}</h4>
                        <p className="text-xs text-muted-foreground">{artwork.categories.join(', ')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <Link 
                  to={`/artist/${artist.id}`}
                  className="block text-center text-sm text-artnexus-purple hover:text-artnexus-teal font-medium mt-4 transition-colors"
                >
                  View All Artwork
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default ArtworkDetail;
