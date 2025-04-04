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
import { useIsMobile } from '@/hooks/use-mobile';
import SketchfabEmbed from '@/components/ar/SketchfabEmbed';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [retryCount, setRetryCount] = useState(0);

  const isMobile = useIsMobile();

  const { isLoading, error } = useQuery({
    queryKey: ['artwork', id, retryCount],
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
      const hasCamera = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
      setIsARSupported(isMobile && hasMotionSensors && !!hasCamera);
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
    
    return () => {
      // Clean up camera when component unmounts
      if (cameraActive) {
        disableCamera();
      }
    };
  }, [id]);

  useEffect(() => {
    if (artwork) {
      const recommended = getRecommendedArtworks(artwork.id, 5);
      setSuggestedArtworks(recommended);
    } else {
      setSuggestedArtworks([]);
    }
  }, [artwork]);

  const ensureCompatibleImageFormat = (url: string) => {
    if (url.toLowerCase().endsWith('.png')) {
      return url;
    }
    
    if (url.includes('unsplash.com')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}fm=png`;
    }
    
    console.log('Non-PNG image detected, will handle with proxy or fallback:', url);
    return url;
  };

  const activateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      const videoElement = document.createElement('video');
      videoElement.srcObject = stream;
      videoElement.id = 'ar-camera-feed';
      videoElement.autoplay = true;
      videoElement.className = 'absolute inset-0 w-full h-full object-cover';
      
      const container = document.getElementById('ar-view-container');
      if (container) {
        if (document.getElementById('ar-camera-feed')) {
          document.getElementById('ar-camera-feed').remove();
        }
        
        container.prepend(videoElement);
        setCameraActive(true);
        toast.success("Camera activated!");
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      toast.error("Failed to access camera. Please check permissions.");
      setCameraActive(false);
    }
  };

  const disableCamera = () => {
    const videoElement = document.getElementById('ar-camera-feed') as HTMLVideoElement;
    if (videoElement && videoElement.srcObject) {
      const stream = videoElement.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => {
        track.stop();
      });
      
      videoElement.remove();
      setCameraActive(false);
    }
  };

  const toggleCamera = () => {
    if (cameraActive) {
      disableCamera();
    } else {
      activateCamera();
    }
  };

  const handleActivateAR = () => {
    if (isARSupported) {
      setArViewActive(true);
      toast.success(isMobile ? 
        "AR view activated! Move your device slowly to place artwork" : 
        "AR view activated! Move your device to place the artwork");
      
      if (isMobile) {
        toast.info("For best results, ensure good lighting and hold your device steady", {
          duration: 5000,
        });
      }
    } else {
      toast.error("AR view is not supported on your device");
      if (isMobile) {
        toast.info("Try using our virtual view option instead", {
          duration: 3000,
        });
      }
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
    
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = model.src;
        }
      }, 100);
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

  const handleMoveUp = () => {
    setPosition(prev => ({
      x: prev.x,
      y: prev.y - 10
    }));
  };

  const handleMoveDown = () => {
    setPosition(prev => ({
      x: prev.x,
      y: prev.y + 10
    }));
  };

  const handleMoveLeft = () => {
    setPosition(prev => ({
      x: prev.x - 10,
      y: prev.y
    }));
  };

  const handleMoveRight = () => {
    setPosition(prev => ({
      x: prev.x + 10,
      y: prev.y
    }));
  };

  const takeScreenshot = () => {
    if (cameraActive) {
      const videoElement = document.getElementById('ar-camera-feed') as HTMLVideoElement;
      const canvasElement = document.createElement('canvas');
      
      if (videoElement) {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        
        const context = canvasElement.getContext('2d');
        if (context) {
          context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
          
          const artworkElement = document.getElementById('artwork-overlay');
          if (artworkElement && imageRef.current) {
            const rect = artworkElement.getBoundingClientRect();
            const img = imageRef.current;
            
            const x = (canvasElement.width - img.width) / 2;
            const y = (canvasElement.height - img.height) / 2;
            
            context.save();
            context.translate(canvasElement.width / 2, canvasElement.height / 2);
            context.rotate(rotation * Math.PI / 180);
            context.scale(zoomLevel, zoomLevel);
            context.translate(-img.width / 2, -img.height / 2);
            context.drawImage(img, 0, 0, img.width, img.height);
            context.restore();
          }
          
          try {
            const dataUrl = canvasElement.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `ar-view-${new Date().getTime()}.png`;
            link.click();
            
            toast.success("Screenshot saved to your downloads!");
          } catch (err) {
            console.error('Error creating screenshot:', err);
            toast.error("Failed to create screenshot");
          }
        }
      }
    } else {
      toast.success("Screenshot saved to your gallery!");
    }
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

  const getArtworkImageUrl = () => {
    if (!artwork) return '';
    return ensureCompatibleImageFormat(artwork.image);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully');
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    console.error('Error loading image:', artwork?.image);
    setImageLoading(false);
    setImageError(true);
    
    if (artwork && retryCount === 0) {
      const fallbackUrl = '/placeholder.svg';
      console.log('Falling back to placeholder image:', fallbackUrl);
      setProcessedImageUrl(fallbackUrl);
      setRetryCount(retryCount + 1);
    }
  };

  const retryLoadImage = () => {
    setImageLoading(true);
    setImageError(false);
    setProcessedImageUrl(null);
    setRetryCount(retryCount + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="text-center py-12 flex-grow">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4">Loading artwork...</p>
          </div>
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
      
      <div className="container mx-auto px-4 py-4 md:py-8 flex-grow">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">AR Viewer</h1>
        <p className="text-muted-foreground mb-4 md:mb-8 text-sm md:text-base">
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="lg:col-span-2">
              {arViewActive ? (
                <div 
                  id="ar-view-container"
                  className="relative bg-black rounded-lg overflow-hidden aspect-video"
                >
                  {view3DMode ? (
                    <div className="w-full h-full">
                      <SketchfabEmbed
                        title={`3D Model - ${selectedModel.name}`}
                        src={selectedModel.src}
                        onLoad={() => console.log("3D model loaded successfully")}
                        onError={() => {
                          console.error("3D model failed to load");
                          toast.error("Failed to load 3D model. Please try another model.");
                        }}
                      />
                    </div>
                  ) : (
                    <div 
                      id="artwork-overlay"
                      className={`w-full h-full ${cameraActive ? 'relative z-10' : ''} bg-center bg-no-repeat flex items-center justify-center transition-all`}
                      style={{ 
                        backgroundImage: (!cameraActive && !imageLoading && !imageError) ? `url(${processedImageUrl || getArtworkImageUrl()})` : 'none',
                        backgroundColor: cameraActive ? 'transparent' : wallColor,
                        backgroundSize: 'contain',
                        transform: cameraActive ? 
                          undefined : 
                          `scale(${zoomLevel}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`
                      }}
                    >
                      {!cameraActive && (
                        <>
                          {imageLoading && (
                            <div className="flex flex-col items-center justify-center h-full">
                              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                              <p className="text-white mt-4">Loading artwork...</p>
                            </div>
                          )}
                          {imageError && (
                            <div className="flex flex-col items-center justify-center h-full">
                              <p className="text-white">Failed to load image</p>
                              <Button 
                                variant="outline" 
                                className="mt-4" 
                                onClick={retryLoadImage}
                              >
                                Retry
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                      
                      {cameraActive && !imageLoading && !imageError && (
                        <img 
                          src={processedImageUrl || getArtworkImageUrl()} 
                          alt={artwork.title}
                          className="max-h-full max-w-full object-contain"
                          style={{ 
                            position: 'absolute',
                            left: `calc(50% + ${position.x}px)`,
                            top: `calc(50% + ${position.y}px)`,
                            transform: `translate(-50%, -50%) scale(${zoomLevel}) rotate(${rotation}deg)`
                          }}
                        />
                      )}
                      
                      <img 
                        ref={imageRef}
                        src={processedImageUrl || getArtworkImageUrl()} 
                        alt={artwork.title}
                        className="hidden"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                    </div>
                  )}
                  
                  <ARViewControls
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onRotateLeft={handleRotateLeft}
                    onRotateRight={handleRotateRight}
                    onReset={handleReset}
                    onTakeScreenshot={takeScreenshot}
                    onSave={() => setShowCollectionDialog(true)}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onMoveLeft={handleMoveLeft}
                    onMoveRight={handleMoveRight}
                    cameraActive={cameraActive}
                    onToggleCamera={isARSupported ? toggleCamera : undefined}
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
                  {imageLoading && (
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                      <p className="text-muted-foreground mt-4">Loading artwork...</p>
                    </div>
                  )}
                  {imageError && (
                    <div className="text-center">
                      <p className="text-red-500 mb-2">Failed to load image</p>
                      <Button 
                        variant="outline"
                        onClick={retryLoadImage}
                      >
                        Retry
                      </Button>
                    </div>
                  )}
                  <img 
                    src={processedImageUrl || getArtworkImageUrl()} 
                    alt={artwork.title} 
                    className={`max-h-full max-w-full object-contain ${imageLoading || imageError ? 'hidden' : ''}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
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
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
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
                
                <p className="text-muted-foreground mb-6 text-sm md:text-base line-clamp-3 md:line-clamp-none">{artwork.description}</p>
                
                <Tabs defaultValue="ar">
                  <TabsList className="w-full mb-4 md:mb-6">
                    <TabsTrigger value="ar" className="flex-1">
                      <Camera className="h-4 w-4 mr-1 md:mr-2" />
                      <span className="text-xs md:text-sm">AR View</span>
                    </TabsTrigger>
                    <TabsTrigger value="3d" className="flex-1">
                      <Box className="h-4 w-4 mr-1 md:mr-2" />
                      <span className="text-xs md:text-sm">Virtual View</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ar">
                    <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                      Place this artwork in your space using augmented reality.
                    </p>
                    <div className="space-y-2 md:space-y-3">
                      <Button
                        className="w-full"
                        onClick={() => {
                          handleActivateAR();
                          toggle3DView(false);
                        }}
                        disabled={!isARSupported || (arViewActive && !view3DMode)}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        <span className="text-xs md:text-sm">
                          {arViewActive && !view3DMode ? 'AR View Active' : 'Start AR View'}
                        </span>
                      </Button>
                      
                      {arViewActive && !view3DMode && isARSupported && (
                        <Button 
                          className="w-full" 
                          variant={cameraActive ? "default" : "outline"}
                          onClick={toggleCamera}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          <span className="text-xs md:text-sm">
                            {cameraActive ? 'Disable Camera' : 'Enable Camera'}
                          </span>
                        </Button>
                      )}
                      
                      {arViewActive && !view3DMode && (
                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={handleWallScan}
                          disabled={wallScanActive}
                        >
                          <Scan className="h-4 w-4 mr-2" />
                          <span className="text-xs md:text-sm">
                            {wallScanActive ? 'Scanning...' : 'Scan Your Wall'}
                          </span>
                        </Button>
                      )}
                    </div>
                    
                    {artwork.dimensions && (
                      <div className="mt-4 pt-4 border-t">
                        <h3 className="text-xs md:text-sm font-medium mb-2 flex items-center">
                          <Ruler className="h-4 w-4 mr-2 text-muted-foreground" />
                          Actual Dimensions
                        </h3>
                        <p className="text-xs md:text-sm">{artwork.dimensions}</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="3d">
                    <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                      Explore artworks as 3D models or in a virtual environment.
                    </p>
                    <div className="space-y-2 md:space-y-3">
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          setArViewActive(true);
                          toggle3DView(false);
                          toast.success("Virtual view activated! Use controls to adjust size and position");
                        }}
                      >
                        <Monitor className="h-4 w-4 mr-2" />
                        <span className="text-xs md:text-sm">2D Virtual View</span>
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
                        <span className="text-xs md:text-sm">3D Model View</span>
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ARView;
