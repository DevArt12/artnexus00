
import { Camera, Home, Box } from 'lucide-react';
import { useState } from 'react';

const ARViewingTips = () => {
  const [expandedTip, setExpandedTip] = useState<number | null>(null);
  
  const tips = [
    {
      icon: Camera,
      title: "Good Lighting",
      shortDesc: "Use AR in well-lit environments for the best experience",
      longDesc: "AR tracking works best in spaces with consistent, bright lighting. Avoid areas with very harsh shadows or overly bright spots that might confuse the camera sensors."
    },
    {
      icon: Home,
      title: "Steady Movement",
      shortDesc: "Move your device slowly for accurate surface detection",
      longDesc: "Quick or jerky movements can cause the AR tracking to lose position. Hold your device with both hands and move slowly when placing artworks in your space."
    },
    {
      icon: Box,
      title: "3D Models",
      shortDesc: "Try our Sketchfab 3D model integrations for a richer experience",
      longDesc: "Our 3D models are fully interactive - you can rotate, zoom, and explore them from all angles. They're great for visualizing sculptures and installations in your space."
    }
  ];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">AR Viewing Tips</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tips.map((tip, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center text-center cursor-pointer transition-all duration-300 ${expandedTip === index ? 'bg-primary/5 p-4 rounded-lg' : ''}`}
            onClick={() => setExpandedTip(expandedTip === index ? null : index)}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <tip.icon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-medium mb-2">{tip.title}</h3>
            <p className="text-sm text-muted-foreground">
              {expandedTip === index ? tip.longDesc : tip.shortDesc}
            </p>
            {expandedTip !== index && (
              <p className="text-xs text-primary mt-2">Tap for more info</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ARViewingTips;
