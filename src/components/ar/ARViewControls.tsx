
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, ZoomOut, RotateCcw, RotateCw, 
  Camera, Save, ArrowDown, ArrowUp, 
  ArrowLeft, ArrowRight, RefreshCw 
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ARViewControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onReset: () => void;
  onTakeScreenshot: () => void;
  onSave: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
}

const ARViewControls = ({
  onZoomIn,
  onZoomOut,
  onRotateLeft,
  onRotateRight,
  onReset,
  onTakeScreenshot,
  onSave,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight
}: ARViewControlsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <>
      <div className={`absolute top-4 right-4 flex flex-col gap-2 ${isMobile ? 'scale-75 -mr-2' : ''}`}>
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-1 flex gap-1">
          <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={onZoomIn} aria-label="Zoom in">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={onZoomOut} aria-label="Zoom out">
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-1 flex gap-1">
          <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={onRotateLeft} aria-label="Rotate left">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={onRotateRight} aria-label="Rotate right">
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
        
        {(onMoveUp && onMoveDown && onMoveLeft && onMoveRight) && (
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-1 grid grid-cols-3 gap-1">
            <div className="col-start-2">
              <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={onMoveUp} aria-label="Move up">
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={onMoveLeft} aria-label="Move left">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={onMoveDown} aria-label="Move down">
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={onMoveRight} aria-label="Move right">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <Button size="icon" variant="ghost" className="h-8 w-8 text-white bg-black/40 backdrop-blur-sm" onClick={onReset} aria-label="Reset view">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className={`absolute top-4 left-4 flex gap-2 ${isMobile ? 'scale-75 -ml-2 flex-col' : ''}`}>
        <Button 
          variant="ghost" 
          className="h-8 bg-black/40 backdrop-blur-sm text-white hover:bg-black/60"
          onClick={onTakeScreenshot}
          aria-label="Take screenshot"
        >
          <Camera className="h-4 w-4 mr-2" />
          {!isMobile && "Capture"}
        </Button>
        <Button 
          variant="ghost" 
          className="h-8 bg-black/40 backdrop-blur-sm text-white hover:bg-black/60"
          onClick={onSave}
          aria-label="Save to collection"
        >
          <Save className="h-4 w-4 mr-2" />
          {!isMobile && "Save"}
        </Button>
      </div>
    </>
  );
};

export default ARViewControls;
