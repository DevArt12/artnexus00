
import { useState, useEffect } from 'react';
import { ARModel } from '@/components/ar/ARModelSelector';
import { toast } from 'sonner';

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
  const [loadAttempts, setLoadAttempts] = useState<Record<string, number>>({});
  
  // Extract model information and attempt to get a GLB URL
  useEffect(() => {
    if (!currentModel) {
      setGlbUrl(null);
      return;
    }
    
    const extractGlbUrl = async () => {
      setIsLoading(true);
      setError(null);
      
      // Track load attempts for retry logic
      setLoadAttempts(prev => ({
        ...prev,
        [currentModel.id]: (prev[currentModel.id] || 0) + 1
      }));
      
      if (options?.onModelLoadStart) {
        options.onModelLoadStart();
      }
      
      try {
        // For this implementation, we construct a URL to Sketchfab's embed with specific parameters
        // that optimize loading and visual presentation
        if (currentModel.sketchfabId) {
          // Create direct URL to the model with specific parameters
          const url = `https://sketchfab.com/models/${currentModel.sketchfabId}/embed?autostart=1&ui_hint=0&autospin=1&preload=1&transparent=1`;
          setCurrentModel({
            ...currentModel,
            src: url
          });
          
          // In a real implementation we would fetch the actual GLB download URL
          // This is a placeholder that would be replaced with actual API calls
          setGlbUrl(`https://sketchfab.com/models/${currentModel.sketchfabId}/download`);
        } else {
          // Fallback to using a static model
          setGlbUrl('/model.glb');
        }
        
        setIsLoading(false);
        if (options?.onModelLoadComplete) {
          options.onModelLoadComplete();
        }
        
        toast.success(`${currentModel.name} ready to view`);
      } catch (err) {
        setIsLoading(false);
        const error = err as Error;
        setError(error);
        
        // Handle retry logic
        const attempts = loadAttempts[currentModel.id] || 0;
        if (attempts <= 1) {
          toast.error("Failed to load model. Retrying...");
          setTimeout(() => extractGlbUrl(), 1500);
        } else {
          toast.error("Could not load 3D model. Please try another model.");
          if (options?.onModelLoadError) {
            options.onModelLoadError(error);
          }
        }
      }
    };
    
    extractGlbUrl();
  }, [currentModel?.id]);
  
  // Function to change the current model
  const changeModel = (model: ARModel) => {
    if (model.id === currentModel?.id) return;
    setCurrentModel(model);
    setError(null);
  };
  
  const handleModelLoaded = () => {
    setIsLoading(false);
    if (options?.onModelLoadComplete) {
      options.onModelLoadComplete();
    }
    toast.success(`${currentModel?.name || 'Model'} loaded successfully!`);
  };

  const handleModelError = () => {
    setIsLoading(false);
    
    const error = new Error(`Failed to load model: ${currentModel?.name}`);
    setError(error);
    
    const attempts = currentModel ? loadAttempts[currentModel.id] || 0 : 0;
    
    if (attempts <= 1 && currentModel) {
      toast.error("Failed to load 3D model. Retrying...");
      
      setTimeout(() => {
        changeModel(currentModel);
      }, 1500);
    } else {
      toast.error("Could not load 3D model. Please try another model or check your connection.");
      if (options?.onModelLoadError) {
        options.onModelLoadError(error);
      }
    }
  };
  
  // Return the hook state and functions
  return {
    currentModel,
    isLoading,
    error,
    glbUrl,
    changeModel,
    handleModelLoaded,
    handleModelError
  };
};

export default useSketchfabModel;
