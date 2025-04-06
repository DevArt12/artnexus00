
import { useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

interface SketchfabEmbedProps {
  src: string;
  title: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const SketchfabEmbed = ({ src, title, className, onLoad, onError }: SketchfabEmbedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Set up Intersection Observer to detect when the component is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '200px', // Start loading a bit before it comes into view
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Simulate progressive loading for better UX
  useEffect(() => {
    if (isVisible && isLoading) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 95) {
          clearInterval(interval);
          progress = 95; // Wait for actual onLoad to reach 100%
        }
        setLoadProgress(Math.min(progress, 95));
      }, 300);

      return () => clearInterval(interval);
    }
  }, [isVisible, isLoading]);

  // Reset loading state when src changes
  useEffect(() => {
    if (src) {
      setIsLoading(true);
      setLoadProgress(0);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    setLoadProgress(100);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setIsLoading(false);
    setLoadProgress(0);
    if (onError) onError();
  };

  // API communication with the iframe to listen for load events
  useEffect(() => {
    const handleSketchfabMessage = (event: MessageEvent) => {
      const iframe = iframeRef.current;
      if (!iframe || event.source !== iframe.contentWindow) {
        return;
      }
      
      try {
        const data = JSON.parse(event.data);
        
        // Handle Sketchfab API events
        if (data.type === 'LOADED' || data.type === 'MODEL_LOADED') {
          handleLoad();
        } else if (data.type === 'ERROR') {
          handleError();
        }
      } catch (e) {
        // Not a JSON message or not from Sketchfab
      }
    };

    window.addEventListener('message', handleSketchfabMessage);
    
    return () => {
      window.removeEventListener('message', handleSketchfabMessage);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="mt-4 w-3/4 max-w-xs">
            <Progress value={loadProgress} className="h-2" />
            <p className="text-sm text-center mt-2 text-muted-foreground">
              Loading 3D model... {Math.round(loadProgress)}%
            </p>
          </div>
        </div>
      )}

      {isVisible && (
        <iframe
          ref={iframeRef}
          title={title}
          className={`w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}
          src={src}
          frameBorder="0"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {!isVisible && (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <Skeleton className="w-3/4 h-3/4 rounded-lg" />
        </div>
      )}
    </div>
  );
};

export default SketchfabEmbed;
