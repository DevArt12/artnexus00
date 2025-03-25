
import { Slider } from '@/components/ui/slider';
import { Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ARMeasurement {
  width: number;
  height: number;
  units: 'cm' | 'inches' | 'feet';
}

interface ArtworkMeasurementsProps {
  measurements: ARMeasurement;
  onMeasurementsChange: (measurements: ARMeasurement) => void;
  onMove: (dx: number, dy: number) => void;
}

const ArtworkMeasurements = ({ 
  measurements, 
  onMeasurementsChange,
  onMove
}: ArtworkMeasurementsProps) => {
  return (
    <div className="absolute bottom-4 left-4 right-4">
      <div className="bg-black/60 p-3 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white text-sm">Artwork Measurements:</span>
          <span className="text-white text-sm">
            {measurements.width} x {measurements.height} {measurements.units}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-white text-xs block mb-1">Width</span>
            <Slider 
              value={[measurements.width]} 
              min={20} 
              max={200} 
              step={1}
              onValueChange={(value) => onMeasurementsChange({...measurements, width: value[0]})}
              className="mb-2"
            />
          </div>
          <div>
            <span className="text-white text-xs block mb-1">Height</span>
            <Slider 
              value={[measurements.height]} 
              min={20} 
              max={200} 
              step={1}
              onValueChange={(value) => onMeasurementsChange({...measurements, height: value[0]})}
              className="mb-2"
            />
          </div>
        </div>
        <div className="flex space-x-3 justify-center mt-2">
          <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20" onClick={() => onMove(0, -10)}>
            <Move className="h-4 w-4 mr-1" />
            Up
          </Button>
          <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20" onClick={() => onMove(0, 10)}>
            <Move className="h-4 w-4 mr-1" />
            Down
          </Button>
          <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20" onClick={() => onMove(-10, 0)}>
            <Move className="h-4 w-4 mr-1" />
            Left
          </Button>
          <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20" onClick={() => onMove(10, 0)}>
            <Move className="h-4 w-4 mr-1" />
            Right
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtworkMeasurements;
