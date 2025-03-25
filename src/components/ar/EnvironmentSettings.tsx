
import { Button } from '@/components/ui/button';

interface EnvironmentSettingsProps {
  roomEnvironment: string;
  lightingCondition: string;
  onChangeEnvironment: (env: string) => void;
  onChangeLighting: (lighting: string) => void;
}

const EnvironmentSettings = ({
  roomEnvironment,
  lightingCondition,
  onChangeEnvironment,
  onChangeLighting
}: EnvironmentSettingsProps) => {
  return (
    <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-medium mb-3">Environment Settings</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Room Type</h4>
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant={roomEnvironment === 'living' ? 'default' : 'outline'}
              onClick={() => onChangeEnvironment('living')}
            >
              Living Room
            </Button>
            <Button 
              size="sm" 
              variant={roomEnvironment === 'bedroom' ? 'default' : 'outline'}
              onClick={() => onChangeEnvironment('bedroom')}
            >
              Bedroom
            </Button>
            <Button 
              size="sm" 
              variant={roomEnvironment === 'office' ? 'default' : 'outline'}
              onClick={() => onChangeEnvironment('office')}
            >
              Office
            </Button>
            <Button 
              size="sm" 
              variant={roomEnvironment === 'kitchen' ? 'default' : 'outline'}
              onClick={() => onChangeEnvironment('kitchen')}
            >
              Kitchen
            </Button>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Lighting</h4>
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant={lightingCondition === 'daylight' ? 'default' : 'outline'}
              onClick={() => onChangeLighting('daylight')}
            >
              Daylight
            </Button>
            <Button 
              size="sm" 
              variant={lightingCondition === 'evening' ? 'default' : 'outline'}
              onClick={() => onChangeLighting('evening')}
            >
              Evening
            </Button>
            <Button 
              size="sm" 
              variant={lightingCondition === 'dim' ? 'default' : 'outline'}
              onClick={() => onChangeLighting('dim')}
            >
              Dim
            </Button>
            <Button 
              size="sm" 
              variant={lightingCondition === 'bright' ? 'default' : 'outline'}
              onClick={() => onChangeLighting('bright')}
            >
              Bright
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentSettings;
