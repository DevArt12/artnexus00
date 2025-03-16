
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Box, RotateCcw, ZoomIn, ZoomOut, Home } from 'lucide-react';

const ARView = () => {
  const { id } = useParams<{ id: string }>();
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null);
  const [arViewActive, setArViewActive] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  
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
  
  // Check if AR is supported on device
  useEffect(() => {
    // This is a simple check - in a real app, you would use proper AR libraries
    // like AR.js, ARCore, or ARKit to check for AR support
    const checkARSupport = () => {
      // For this demo, we'll just check if it's on a mobile device
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsARSupported(isMobile);
    };
    
    checkARSupport();
  }, []);
  
  const handleActivateAR = () => {
    console.log('Activating AR view');
    setArViewActive(true);
    // In a real implementation, this would initialize the AR framework
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2.5));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };
  
  const handleReset = () => {
    setZoomLevel(1);
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
                      className="w-full h-full bg-center bg-no-repeat flex items-center justify-center transition-transform"
                      style={{ 
                        backgroundImage: `url(${artwork?.image})`,
                        transform: `scale(${zoomLevel})` 
                      }}
                    >
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <Button size="sm" variant="secondary" onClick={handleZoomIn}>
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" onClick={handleZoomOut}>
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" onClick={handleReset}>
                          <RotateCcw className="h-4 w-4" />
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
                      <Button className="w-full" variant="outline">
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
              </ol>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ARView;
