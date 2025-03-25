
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, ArrowLeft, ArrowRight, RotateCcw, Camera, Save } from 'lucide-react';

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
      <div className="absolute top-4 right-4 flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={onZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="secondary" onClick={onZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="secondary" onClick={onRotateLeft}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="secondary" onClick={onRotateRight}>
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="secondary" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="absolute top-4 left-4 flex gap-2">
        <Button size="sm" variant="secondary" onClick={onTakeScreenshot}>
          <Camera className="h-4 w-4 mr-2" />
          Take Photo
        </Button>
        <Button 
          size="sm" 
          variant="secondary"
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
