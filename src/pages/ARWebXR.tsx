
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  RotateCw, RotateCcw, ZoomIn, ZoomOut, 
  Play, Pause, ArrowLeft, RefreshCw
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { MODEL_OPTIONS } from '@/components/ar/ARModelSelector';

// Add type declarations for model-viewer element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          ar?: boolean;
          'ar-modes'?: string;
          'camera-controls'?: boolean;
          'auto-rotate'?: boolean;
          'shadow-intensity'?: string;
          'environment-image'?: string;
          exposure?: string;
          poster?: string;
          'ar-placement'?: string;
          'ar-scale'?: string;
          'interaction-prompt'?: string;
          'touch-action'?: string;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }

  interface Window {
    ModelViewerElement?: {
      canActivateAR?: boolean;
    };
  }
}

// Define a custom interface for the model-viewer element
interface HTMLModelViewerElement extends HTMLElement {
  autoRotate: boolean;
  scale: string;
  resetTurntableRotation: () => void;
  cameraOrbit: string;
  dispatchEvent: (event: CustomEvent) => boolean;
  src?: string;
}

const ARWebXR = () => {
  const navigate = useNavigate();
  const modelViewerRef = useRef<HTMLModelViewerElement | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [arSupported, setArSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId] = useState('1'); // Default to first model
  const isMobile = useIsMobile();

  // Get the selected model
  const selectedModel = MODEL_OPTIONS.find(model => model.id === selectedModelId) || MODEL_OPTIONS[0];

  // Convert Sketchfab embed URL to GLB URL format for model-viewer
  const getModelUrl = () => {
    // This is a fallback model URL if we can't extract the Sketchfab ID
    let modelUrl = '/model.glb'; 
    
    // Try to extract Sketchfab ID from the embed URL and form a GLB URL
    if (selectedModel?.sketchfabId) {
      // Use sketchfabId directly since we already have it
      modelUrl = `https://sketchfab.com/models/${selectedModel.sketchfabId}/download`;
    }
    
    return modelUrl;
  };

  useEffect(() => {
    // Dynamically import the model-viewer Web Component
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    script.onload = () => {
      console.log('model-viewer loaded');
      
      // Check if AR is supported after the component loads
      if (window.ModelViewerElement?.canActivateAR) {
        setArSupported(true);
      } else {
        console.log('AR not supported on this device/browser');
        setArSupported(false);
      }
    };
    script.onerror = () => {
      setError('Failed to load model-viewer component');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Update the model source when the selected model changes
  useEffect(() => {
    if (modelViewerRef.current) {
      setIsLoading(true);
      const modelUrl = getModelUrl();
      modelViewerRef.current.src = modelUrl;
    }
  }, [selectedModelId]);

  const handleModelLoad = () => {
    setIsLoading(false);
    console.log('Model loaded successfully');
  }

  const handleModelError = () => {
    setIsLoading(false);
    setError('Failed to load 3D model');
  }

  const toggleAutoRotate = () => {
    if (modelViewerRef.current) {
      const newState = !autoRotate;
      setAutoRotate(newState);
      modelViewerRef.current.autoRotate = newState;
    }
  };

  const handleZoomIn = () => {
    if (modelViewerRef.current) {
      const currentScale = modelViewerRef.current.scale || '1 1 1';
      const scaleParts = currentScale.split(' ').map(Number);
      const newScale = scaleParts.map(s => s * 1.2).join(' ');
      modelViewerRef.current.scale = newScale;
    }
  };

  const handleZoomOut = () => {
    if (modelViewerRef.current) {
      const currentScale = modelViewerRef.current.scale || '1 1 1';
      const scaleParts = currentScale.split(' ').map(Number);
      const newScale = scaleParts.map(s => s * 0.8).join(' ');
      modelViewerRef.current.scale = newScale;
    }
  };

  const handleRotateLeft = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.dispatchEvent(new CustomEvent('orbit', {
        detail: {
          theta: 5,
          orbit: true
        }
      }));
    }
  };

  const handleRotateRight = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.dispatchEvent(new CustomEvent('orbit', {
        detail: {
          theta: -5,
          orbit: true
        }
      }));
    }
  };

  const resetModel = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.scale = '1 1 1';
      modelViewerRef.current.resetTurntableRotation();
      modelViewerRef.current.cameraOrbit = '0deg 75deg 105%';
    }
  };

  const changeModel = (modelId: string) => {
    setSelectedModelId(modelId);
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Navigation */}
      <div className="absolute top-4 left-4 z-10">
        <Button 
          variant="ghost" 
          className="bg-black/30 text-white backdrop-blur-sm hover:bg-black/50"
          onClick={() => navigate('/ar-models')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Models
        </Button>
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-white text-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading 3D model...</p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-white text-center p-6 max-w-md bg-red-900/60 backdrop-blur-sm rounded-lg">
            <p className="mb-4">{error}</p>
            <Button onClick={() => navigate('/ar-models')}>Return to Models</Button>
          </div>
        </div>
      )}

      {/* Model selection buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {MODEL_OPTIONS.map((model) => (
          <Button 
            key={model.id}
            variant={selectedModelId === model.id ? "default" : "outline"}
            size="sm"
            className="bg-black/30 text-white backdrop-blur-sm hover:bg-black/50"
            onClick={() => changeModel(model.id)}
          >
            {model.name}
          </Button>
        ))}
      </div>

      {/* model-viewer component */}
      <model-viewer
        ref={modelViewerRef as React.RefObject<HTMLElement>}
        src={getModelUrl()}
        alt={`3D model of ${selectedModel.name}`}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate={autoRotate}
        shadow-intensity="1"
        environment-image="neutral"
        exposure="1"
        poster={selectedModel.thumbnail}
        ar-placement="floor"
        ar-scale="fixed"
        interaction-prompt="none"
        touch-action="pan-y"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
        onLoad={handleModelLoad}
        onError={handleModelError}
      >
        {/* AR button will be auto-generated by model-viewer */}
        <div slot="poster" className="w-full h-full flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading 3D model...</p>
          </div>
        </div>

        <div slot="progress-bar" className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
          <div className="h-full bg-artnexus-teal animate-pulse"></div>
        </div>
      </model-viewer>

      {/* Mobile-optimized Controls */}
      {isMobile ? (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex flex-wrap gap-2 justify-center">
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-2 flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="w-10 h-10 rounded-full text-white hover:bg-white/20"
              onClick={toggleAutoRotate}
            >
              {autoRotate ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="w-10 h-10 rounded-full text-white hover:bg-white/20"
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="w-10 h-10 rounded-full text-white hover:bg-white/20" 
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="w-10 h-10 rounded-full text-white hover:bg-white/20" 
              onClick={resetModel}
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-2 flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="w-10 h-10 rounded-full text-white hover:bg-white/20"
              onClick={handleRotateLeft}
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="w-10 h-10 rounded-full text-white hover:bg-white/20" 
              onClick={handleRotateRight}
            >
              <RotateCw className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="absolute bottom-8 right-8 z-10">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 flex flex-wrap gap-2 justify-center">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={toggleAutoRotate}
            >
              {autoRotate ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {autoRotate ? "Pause" : "Auto-rotate"}
            </Button>
            
            <Separator orientation="vertical" className="h-8 bg-white/20" />
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={handleRotateLeft}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/20" 
              onClick={handleRotateRight}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-8 bg-white/20" />
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/20" 
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/20" 
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-8 bg-white/20" />
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/20" 
              onClick={resetModel}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      )}

      {/* AR support notice */}
      {!arSupported && (
        <div className="mt-2 text-center text-sm text-white/70 bg-black/30 backdrop-blur-sm rounded-lg p-2 absolute bottom-4 left-1/2 transform -translate-x-1/2">
          AR features may not be supported on this device or browser
        </div>
      )}

      {/* Model information */}
      <div className="absolute left-4 bottom-4 bg-black/30 backdrop-blur-sm rounded-lg p-3 max-w-xs text-white">
        <h3 className="text-lg font-medium">{selectedModel.name}</h3>
        <p className="text-xs text-white/70">By {selectedModel.creator}</p>
        <p className="text-xs mt-1 text-white/80">{selectedModel.description}</p>
      </div>
    </div>
  );
};

export default ARWebXR;
