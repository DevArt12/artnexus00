
import { useState, useEffect } from 'react';
import { ARModel } from '@/components/ar/ARModelSelector';

interface UseSketchfabModelOptions {
  onModelLoadStart?: () => void;
  onModelLoadComplete?: () => void;
  onModelLoadError?: (error: Error) => void;
}

export const useSketchfabModel = (initialModel?: ARModel, options?: UseSketchfabModelOptions) => {
  const [currentModel, setCurrentModel] = useState<ARModel | null>(initialModel || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [glbUrl, setGlbUrl] = useState<string | null>(null);
  
  // Extract model information and attempt to get a GLB URL
  useEffect(() => {
    if (!currentModel) {
      setGlbUrl(null);
      return;
    }
    
    const extractGlbUrl = async () => {
      setIsLoading(true);
      if (options?.onModelLoadStart) {
        options.onModelLoadStart();
      }
      
      try {
        // In a real implementation, we would make API calls to Sketchfab
        // to get download URLs, but for this demo we'll construct a URL
        // that points to Sketchfab's download endpoint
        if (currentModel.sketchfabId) {
          // This URL format is for demonstration only
          const url = `https://sketchfab.com/models/${currentModel.sketchfabId}/download`;
          setGlbUrl(url);
        } else {
          // Fallback to using a static model
          setGlbUrl('/model.glb');
        }
        
        setIsLoading(false);
        if (options?.onModelLoadComplete) {
          options.onModelLoadComplete();
        }
      } catch (err) {
        setIsLoading(false);
        setError(err as Error);
        if (options?.onModelLoadError) {
          options.onModelLoadError(err as Error);
        }
      }
    };
    
    extractGlbUrl();
  }, [currentModel]);
  
  // Function to change the current model
  const changeModel = (model: ARModel) => {
    setCurrentModel(model);
  };
  
  // Return the hook state and functions
  return {
    currentModel,
    isLoading,
    error,
    glbUrl,
    changeModel
  };
};

export default useSketchfabModel;
