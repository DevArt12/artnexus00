
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ARModel } from '@/components/ar/ARModelSelector';

interface UseSketchfabModelsOptions {
  onModelLoadStart?: () => void;
  onModelLoadComplete?: () => void;
  onModelLoadError?: (error: Error) => void;
}

export const useSketchfabModels = (options?: UseSketchfabModelsOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState<ARModel | null>(null);
  const [modelLoadAttempts, setModelLoadAttempts] = useState<Record<string, number>>({});

  const changeModel = (model: ARModel) => {
    if (options?.onModelLoadStart) {
      options.onModelLoadStart();
    }
    
    setIsLoading(true);
    setCurrentModel(model);
    
    // Track load attempts for this model
    setModelLoadAttempts(prev => ({
      ...prev,
      [model.id]: (prev[model.id] || 0) + 1
    }));
    
    // We'll let the SketchfabEmbed component handle the actual loading process
    // This hook just manages the state around it
  };

  const handleModelLoaded = () => {
    setIsLoading(false);
    if (options?.onModelLoadComplete) {
      options.onModelLoadComplete();
    }
    if (currentModel) {
      toast.success(`${currentModel.name} loaded successfully!`);
    }
  };

  const handleModelError = () => {
    setIsLoading(false);
    
    const error = new Error(`Failed to load model: ${currentModel?.name}`);
    if (options?.onModelLoadError) {
      options.onModelLoadError(error);
    }
    
    const attempts = currentModel ? modelLoadAttempts[currentModel.id] || 0 : 0;
    
    if (attempts <= 1) {
      toast.error("Failed to load 3D model. Retrying...");
      
      // Retry once
      if (currentModel) {
        setTimeout(() => {
          changeModel(currentModel);
        }, 1000);
      }
    } else {
      toast.error("Could not load 3D model. Please try another model or check your connection.");
    }
  };

  return {
    isLoading,
    currentModel,
    changeModel,
    handleModelLoaded,
    handleModelError
  };
};

export default useSketchfabModels;
