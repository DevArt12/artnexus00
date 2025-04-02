
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { 
  ArrowUp, ArrowDown, ArrowLeft, 
  ArrowRight, Rulers, SlidersHorizontal 
} from 'lucide-react';

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
  const handleUnitChange = (unit: 'cm' | 'inches' | 'feet') => {
    let newWidth = measurements.width;
    let newHeight = measurements.height;
    
    // Convert current measurements to the new unit
    if (measurements.units === 'cm' && unit === 'inches') {
      newWidth = Math.round(measurements.width / 2.54);
      newHeight = Math.round(measurements.height / 2.54);
    } else if (measurements.units === 'cm' && unit === 'feet') {
      newWidth = Math.round(measurements.width / 30.48);
      newHeight = Math.round(measurements.height / 30.48);
    } else if (measurements.units === 'inches' && unit === 'cm') {
      newWidth = Math.round(measurements.width * 2.54);
      newHeight = Math.round(measurements.height * 2.54);
    } else if (measurements.units === 'inches' && unit === 'feet') {
      newWidth = Math.round(measurements.width / 12);
      newHeight = Math.round(measurements.height / 12);
    } else if (measurements.units === 'feet' && unit === 'cm') {
      newWidth = Math.round(measurements.width * 30.48);
      newHeight = Math.round(measurements.height * 30.48);
    } else if (measurements.units === 'feet' && unit === 'inches') {
      newWidth = Math.round(measurements.width * 12);
      newHeight = Math.round(measurements.height * 12);
    }
    
    onMeasurementsChange({
      width: newWidth,
      height: newHeight,
      units: unit
    });
  };
  
  return (
    <div className="absolute bottom-4 left-4 right-4">
      <div className="bg-black/60 backdrop-blur-sm p-3 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white text-sm flex items-center">
            <Rulers className="h-4 w-4 mr-1" />
            Artwork Dimensions
          </span>
          <span className="text-white text-sm font-medium">
            {measurements.width} × {measurements.height} {measurements.units}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <span className="text-white/80 text-xs block mb-1">Width</span>
            <Slider 
              value={[measurements.width]} 
              min={10} 
              max={measurements.units === 'cm' ? 300 : (measurements.units === 'inches' ? 120 : 10)}
              step={1}
              onValueChange={(value) => onMeasurementsChange({...measurements, width: value[0]})}
              className="mb-2"
            />
          </div>
          <div>
            <span className="text-white/80 text-xs block mb-1">Height</span>
            <Slider 
              value={[measurements.height]} 
              min={10} 
              max={measurements.units === 'cm' ? 300 : (measurements.units === 'inches' ? 120 : 10)}
              step={1}
              onValueChange={(value) => onMeasurementsChange({...measurements, height: value[0]})}
              className="mb-2"
            />
          </div>
        </div>
        
        <div className="flex justify-between mb-3">
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant={measurements.units === 'cm' ? 'default' : 'outline'} 
              className={`h-7 px-2 ${measurements.units === 'cm' ? 'bg-primary text-primary-foreground' : 'bg-white/10 text-white border-white/20'}`}
              onClick={() => handleUnitChange('cm')}
            >
              cm
            </Button>
            <Button 
              size="sm" 
              variant={measurements.units === 'inches' ? 'default' : 'outline'} 
              className={`h-7 px-2 ${measurements.units === 'inches' ? 'bg-primary text-primary-foreground' : 'bg-white/10 text-white border-white/20'}`}
              onClick={() => handleUnitChange('inches')}
            >
              in
            </Button>
            <Button 
              size="sm" 
              variant={measurements.units === 'feet' ? 'default' : 'outline'} 
              className={`h-7 px-2 ${measurements.units === 'feet' ? 'bg-primary text-primary-foreground' : 'bg-white/10 text-white border-white/20'}`}
              onClick={() => handleUnitChange('feet')}
            >
              ft
            </Button>
          </div>
          
          <div className="flex items-center gap-1 text-white text-xs">
            <SlidersHorizontal className="h-3 w-3" />
            <span>Position Controls</span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20" onClick={() => onMove(0, -10)}>
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20" onClick={() => onMove(0, 10)}>
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20" onClick={() => onMove(-10, 0)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20" onClick={() => onMove(10, 0)}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtworkMeasurements;
