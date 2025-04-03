
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Ruler } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export interface ARMeasurement {
  width: number;
  height: number;
  units: 'cm' | 'in';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();
  
  const handleChangeWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value);
    if (!isNaN(width)) {
      onMeasurementsChange({
        ...measurements,
        width
      });
    }
  };
  
  const handleChangeHeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(e.target.value);
    if (!isNaN(height)) {
      onMeasurementsChange({
        ...measurements,
        height
      });
    }
  };
  
  const handleChangeUnits = (units: 'cm' | 'in') => {
    onMeasurementsChange({
      ...measurements,
      units
    });
  };
  
  const moveAmount = 10;
  
  return (
    <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/40 backdrop-blur-sm rounded-lg p-2 text-white ${isMobile ? 'w-[90%]' : 'w-auto'}`}>
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Ruler className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">
            {measurements.width} × {measurements.height} {measurements.units}
          </span>
        </div>
        <div className="text-xs">
          {isExpanded ? '▲ Collapse' : '▼ Expand'}
        </div>
      </div>
      
      {isExpanded && (
        <div className={`mt-2 pt-2 border-t border-white/20 ${isMobile ? 'flex flex-col gap-2' : 'grid grid-cols-3 gap-4'}`}>
          <div className="flex flex-col gap-1">
            <Label htmlFor="width" className="text-xs">Width</Label>
            <div className="flex">
              <Input
                id="width"
                type="number"
                value={measurements.width}
                onChange={handleChangeWidth}
                className="h-8 text-xs bg-transparent border-white/30 text-white"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <Label htmlFor="height" className="text-xs">Height</Label>
            <div className="flex">
              <Input
                id="height"
                type="number"
                value={measurements.height}
                onChange={handleChangeHeight}
                className="h-8 text-xs bg-transparent border-white/30 text-white"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <Label htmlFor="units" className="text-xs">Units</Label>
            <Select
              value={measurements.units}
              onValueChange={(value: 'cm' | 'in') => handleChangeUnits(value)}
            >
              <SelectTrigger id="units" className="h-8 text-xs bg-transparent border-white/30 text-white">
                <SelectValue placeholder="Units" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cm">cm</SelectItem>
                <SelectItem value="in">inches</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`col-span-3 mt-2 grid grid-cols-3 gap-1 ${isMobile ? 'scale-90 mx-auto' : ''}`}>
            <div></div>
            <Button size="icon" variant="outline" className="h-8 w-8 border-white/30" onClick={() => onMove(0, -moveAmount)}>
              <ArrowUp className="h-4 w-4" />
            </Button>
            <div></div>
            
            <Button size="icon" variant="outline" className="h-8 w-8 border-white/30" onClick={() => onMove(-moveAmount, 0)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div></div>
            <Button size="icon" variant="outline" className="h-8 w-8 border-white/30" onClick={() => onMove(moveAmount, 0)}>
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <div></div>
            <Button size="icon" variant="outline" className="h-8 w-8 border-white/30" onClick={() => onMove(0, moveAmount)}>
              <ArrowDown className="h-4 w-4" />
            </Button>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtworkMeasurements;
