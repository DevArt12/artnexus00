
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Box, RotateCcw, ZoomIn, ZoomOut, Home, Move, Rotate3d, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from "sonner";

const ARView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null);
  const [arViewActive, setArViewActive] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [suggestedArtworks, setSuggestedArtworks] = useState<any[]>([]);
  
  // Fetch artwork data
  const { data: artwork, isLoading, error } = useQuery({
    queryKey: ['artwork', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    }
  });
  
  // Fetch related artworks
  const { data: relatedArtworks } = useQuery({
    queryKey: ['related-artworks', artwork?.category],
    enabled: !!artwork?.category,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('category', artwork?.category)
        .neq('id', id)
        .limit(5);
        
      if (error) throw error;
      return data;
    }
  });
  
  // Check if AR is supported on device
  useEffect(() => {
    // This is a simple check - in a real app, you would use proper AR libraries
    const checkARSupport = () => {
      // For this demo, we'll check if it's on a mobile device
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsARSupported(isMobile);
    };
    
    checkARSupport();
    
    // Set up recently viewed items from localStorage
    const storedRecentViews = localStorage.getItem('recentlyViewedArt');
    if (storedRecentViews) {
      try {
        const parsed = JSON.parse(storedRecentViews);
        setRecentlyViewed(parsed);
      } catch (e) {
        console.error("Error parsing recently viewed art", e);
      }
    }
    
    // Set up sample suggested artworks
    setSuggestedArtworks([
      { id: 'sample1', title: 'Abstract Motion', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3' },
      { id: 'sample2', title: 'Blue Landscape', image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3' },
      { id: 'sample3', title: 'Vibrant Sculpture', image: 'https://images.unsplash.com/photo-1561839561-b13bcfe95249?ixlib=rb-4.0.3' },
      { id: 'sample4', title: 'Modern Painting', image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-4.0.3' },
      { id: 'sample5', title: 'Neon Dream', image: 'https://images.unsplash.com/photo-1583851543689-6a79d2995f02?ixlib=rb-4.0.3' },
    ]);
  }, [id]);
  
  const handleActivateAR = () => {
    if (isARSupported) {
      setArViewActive(true);
      toast.success("AR view activated! Move your device to place the artwork");
    } else {
      toast.error("AR view is not supported on your device");
    }
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2.5));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };
  
  const handleReset = () => {
    setZoomLevel(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };
  
  const handleRotateLeft = () => {
    setRotation(prev => prev - 15);
  };
  
  const handleRotateRight = () => {
    setRotation(prev => prev + 15);
  };
  
  const handleMove = (dx: number, dy: number) => {
    setPosition(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
  };
  
  // Sample function to take a screenshot
  const takeScreenshot = () => {
    toast.success("Screenshot saved to your gallery!");
  };
  
  // Navigate to another artwork
  const viewOtherArtwork = (artworkId: string) => {
    navigate(`/ar-view/${artworkId}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-2">AR Viewer</h1>
        <p className="text-muted-foreground mb-8">
          Experience art in your space with augmented reality
        </p>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p>Loading artwork...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading artwork. Please try again.</p>
          </div>
        ) : (
          <div>
            {isARSupported === false && (
              <Alert className="mb-6">
                <AlertDescription>
                  AR view is not supported on your device or browser. You can still view the artwork in 3D mode.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                {arViewActive ? (
                  <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                    <div 
                      className="w-full h-full bg-center bg-no-repeat flex items-center justify-center transition-all"
                      style={{ 
                        backgroundImage: `url(${artwork?.image})`,
                        transform: `scale(${zoomLevel}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)` 
                      }}
                    >
                      <div className="absolute top-4 right-4 flex flex-wrap gap-2">
                        <Button size="sm" variant="secondary" onClick={handleZoomIn}>
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" onClick={handleZoomOut}>
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" onClick={handleRotateLeft}>
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" onClick={handleRotateRight}>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" onClick={handleReset}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="absolute bottom-4 left-4">
                        <Button size="sm" variant="secondary" onClick={takeScreenshot}>
                          <Camera className="h-4 w-4 mr-2" />
                          Take Photo
                        </Button>
                      </div>
                      
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        <Button size="sm" variant="secondary" onClick={() => handleMove(0, -10)}>
                          <Move className="h-4 w-4" />
                          Up
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => handleMove(0, 10)}>
                          <Move className="h-4 w-4" />
                          Down
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => handleMove(-10, 0)}>
                          <Move className="h-4 w-4" />
                          Left
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => handleMove(10, 0)}>
                          <Move className="h-4 w-4" />
                          Right
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                    <img 
                      src={artwork?.image} 
                      alt={artwork?.title} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">{artwork?.title}</h2>
                  <p className="text-muted-foreground mb-6">{artwork?.description}</p>
                  
                  <Tabs defaultValue="ar">
                    <TabsList className="w-full mb-6">
                      <TabsTrigger value="ar" className="flex-1">
                        <Camera className="h-4 w-4 mr-2" />
                        AR View
                      </TabsTrigger>
                      <TabsTrigger value="3d" className="flex-1">
                        <Box className="h-4 w-4 mr-2" />
                        3D View
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="ar">
                      <p className="text-sm text-muted-foreground mb-4">
                        Place this artwork in your space using augmented reality.
                      </p>
                      <Button
                        className="w-full"
                        onClick={handleActivateAR}
                        disabled={!isARSupported || arViewActive}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        {arViewActive ? 'AR View Active' : 'Start AR View'}
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="3d">
                      <p className="text-sm text-muted-foreground mb-4">
                        Explore this artwork in 3D from all angles.
                      </p>
                      <Button className="w-full" variant="outline" onClick={() => {
                        setArViewActive(true);
                        toast.success("3D view activated! Use controls to rotate and zoom");
                      }}>
                        <Box className="h-4 w-4 mr-2" />
                        View in 3D
                      </Button>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-6 pt-6 border-t">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href={`/artwork/${id}`}>
                        <Home className="h-4 w-4 mr-2" />
                        Back to Artwork Details
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">How to Use AR View</h2>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Tap "Start AR View" to activate your camera</li>
                <li>Point your camera at a flat surface like a wall or table</li>
                <li>Move your device around until the artwork appears</li>
                <li>Use pinch gestures to resize the artwork</li>
                <li>Use drag gestures to reposition it</li>
                <li>Take a screenshot to save your AR creation</li>
                <li>Share your AR view with friends via the share button</li>
              </ol>
            </div>
            
            {/* Related Artworks */}
            {relatedArtworks && relatedArtworks.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Related Artworks</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {relatedArtworks.map((relatedArt) => (
                    <div 
                      key={relatedArt.id} 
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => viewOtherArtwork(relatedArt.id)}
                    >
                      <div className="aspect-square rounded-md overflow-hidden mb-2">
                        <img 
                          src={relatedArt.image} 
                          alt={relatedArt.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm font-medium truncate">{relatedArt.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Suggested Artworks for AR */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">More Artworks to Try in AR</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {suggestedArtworks.map((suggestedArt) => (
                  <div 
                    key={suggestedArt.id} 
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <div className="aspect-square rounded-md overflow-hidden mb-2">
                      <img 
                        src={suggestedArt.image} 
                        alt={suggestedArt.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium truncate">{suggestedArt.title}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* AR Tips */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">AR Viewing Tips</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Camera className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Good Lighting</h3>
                  <p className="text-sm text-muted-foreground">Use AR in well-lit environments for the best experience</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Move className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Steady Movement</h3>
                  <p className="text-sm text-muted-foreground">Move your device slowly for accurate surface detection</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Rotate3d className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Multiple Angles</h3>
                  <p className="text-sm text-muted-foreground">View artworks from different positions to see all details</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ARView;
