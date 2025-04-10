
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Box, Package, Info, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

export interface ARModel {
  id: string;
  name: string;
  src: string;
  thumbnail: string;
  description: string;
  creator: string;
  sketchfabId?: string;
}

export interface ARModelSelectorProps {
  models: ARModel[];
  selectedModel: ARModel;
  onModelChange: (model: ARModel) => void;
}

export const MODEL_OPTIONS: ARModel[] = [
  { 
    id: '1', 
    name: 'Madonna Sculpture', 
    src: 'https://sketchfab.com/models/5e16f3cd478e4c8cb32dede7446a83fb/embed?autostart=1&ui_hint=0&autospin=1&preload=1&transparent=1',
    thumbnail: 'https://images.unsplash.com/photo-1569292560006-92ee85635959?auto=format&fit=crop&w=150&q=80',
    description: 'A detailed Madonna sculpture with intricate details',
    creator: 'jan.zachar',
    sketchfabId: '5e16f3cd478e4c8cb32dede7446a83fb'
  },
  { 
    id: '2', 
    name: 'Greek Antique Vase', 
    src: 'https://sketchfab.com/models/94d1b11f5397484990f8a56e4df191b9/embed?autostart=1&ui_hint=0&autospin=1&preload=1&transparent=1',
    thumbnail: 'https://images.unsplash.com/photo-1580974852861-c381510bc98a?auto=format&fit=crop&w=150&q=80',
    description: 'Ancient Greek pottery vase with traditional patterns',
    creator: 'Tavernier Amaury',
    sketchfabId: '94d1b11f5397484990f8a56e4df191b9'
  },
  { 
    id: '3', 
    name: 'Victorian Framed Painting', 
    src: 'https://sketchfab.com/models/b2895c1c3b42401a949deac049e0051d/embed?autostart=1&ui_hint=0&autospin=1&preload=1&transparent=1', 
    thumbnail: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=150&q=80',
    description: 'PBR Game Ready Victorian era framed painting with ornate gold frame',
    creator: 'Matthew Collings',
    sketchfabId: 'b2895c1c3b42401a949deac049e0051d'
  }
];

const ARModelSelector = ({ models, selectedModel, onModelChange }: ARModelSelectorProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'featured' | 'all'>('featured');
  
  const featuredModels = models.slice(0, 6);
  const allModels = models;
  
  const openSketchfabPage = (e: React.MouseEvent, sketchfabId?: string) => {
    e.stopPropagation();
    if (sketchfabId) {
      window.open(`https://sketchfab.com/3d-models/${sketchfabId}`, '_blank');
    }
  };
  
  return (
    <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium flex items-center">
          <Package className="h-4 w-4 mr-2 text-primary" />
          3D Model Gallery
        </h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs flex items-center"
          >
            <Info className="h-3 w-3 mr-1" />
            {showDetails ? 'Hide details' : 'Show details'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="text-xs flex items-center border-dashed"
            asChild
          >
            <Link to="/ar-webxr">
              <Box className="h-3 w-3 mr-1" />
              Try WebXR Experience
            </Link>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'featured' | 'all')} className="mb-4">
        <TabsList className="w-full">
          <TabsTrigger value="featured" className="flex-1">Featured Models</TabsTrigger>
          <TabsTrigger value="all" className="flex-1">All Models</TabsTrigger>
        </TabsList>
        
        <TabsContent value="featured" className="mt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {featuredModels.map(model => (
              <ModelCard 
                key={model.id}
                model={model}
                isSelected={selectedModel.id === model.id}
                showDetails={showDetails}
                onSelect={() => onModelChange(model)}
                onOpenSketchfab={(e) => openSketchfabPage(e, model.sketchfabId)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="all" className="mt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {allModels.map(model => (
              <ModelCard 
                key={model.id}
                model={model}
                isSelected={selectedModel.id === model.id}
                showDetails={showDetails}
                onSelect={() => onModelChange(model)}
                onOpenSketchfab={(e) => openSketchfabPage(e, model.sketchfabId)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ModelCardProps {
  model: ARModel;
  isSelected: boolean;
  showDetails: boolean;
  onSelect: () => void;
  onOpenSketchfab: (e: React.MouseEvent) => void;
}

const ModelCard = ({ model, isSelected, showDetails, onSelect, onOpenSketchfab }: ModelCardProps) => {
  return (
    <motion.div 
      className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : 'hover:border-primary'}`}
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="aspect-square relative">
        <img 
          src={model.thumbnail} 
          alt={model.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <Button 
          size="icon"
          variant="ghost"
          className="absolute top-1 right-1 h-6 w-6 bg-black/20 hover:bg-black/40 text-white rounded-full p-1"
          onClick={onOpenSketchfab}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-2">
        <p className="text-sm font-medium">{model.name}</p>
        <p className="text-xs text-muted-foreground truncate">{model.creator}</p>
        
        {showDetails && isSelected && (
          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-muted-foreground">{model.description}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ARModelSelector;
