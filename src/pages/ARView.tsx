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
  Share2, Save, List, Image, Monitor, Ruler, IndianRupee
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
import { useSketchfabModel } from '@/hooks/use-sketchfab-model';
import SuggestedArtworks from '@/components/ar/SuggestedArtworks';

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
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showSketchfabCollection, setShowSketchfabCollection] = useState(false);
  const [showZeusStatue, setShowZeusStatue] = useState(false);

  const isMobile = useIsMobile();

  const { data: artwork, isLoading, error } = useQuery({
    queryKey: ['artwork', id],
    queryFn: async () => {
      if (!id) return null;
      
      let artworkData = getArtworkById(id);
      
      if (artworkData && artworkData.id === "1") {
        artworkData = {
          ...artworkData,
          title: "Abstract Elegance",
          image: "https://www.freepik.com/search?format=search&img=1&last_filter=img&last_value=1&query=Painting&selection=1",
          description: "A contemporary painting exploring abstract forms and vibrant colors that invoke feelings of elegance and harmony.",
          price: "₹85,000"
        };
      }
      
      if (artworkData) {
        const artistData = getArtistById(artworkData.artistId);
        if (artistData) {
          setArtist(artistData);
        }
      }
      
      return artworkData;
    },
    enabled: !!id,
  });
  
  const { 
    currentModel, 
    isLoading: modelIsLoading, 
    error: modelError, 
    changeModel,
    handleModelLoaded,
    handleModelError
  } = useSketchfabModel(selectedModel, {
    onModelLoadStart: () => {
      toast.info(`Loading ${selectedModel.name}...`);
    },
    onModelLoadComplete: () => {
      toast.success(`Model loaded successfully!`);
    },
    onModelLoadError: (error) => {
      toast.error(`Failed to load model: ${error.message}`);
    }
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
      if (cameraActive) {
        disableCamera();
      }
    };
  }, [id]);

  useEffect(() => {
    if (artwork) {
      const recommended = getRecommendedArtworks(artwork.id, 5);
      setSuggestedArtworks(recommended);
      
      setProcessedImageUrl("https://www.freepik.com/search?format=search&img=1&last_filter=img&last_value=1&query=Painting&selection=1");
      setImageLoading(false);
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
          document.getElementById('ar-camera-feed')?.remove();
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
      if (selectedModel && (!currentModel || currentModel.id !== selectedModel.id)) {
        changeModel(selectedModel);
      }
      toast.success("3D model view activated!");
    } else {
      toast.success("2D artwork view activated");
    }
  };

  const handleModelChange = (model: typeof MODEL_OPTIONS[0]) => {
    setSelectedModel(model);
    changeModel(model);
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
          
          const img = imageRef.current;
          if (img) {
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
    return "https://www.freepik.com/search?format=search&img=1&last_filter=img&last_value=1&query=Painting&selection=1";
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
      const fallbackUrl = "https://www.freepik.com/search?format=search&img=1&last_filter=img&last_value=1&query=Painting&selection=1";
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
          Experience "{artwork?.title || '3D Model'}" in your space with augmented reality
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
                        src={currentModel?.src || selectedModel.src}
                        onLoad={handleModelLoaded}
                        onError={handleModelError}
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
                        transform: `scale(${zoomLevel}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`
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
                                onClick={() => setImageError(false)}
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
                        onClick={() => {
                          setImageLoading(true);
                          setImageError(false);
                        }}
                      >
                        Retry
                      </Button>
                    </div>
                  )}
                  <img 
                    src={getArtworkImageUrl()} 
                    alt={artwork.title} 
                    className={`max-h-full max-w-full object-contain ${imageLoading || imageError ? 'hidden' : ''}`}
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageError(true)}
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
                  onModelChange={handleModelChange}
                />
              )}
              
              <div className="mt-6">
                <Button 
                  className="mb-4"
                  variant="outline"
                  onClick={() => setShowSketchfabCollection(!showSketchfabCollection)}
                >
                  {showSketchfabCollection ? "Hide" : "Show"} Painting Collection
                </Button>
                
                {showSketchfabCollection && (
                  <div className="rounded-lg overflow-hidden mb-6">
                    <iframe 
                      width="100%" 
                      height="480" 
                      src="https://sketchfab.com/playlists/embed?collection=b936f297790e4eee89dea3ede06ad7b5&autostart=0"
                      title="Painting on canvas"
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; fullscreen; xr-spatial-tracking"
                    ></iframe>
                    <p className="text-sm p-3 bg-white dark:bg-gray-800">
                      <a 
                        href="https://sketchfab.com/EmanuelSterpMoga/collections/painting-on-canvas-b936f297790e4eee89dea3ede06ad7b5" 
                        target="_blank" 
                        rel="nofollow" 
                        className="font-bold text-primary"
                      >
                        Painting on canvas
                      </a> by <a 
                        href="https://sketchfab.com/EmanuelSterpMoga" 
                        target="_blank" 
                        rel="nofollow"
                        className="font-bold text-primary"
                      >
                        Emanuel Sterp Moga
                      </a> on <a 
                        href="https://sketchfab.com?utm_source=website&utm_medium=embed&utm_campaign=share-popup" 
                        target="_blank" 
                        rel="nofollow"
                        className="font-bold text-primary"
                      >
                        Sketchfab
                      </a>
                    </p>
                  </div>
                )}
                
                <Button 
                  className="mb-4"
                  variant="outline"
                  onClick={() => setShowZeusStatue(!showZeusStatue)}
                >
                  {showZeusStatue ? "Hide" : "Show"} Zeus Statue Model
                </Button>
                
                {showZeusStatue && (
                  <div className="rounded-lg overflow-hidden">
                    <iframe 
                      title="Zeus Statue" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen; xr-spatial-tracking" 
                      width="100%" 
                      height="480" 
                      src="https://sketchfab.com/models/19dbff643b3b466b9fcf2136ed7f8655/embed?autospin=1&preload=1&transparent=1"
                    ></iframe>
                    <p className="text-sm p-3 bg-white dark:bg-gray-800">
                      <a 
                        href="https://sketchfab.com/3d-models/zeus-statue-19dbff643b3b466b9fcf2136ed7f8655" 
                        target="_blank" 
                        rel="nofollow"
                        className="font-bold text-primary"
                      >
                        Zeus Statue
                      </a> by <a 
                        href="https://sketchfab.com/Katalina07" 
                        target="_blank" 
                        rel="nofollow"
                        className="font-bold text-primary"
                      >
                        Katalina
                      </a> on <a 
                        href="https://sketchfab.com" 
                        target="_blank" 
                        rel="nofollow"
                        className="font-bold text-primary"
                      >
                        Sketchfab
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
                <h2 className="text-xl font-semibold mb-4">{artwork ? artwork.title : currentModel?.name || 'AR View'}</h2>
                
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
                
                <p className="text-muted-foreground mb-6 text-sm md:text-base line-clamp-3 md:line-clamp-none">
                  {view3DMode && currentModel ? currentModel.description : artwork?.description}
                </p>
                
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
                        onClick={handleActivateAR}
                        disabled={!isARSupported || (arViewActive && !view3DMode)}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        {arViewActive && !view3DMode ? 'AR View Active' : 'View in AR'}
                      </Button>
                      
                      {isARSupported && (
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={handleWallScan}
                          disabled={!arViewActive || wallScanActive || view3DMode}
                        >
                          <Scan className="h-4 w-4 mr-2" />
                          {wallScanActive ? 'Scanning...' : 'Scan Wall'}
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="3d">
                    <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                      Experience this artwork in virtual 3D space.
                    </p>
                    <div className="space-y-2 md:space-y-3">
                      <Button
                        className="w-full"
                        onClick={() => toggle3DView(true)}
                        disabled={view3DMode}
                      >
                        <Box className="h-4 w-4 mr-2" />
                        {view3DMode ? '3D View Active' : 'View 3D Model'}
                      </Button>
                      
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => toggle3DView(false)}
                        disabled={!arViewActive || !view3DMode}
                      >
                        <Image className="h-4 w-4 mr-2" />
                        View 2D Artwork
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              {artwork?.price && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mt-4">
                  <h3 className="text-lg font-semibold mb-3">Purchase Information</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium text-xl flex items-center">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      {artwork.price.replace('$', '₹')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground">Availability:</span>
                    <span className="text-green-500 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Available
                    </span>
                  </div>
                  <Button className="w-full">
                    Purchase Artwork
                  </Button>
                </div>
              )}
              
              {artwork && artwork.dimensions && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mt-4">
                  <h3 className="text-lg font-semibold mb-3">Artwork Details</h3>
                  <div className="space-y-2">
                    {artwork.dimensions && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Dimensions:</span>
                        <span className="flex items-center">
                          <Ruler className="h-4 w-4 mr-1" />
                          {artwork.dimensions}
                        </span>
                      </div>
                    )}
                    {artwork.medium && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Medium:</span>
                        <span>{artwork.medium}</span>
                      </div>
                    )}
                    {artwork.year && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Year:</span>
                        <span>{artwork.year}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {suggestedArtworks.length > 0 && (
            <SuggestedArtworks 
              artworks={suggestedArtworks} 
              onSelectArtwork={viewOtherArtwork}
            />
          )}
          
          {recentlyViewed.length > 0 && (
            <SuggestedArtworks
              artworks={recentlyViewed.filter(art => art.id !== id)}
              onSelectArtwork={viewOtherArtwork}
              title="Recently Viewed"
            />
          )}
        </div>
      </div>
      
      <Footer />
      
      {showCollectionDialog && (
        <Dialog open={showCollectionDialog} onOpenChange={setShowCollectionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save to Collection</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              {collections.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  You don't have any collections yet. Create one in your profile.
                </p>
              ) : (
                collections.map(collection => (
                  <div 
                    key={collection.id}
                    className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => addToCollection(collection.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                        <img 
                          src={collection.coverImage || '/placeholder.svg'} 
                          alt={collection.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{collection.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {collection.artworks.length} {collection.artworks.length === 1 ? 'artwork' : 'artworks'}
                        </p>
                      </div>
                    </div>
                    <Save className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))
              )}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => {
                setShowCollectionDialog(false);
                navigate('/collections');
              }}
            >
              <List className="h-4 w-4 mr-2" />
              Manage Collections
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ARView;
