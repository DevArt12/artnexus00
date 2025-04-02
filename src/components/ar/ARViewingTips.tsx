
import { Camera, Home, Box } from 'lucide-react';

const ARViewingTips = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">AR Viewing Tips</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Camera className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-medium mb-2">Good Lighting</h3>
          <p className="text-sm text-muted-foreground">Use AR in well-lit environments for the best experience</p>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Home className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-medium mb-2">Steady Movement</h3>
          <p className="text-sm text-muted-foreground">Move your device slowly for accurate surface detection</p>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Box className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-medium mb-2">3D Models</h3>
          <p className="text-sm text-muted-foreground">Try our Sketchfab 3D model integrations for a richer experience</p>
        </div>
      </div>
    </div>
  );
};

export default ARViewingTips;
