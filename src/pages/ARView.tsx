
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Camera, Box, RotateCcw, ZoomIn, ZoomOut, Home, Move, 
  Rotate3d, ArrowLeft, ArrowRight, Share2, Save, List,
  Image, Cube, Ruler, Scan, CheckCircle
} from 'lucide-react';
import { toast } from "sonner";
import { Artwork, Artist, artworks, getArtworkById, getArtistById, getRecommendedArtworks } from '@/data/mockData';

interface ARMeasurement {
  width: number;
  height: number;
  units: 'cm' | 'inches' | 'feet';
}

interface Collection {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  artworks: string[];
  createdAt: string;
}

const ARView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null);
  const [arViewActive, setArViewActive] = useState(false);
  const [wallScanActive, setWallScanActive] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [recentlyViewed, setRecentlyViewed] = useState<Artwork[]>([]);
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [suggestedArtworks, setSuggestedArtworks] = useState<Artwork[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [artworkMeasurements, setArtworkMeasurements] = useState<ARMeasurement>({
    width: 100,
    height: 80,
    units: 'cm'
  });
  const [wallColor, setWallColor] = useState('#f5f5f5');
  const [roomEnvironment, setRoomEnvironment] = useState('living');
  const [lightingCondition, setLightingCondition] = useState('daylight');
  
  const { isLoading, error } = useQuery({
    queryKey: ['artwork', id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('artworks')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        if (data) {
          // Convert Supabase data to match our Artwork type
          const artworkData: Artwork = {
            id: data.id,
            title: data.title,
            description: data.description,
            image: data.image,
            artistId: data.artist_id,
            medium: data.medium,
            year: data.year,
            categories: data.category ? [data.category] : [],
            dimensions: data.aspectratio,
            price: 0, // Default value
            sold: false, // Default value
            featured: false, // Default value
            createdAt: data.created_at,
            likes: 0, // Default value
            comments: [], // Default value
          };
          
          setArtwork(artworkData);
          
          const artistData = await supabase
            .from('artists')
            .select('*')
            .eq('id', data.artist_id)
            .single();
          
          if (artistData.data) {
            // Convert Supabase data to match our Artist type
            const artistDataFormatted: Artist = {
              id: artistData.data.id,
              name: artistData.data.name,
              bio: artistData.data.bio,
              location: artistData.data.location,
              profileImage: artistData.data.photo,
              coverImage: '', // Default value
              specialty: artistData.data.specialty,
              followers: 0, // Default value
              following: 0, // Default value
            };
            setArtist(artistDataFormatted);
          }
          return data;
        }
      } catch (e) {
        console.log("Fallback to mock data", e);
        const mockArtwork = getArtworkById(id!);
        if (mockArtwork) {
          setArtwork(mockArtwork);
          const mockArtist = getArtistById(mockArtwork.artistId);
          if (mockArtist) setArtist(mockArtist);
        }
        return mockArtwork;
      }
    }
  });
  
  useEffect(() => {
    const checkARSupport = () => {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const hasMotionSensors = 'DeviceMotionEvent' in window || 'DeviceOrientationEvent' in window;
      setIsARSupported(isMobile && hasMotionSensors);
    };
    
    checkARSupport();
    
    const loadCollections = () => {
      const savedCollections = localStorage.getItem('userCollections');
      if (savedCollections) {
        try {
          const parsed = JSON.parse(savedCollections);
          setCollections(parsed);
        } catch (e) {
          console.error("Error parsing collections:", e);
        }
      }
    };
    
    loadCollections();
    
    const updateRecentlyViewed = () => {
      const storedRecentViews = localStorage.getItem('recentlyViewedArt');
      let recentViews: string[] = [];
      
      if (storedRecentViews) {
        try {
          recentViews = JSON.parse(storedRecentViews);
        } catch (e) {
          console.error("Error parsing recently viewed art", e);
        }
      }
      
      if (id && (!recentViews.includes(id) || recentViews[0] !== id)) {
        recentViews = recentViews.filter(viewId => viewId !== id);
        recentViews.unshift(id);
        recentViews = recentViews.slice(0, 10);
        localStorage.setItem('recentlyViewedArt', JSON.stringify(recentViews));
      }
      
      const recentArtworks = recentViews
        .map(artId => getArtworkById(artId))
        .filter(art => art !== undefined) as Artwork[];
      
      setRecentlyViewed(recentArtworks);
    };
    
    updateRecentlyViewed();
  }, [id]);
  
  useEffect(() => {
    if (artwork) {
      const recommended = getRecommendedArtworks(artwork.id, 5);
      setSuggestedArtworks(recommended);
    } else {
      setSuggestedArtworks([]);
    }
  }, [artwork]);
  
  const handleActivateAR = () => {
    if (isARSupported) {
      setArViewActive(true);
      toast.success("AR view activated! Move your device to place the artwork");
    } else {
      toast.error("AR view is not supported on your device");
    }
  };
  
  const handleWallScan = () => {
    setWallScanActive(true);
    
    toast.info("Scanning your wall...");
    
    setTimeout(() => {
      toast.success("Wall scanned successfully! The artwork has been placed.");
      setWallScanActive(false);
      setPosition({ x: 0, y: 0 });
      setWallColor('#f2f2f2');
    }, 3000);
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
  
  const takeScreenshot = () => {
    toast.success("Screenshot saved to your gallery!");
  };
  
  const viewOtherArtwork = (artworkId: string) => {
    navigate(`/ar-view/${artworkId}`);
  };
  
  const addToCollection = (collectionId: string) => {
    if (!id) return;
    
    setCollections(collections.map(collection => {
      if (collection.id === collectionId) {
        if (!collection.artworks.includes(id)) {
          const updatedArtworks = [...collection.artworks, id];
          const updatedCover = collection.artworks.length === 0 && artwork
            ? artwork.image
            : collection.coverImage;
            
          toast.success(`Added to "${collection.name}" collection`);
          
          return {
            ...collection,
            artworks: updatedArtworks,
            coverImage: updatedCover
          };
        }
        toast.info(`Already in "${collection.name}" collection`);
      }
      return collection;
    }));
    
    localStorage.setItem('userCollections', JSON.stringify(collections));
    
    setShowCollectionDialog(false);
  };
  
  const handleChangeEnvironment = (env: string) => {
    setRoomEnvironment(env);
    
    switch(env) {
      case 'living':
        setWallColor('#f5f5f5');
        break;
      case 'bedroom':
        setWallColor('#e6e6fa');
        break;
      case 'office':
        setWallColor('#f0f8ff');
        break;
      case 'kitchen':
        setWallColor('#fffaf0');
        break;
      default:
        setWallColor('#f5f5f5');
    }
    
    toast.success(`Environment changed to ${env} room`);
  };
  
  const handleChangeLighting = (lighting: string) => {
    setLightingCondition(lighting);
    toast.success(`Lighting condition updated to ${lighting}`);
  };
  
  const getWallBackground = () => {
    let bgStyle = `background-color: ${wallColor};`;
    
    switch(roomEnvironment) {
      case 'living':
        bgStyle += ' background-image: url("https://www.transparenttextures.com/patterns/subtle-white-feathers.png");';
        break;
      case 'bedroom':
        bgStyle += ' background-image: url("https://www.transparenttextures.com/patterns/bedge-grunge.png");';
        break;
      case 'office':
        bgStyle += ' background-image: url("https://www.transparenttextures.com/patterns/exclusive-paper.png");';
        break;
      case 'kitchen':
        bgStyle += ' background-image: url("https://www.transparenttextures.com/patterns/white-tiles.png");';
        break;
    }
    
    let brightness = '100%';
    let contrast = '100%';
    
    switch(lightingCondition) {
      case 'daylight':
        brightness = '110%';
        contrast = '105%';
        break;
      case 'evening':
        brightness = '90%';
        contrast = '95%';
        break;
      case 'dim':
        brightness = '70%';
        contrast = '90%';
        break;
      case 'bright':
        brightness = '120%';
        contrast = '110%';
        break;
    }
    
    bgStyle += ` filter: brightness(${brightness}) contrast(${contrast});`;
    
    return bgStyle;
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="text-center py-12 flex-grow">
          <p>Loading artwork...</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !artwork) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="text-center py-12 flex-grow">
          <p className="text-red-500">Error loading artwork. Please try again.</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-2">AR Viewer</h1>
        <p className="text-muted-foreground mb-8">
          Experience "{artwork.title}" in your space with augmented reality
        </p>
        
        <div>
          {isARSupported === false && (
            <Alert className="mb-6">
              <AlertDescription>
                AR view is not supported on your device or browser. You can still view the artwork in our virtual environment.
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
                      backgroundImage: `url(${artwork.image})`,
                      transform: `scale(${zoomLevel}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
                      backgroundColor: wallColor,
                      backgroundSize: 'contain'
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
                    
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Button size="sm" variant="secondary" onClick={takeScreenshot}>
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photo
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => setShowCollectionDialog(true)}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/60 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white text-sm">Artwork Measurements:</span>
                          <span className="text-white text-sm">
                            {artworkMeasurements.width} x {artworkMeasurements.height} {artworkMeasurements.units}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-white text-xs block mb-1">Width</span>
                            <Slider 
                              value={[artworkMeasurements.width]} 
                              min={20} 
                              max={200} 
                              step={1}
                              onValueChange={(value) => setArtworkMeasurements(prev => ({...prev, width: value[0]}))}
                              className="mb-2"
                            />
                          </div>
                          <div>
                            <span className="text-white text-xs block mb-1">Height</span>
                            <Slider 
                              value={[artworkMeasurements.height]} 
                              min={20} 
                              max={200} 
                              step={1}
                              onValueChange={(value) => setArtworkMeasurements(prev => ({...prev, height: value[0]}))}
                              className="mb-2"
                            />
                          </div>
                        </div>
                        <div className="flex space-x-3 justify-center mt-2">
                          <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20" onClick={() => handleMove(0, -10)}>
                            <Move className="h-4 w-4 mr-1" />
                            Up
                          </Button>
                          <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20" onClick={() => handleMove(0, 10)}>
                            <Move className="h-4 w-4 mr-1" />
                            Down
                          </Button>
                          <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20" onClick={() => handleMove(-10, 0)}>
                            <Move className="h-4 w-4 mr-1" />
                            Left
                          </Button>
                          <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20" onClick={() => handleMove(10, 0)}>
                            <Move className="h-4 w-4 mr-1" />
                            Right
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                  <img 
                    src={artwork.image} 
                    alt={artwork.title} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
              
              {arViewActive && (
                <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                  <h3 className="text-lg font-medium mb-3">Environment Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Room Type</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="sm" 
                          variant={roomEnvironment === 'living' ? 'default' : 'outline'}
                          onClick={() => handleChangeEnvironment('living')}
                        >
                          Living Room
                        </Button>
                        <Button 
                          size="sm" 
                          variant={roomEnvironment === 'bedroom' ? 'default' : 'outline'}
                          onClick={() => handleChangeEnvironment('bedroom')}
                        >
                          Bedroom
                        </Button>
                        <Button 
                          size="sm" 
                          variant={roomEnvironment === 'office' ? 'default' : 'outline'}
                          onClick={() => handleChangeEnvironment('office')}
                        >
                          Office
                        </Button>
                        <Button 
                          size="sm" 
                          variant={roomEnvironment === 'kitchen' ? 'default' : 'outline'}
                          onClick={() => handleChangeEnvironment('kitchen')}
                        >
                          Kitchen
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Lighting</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="sm" 
                          variant={lightingCondition === 'daylight' ? 'default' : 'outline'}
                          onClick={() => handleChangeLighting('daylight')}
                        >
                          Daylight
                        </Button>
                        <Button 
                          size="sm" 
                          variant={lightingCondition === 'evening' ? 'default' : 'outline'}
                          onClick={() => handleChangeLighting('evening')}
                        >
                          Evening
                        </Button>
                        <Button 
                          size="sm" 
                          variant={lightingCondition === 'dim' ? 'default' : 'outline'}
                          onClick={() => handleChangeLighting('dim')}
                        >
                          Dim
                        </Button>
                        <Button 
                          size="sm" 
                          variant={lightingCondition === 'bright' ? 'default' : 'outline'}
                          onClick={() => handleChangeLighting('bright')}
                        >
                          Bright
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">{artwork.title}</h2>
                <p className="text-muted-foreground mb-6">{artwork.description}</p>
                
                <Tabs defaultValue="ar">
                  <TabsList className="w-full mb-6">
                    <TabsTrigger value="ar" className="flex-1">
                      <Camera className="h-4 w-4 mr-2" />
                      AR View
                    </TabsTrigger>
                    <TabsTrigger value="3d" className="flex-1">
                      <Box className="h-4 w-4 mr-2" />
                      Virtual View
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ar">
                    <p className="text-sm text-muted-foreground mb-4">
                      Place this artwork in your space using augmented reality.
                    </p>
                    <div className="space-y-3">
                      <Button
                        className="w-full"
                        onClick={handleActivateAR}
                        disabled={!isARSupported || arViewActive}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        {arViewActive ? 'AR View Active' : 'Start AR View'}
                      </Button>
                      
                      {arViewActive && (
                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={handleWallScan}
                          disabled={wallScanActive}
                        >
                          <Scan className="h-4 w-4 mr-2" />
                          {wallScanActive ? 'Scanning...' : 'Scan Your Wall'}
                        </Button>
                      )}
                    </div>
                    
                    {artwork.dimensions && (
                      <div className="mt-4 pt-4 border-t">
                        <h3 className="text-sm font-medium mb-2 flex items-center">
                          <Ruler className="h-4 w-4 mr-2 text-muted-foreground" />
                          Actual Dimensions
                        </h3>
                        <p className="text-sm">{artwork.dimensions}</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="3d">
                    <p className="text-sm text-muted-foreground mb-4">
                      Explore this artwork in a virtual environment to see how it would look on your wall.
                    </p>
                    <Button className="w-full" variant={arViewActive ? "outline" : "default"} onClick={() => {
                      setArViewActive(true);
                      toast.success("Virtual view activated! Use controls to adjust size and position");
                    }}>
                      <Cube className="h-4 w-4 mr-2" />
                      View in Virtual Space
                    </Button>
                    
                    {arViewActive && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium">Virtual Room Features:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                            Adjust artwork size and position
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                            Change wall color and room environment
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                            Test different lighting conditions
                          </li>
                        </ul>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6 pt-6 border-t space-y-3">
                  <Button variant="outline" className="w-full justify-between" onClick={() => setShowCollectionDialog(true)}>
                    <span className="flex items-center">
                      <List className="h-4 w-4 mr-2" />
                      Add to Collection
                    </span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {collections.length}
                    </span>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share AR View
                  </Button>
                  
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href={`/artwork/${id}`}>
                      <Image className="h-4 w-4 mr-2" />
                      Back to Artwork Details
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
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
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Try More Artworks in AR</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {suggestedArtworks.map((suggestedArt) => (
                <div 
                  key={suggestedArt.id} 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => viewOtherArtwork(suggestedArt.id)}
                >
                  <div className="aspect-square rounded-md overflow-hidden mb-2">
                    <img 
                      src={suggestedArt.image} 
                      alt={suggestedArt.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm font-medium truncate">{suggestedArt.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{suggestedArt.categories.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
          
          {recentlyViewed.length > 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Recently Viewed</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {recentlyViewed.slice(1, 6).map((recentArt) => (
                  <div 
                    key={recentArt.id} 
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => viewOtherArtwork(recentArt.id)}
                  >
                    <div className="aspect-square rounded-md overflow-hidden mb-2">
                      <img 
                        src={recentArt.image} 
                        alt={recentArt.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium truncate">{recentArt.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={showCollectionDialog} onOpenChange={setShowCollectionDialog}>
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
                  onClick={() => setShowCollectionDialog(false)}
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
                    onClick={() => addToCollection(collection.id)}
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
                      {collection.artworks.includes(id!) ? 'Added' : 'Add'}
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
      
      <Footer />
    </div>
  );
};

export default ARView;
