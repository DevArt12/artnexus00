
import { Camera, Home, Box, Scan, Maximize, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    },
    {
      icon: Scan,
      title: "Surface Scanning",
      shortDesc: "Wait for surface detection before placing artwork",
      longDesc: "Let your device scan the environment thoroughly before placing artwork. Look for on-screen indicators that show when a surface has been detected."
    },
    {
      icon: Maximize,
      title: "Size Adjustment",
      shortDesc: "Use pinch gestures to resize artwork to fit your space",
      longDesc: "You can adjust the size of artwork by pinching to zoom in or out. This helps you visualize exactly how a piece would look at different scales in your space."
    },
    {
      icon: Lightbulb,
      title: "Try Different Angles",
      shortDesc: "Move around to see artwork from multiple perspectives",
      longDesc: "Walk around placed artwork to see it from different angles and distances. This gives you a more complete understanding of how it would look in your space."
    }
  ];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">AR Viewing Tips</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tips.map((tip, index) => (
          <motion.div 
            key={index} 
            className={`flex flex-col items-center text-center cursor-pointer transition-all duration-300 p-4 rounded-lg ${
              expandedTip === index ? 'bg-primary/5 shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
            onClick={() => setExpandedTip(expandedTip === index ? null : index)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            layout
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <tip.icon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-medium mb-2">{tip.title}</h3>
            <AnimatePresence mode="wait">
              {expandedTip === index ? (
                <motion.p 
                  key="long"
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {tip.longDesc}
                </motion.p>
              ) : (
                <motion.p 
                  key="short"
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {tip.shortDesc}
                </motion.p>
              )}
            </AnimatePresence>
            
            {expandedTip !== index && (
              <motion.p 
                className="text-xs text-primary mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Tap for more info
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ARViewingTips;
