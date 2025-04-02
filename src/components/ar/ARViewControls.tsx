
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, ZoomOut, RotateCcw, RotateCw, 
  Camera, Save, ArrowDown, ArrowUp, 
  ArrowLeft, ArrowRight, RefreshCw 
} from 'lucide-react';

interface ARViewControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onReset: () => void;
  onTakeScreenshot: () => void;
  onSave: () => void;
}

const ARViewControls = ({
  onZoomIn,
  onZoomOut,
  onRotateLeft,
  onRotateRight,
  onReset,
  onTakeScreenshot,
  onSave
}: ARViewControlsProps) => {
  return (
    <>
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-1 flex gap-1">
          <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={onZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={onZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-1 flex gap-1">
          <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={onRotateLeft}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={onRotateRight}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
        
        <Button size="icon" variant="ghost" className="h-8 w-8 text-white bg-black/40 backdrop-blur-sm" onClick={onReset}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="absolute top-4 left-4 flex gap-2">
        <Button 
          variant="ghost" 
          className="h-8 bg-black/40 backdrop-blur-sm text-white hover:bg-black/60"
          onClick={onTakeScreenshot}
        >
          <Camera className="h-4 w-4 mr-2" />
          Capture
        </Button>
        <Button 
          variant="ghost" 
          className="h-8 bg-black/40 backdrop-blur-sm text-white hover:bg-black/60"
          onClick={onSave}
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
    </>
  );
};

export default ARViewControls;
