import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Camera, Box, Home, Scan, CheckCircle,
  Share2, Save, List, Image, Monitor, Ruler
} from 'lucide-react';
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Artwork, Artist, getArtworkById, getArtistById, getRecommendedArtworks } from '@/data/mockData';
import ARViewControls from '@/components/ar/ARViewControls';
import ArtworkMeasurements, { ARMeasurement } from '@/components/ar/ArtworkMeasurements';
import ARModelSelector, { MODEL_OPTIONS } from '@/components/ar/ARModelSelector';
import EnvironmentSettings from '@/components/ar/EnvironmentSettings';

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
  const [view3DMode, setView3DMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const { isLoading, error } = useQuery({
    queryKey: ['artwork', id],
    queryFn: async () => {
      if (!id || id === ':id') {
        console.log("Invalid artwork ID, using mock data");
        const mockArtwork = getArtworkById('1');
        if (mockArtwork) {
          setArtwork(mockArtwork);
          const mockArtist = getArtistById(mockArtwork.artistId);
          if (mockArtist) setArtist(mockArtist);
        }
        return mockArtwork;
      }
      
      try {
        const { data: artworkData, error: artworkError } = await supabase
          .from('artworks')
          .select('*')
          .eq('id', id)
          .single();
          
        if (artworkError) throw artworkError;
        
        if (artworkData) {
          const artworkFormatted: Artwork = {
            id: artworkData.id,
            title: artworkData.title,
            description: artworkData.description,
            image: artworkData.image,
            artistId: artworkData.artist_id,
            medium: artworkData.medium,
            createdAt: artworkData.created_at,
            likes: 0, 
            comments: 0,
            categories: artworkData.category ? [artworkData.category] : [],
            dimensions: artworkData.aspectratio,
            price: "$0",
            onSale: false
          };
          
          setArtwork(artworkFormatted);
          
          const { data: artistData, error: artistError } = await supabase
            .from('artists')
            .select('*')
            .eq('id', artworkData.artist_id)
            .single();
          
          if (artistError) {
            console.error("Error fetching artist:", artistError);
          } else if (artistData) {
            const artistFormatted: Artist = {
              id: artistData.id,
              name: artistData.name,
              bio: artistData.bio || "",
              location: artistData.location || "Unknown",
              profileImage: artistData.photo || "https://randomuser.me/api/portraits/lego/1.jpg",
              coverImage: "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?q=80&w=2070",
              followers: 0,
              following: 0,
            };
            setArtist(artistFormatted);
          } else {
            console.log("No artist data from Supabase, trying mock data");
            const mockArtist = getArtistById(artworkFormatted.artistId);
            if (mockArtist) setArtist(mockArtist);
          }
          
          return artworkFormatted;
        }
      } catch (e) {
        console.log("Fallback to mock data", e);
        const mockArtwork = getArtworkById(id);
        if (mockArtwork) {
          setArtwork(mockArtwork);
          const mockArtist = getArtistById(mockArtwork.artistId);
          if (mockArtist) setArtist(mockArtist);
        }
        return mockArtwork;
      }
    },
    enabled: !!id
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
  
  const toggle3DView = (value: boolean) => {
    setView3DMode(value);
    setArViewActive(true);
    
    if (value) {
      toast.success("3D model view activated!");
    } else {
      toast.success("2D artwork view activated");
    }
  };
  
  const changeModel = (model: typeof MODEL_OPTIONS[0]) => {
    setSelectedModel(model);
    toast.success(`Selected 3D model: ${model.name}`);
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
          <Button 
            className="mt-4"
            onClick={() => navigate('/discover')}
          >
            Return to Discover
          </Button>
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
                  {view3DMode ? (
                    <div className="w-full h-full">
                      <iframe
                        ref={iframeRef}
                        title={`3D Model - ${selectedModel.name}`}
                        className="w-full h-full"
                        src={`${selectedModel.src}?autostart=1&preload=1&ui_controls=1&ui_infos=1&ui_inspector=1&ui_stop=0&ui_watermark=0&ui_watermark_link=0`}
                        allow="autoplay; fullscreen; xr-spatial-tracking"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <div 
                      className="w-full h-full bg-center bg-no-repeat flex items-center justify-center transition-all"
                      style={{ 
                        backgroundImage: `url(${artwork.image})`,
                        transform: `scale(${zoomLevel}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
                        backgroundColor: wallColor,
                        backgroundSize: 'contain'
                      }}
                    ></div>
                  )}
                  
                  <ARViewControls
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onRotateLeft={handleRotateLeft}
                    onRotateRight={handleRotateRight}
                    onReset={handleReset}
                    onTakeScreenshot={takeScreenshot}
                    onSave={() => setShowCollectionDialog(true)}
                  />
                  
                  {!view3DMode && (
                    <ArtworkMeasurements
                      measurements={artworkMeasurements}
                      onMeasurementsChange={setArtworkMeasurements}
                      onMove={handleMove}
                    />
                  )}
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
              
              {arViewActive && !view3DMode && (
                <EnvironmentSettings
                  roomEnvironment={roomEnvironment}
                  lightingCondition={lightingCondition}
                  onChangeEnvironment={handleChangeEnvironment}
                  onChangeLighting={handleChangeLighting}
                />
              )}
              
              {arViewActive && view3DMode && (
                <ARModelSelector
                  models={MODEL_OPTIONS}
                  selectedModel={selectedModel}
                  onModelChange={changeModel}
                />
              )}
            </div>
            
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">{artwork.title}</h2>
                
                {artist && (
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src={artist.profileImage} alt={artist.name} />
                      <AvatarFallback>{artist.name?.substring(0, 2).toUpperCase() || "AR"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{artist.name || "Unknown Artist"}</p>
                      <p className="text-sm text-muted-foreground">{artist.location || "Unknown Location"}</p>
                    </div>
                  </div>
                )}
                
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
                        onClick={() => {
                          handleActivateAR();
                          toggle3DView(false);
                        }}
                        disabled={!isARSupported || (arViewActive && !view3DMode)}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        {arViewActive && !view3DMode ? 'AR View Active' : 'Start AR View'}
                      </Button>
                      
                      {arViewActive && !view3DMode && (
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
                      Explore artworks as 3D models or in a virtual environment.
                    </p>
                    <div className="space-y-3">
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          setArViewActive(true);
                          toggle3DView(false);
                          toast.success("Virtual view activated! Use controls to adjust size and position");
                        }}
                      >
                        <Monitor className="h-4 w-4 mr-2" />
                        2D Virtual View
                      </Button>
                      
                      <Button 
                        className="w-full" 
                        variant={view3DMode ? "default" : "outline"}
                        onClick={() => {
                          setArViewActive(true);
                          toggle3DView(true);
                        }}
                      >
                        <Box className="h-4 w-4 mr-2" />
                        3D Model View
                      </Button>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium">Virtual Features:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                          Interact with 3D models
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                          Adjust artwork size and position
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                          Test different room environments
                        </li>
                      </ul>
                    </div>
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
                  <Home className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Steady Movement</h3>
                <p className="text-sm text-muted-foreground">Move your device slowly for accurate surface detection</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Box className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">3D Models</h3>
                <p className="text-sm text-muted-foreground">Try our Sketchfab 3D model integrations for a richer experience</p>
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
