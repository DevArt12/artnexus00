
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Box, Package, Info, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface ARModel {
  id: string;
  name: string;
  src: string;
  thumbnail: string;
  description: string;
  creator: string;
  sketchfabId?: string;
}

interface ARModelSelectorProps {
  models: ARModel[];
  selectedModel: ARModel;
  onModelChange: (model: ARModel) => void;
}

// Enhanced model options with additional Sketchfab models
export const MODEL_OPTIONS: ARModel[] = [
  { 
    id: '1', 
    name: 'Modern Sculpture', 
    src: 'https://sketchfab.com/models/c362d5bf3d7d48818f64f5965bed2537/embed?autostart=1&ui_hint=0',
    thumbnail: 'https://images.unsplash.com/photo-1591123720164-de1348028a82?auto=format&fit=crop&w=150&q=80',
    description: 'Contemporary abstract sculpture with flowing forms',
    creator: 'ArtNexus Gallery',
    sketchfabId: 'c362d5bf3d7d48818f64f5965bed2537'
  },
  { 
    id: '2', 
    name: 'Abstract Waves', 
    src: 'https://sketchfab.com/models/c89c508a749b4264aa28796b4ed72599/embed?autostart=1&ui_hint=0',
    thumbnail: 'https://images.unsplash.com/photo-1547333590-47fae5f58d21?auto=format&fit=crop&w=150&q=80',
    description: 'Fluid abstract art piece with dynamic movement',
    creator: 'Modern Art Studio',
    sketchfabId: 'c89c508a749b4264aa28796b4ed72599'
  },
  { 
    id: '3', 
    name: 'Ceramic Vessel', 
    src: 'https://sketchfab.com/models/cb122aec94e24e9e8860145f9a11d4c9/embed?autostart=1&ui_hint=0',
    thumbnail: 'https://images.unsplash.com/photo-1578749471545-8c1116b13793?auto=format&fit=crop&w=150&q=80',
    description: 'Handcrafted ceramic vessel with traditional patterns',
    creator: 'Artisan Collective',
    sketchfabId: 'cb122aec94e24e9e8860145f9a11d4c9'
  },
  {
    id: '4',
    name: 'Digital Sculpture',
    src: 'https://sketchfab.com/models/5cd686bf47664174b3b0934709cbf0f0/embed?autostart=1&ui_hint=0',
    thumbnail: 'https://images.unsplash.com/photo-1559036540-c1b1e07244b4?auto=format&fit=crop&w=150&q=80',
    description: 'Digitally created sculpture exploring geometric forms',
    creator: 'Digital Arts Lab',
    sketchfabId: '5cd686bf47664174b3b0934709cbf0f0'
  },
  {
    id: '5',
    name: 'Glass Art',
    src: 'https://sketchfab.com/models/d6521362b37b48e3b7849c7abd6e7bf9/embed?autostart=1&ui_hint=0', 
    thumbnail: 'https://images.unsplash.com/photo-1605991644230-eff97837d12f?auto=format&fit=crop&w=150&q=80',
    description: 'Blown glass artwork with vibrant colors and textures',
    creator: 'Glass Works Studio',
    sketchfabId: 'd6521362b37b48e3b7849c7abd6e7bf9'
  },
  {
    id: '6',
    name: 'Bronze Figure',
    src: 'https://sketchfab.com/models/660d8b93a2b84caf971b9d35c9c06cf9/embed?autostart=1&ui_hint=0',
    thumbnail: 'https://images.unsplash.com/photo-1555850224-f6a0e863f5c2?auto=format&fit=crop&w=150&q=80',
    description: 'Cast bronze figurative sculpture with patina finish',
    creator: 'Foundry Workshop',
    sketchfabId: '660d8b93a2b84caf971b9d35c9c06cf9'
  },
  // New Sketchfab models
  {
    id: '7',
    name: 'Marble Bust',
    src: 'https://sketchfab.com/models/a877ea4724724344a4fecb6be6d639ce/embed?autostart=1&ui_hint=0',
    thumbnail: 'https://images.unsplash.com/photo-1623957901844-266b5d922046?auto=format&fit=crop&w=150&q=80',
    description: 'Classical marble bust with detailed facial features',
    creator: 'Heritage Museum',
    sketchfabId: 'a877ea4724724344a4fecb6be6d639ce'
  },
  {
    id: '8',
    name: 'Kinetic Sculpture',
    src: 'https://sketchfab.com/models/7w5L6i62ceZXtc4pYjaZgxLXEFu/embed?autostart=1&ui_hint=0',
    thumbnail: 'https://images.unsplash.com/photo-1569757175623-61a733260710?auto=format&fit=crop&w=150&q=80',
    description: 'Interactive kinetic sculpture that responds to movement',
    creator: 'Interactive Arts Lab',
    sketchfabId: '7w5L6i62ceZXtc4pYjaZgxLXEFu'
  },
  {
    id: '9',
    name: 'Modern Architecture',
    src: 'https://sketchfab.com/models/42447f92fd3f4d8197a21792bdbe39f8/embed?autostart=1&ui_hint=0',
    thumbnail: 'https://images.unsplash.com/photo-1545486332-9e0999c535b2?auto=format&fit=crop&w=150&q=80',
    description: 'Contemporary architectural model with innovative design elements',
    creator: 'Design Studio',
    sketchfabId: '42447f92fd3f4d8197a21792bdbe39f8'
  },
  {
    id: '10',
    name: 'Abstract Form',
    src: 'https://sketchfab.com/models/27a671dd3f4a4842a0bc618461ab7914/embed?autostart=1&ui_hint=0',
    thumbnail: 'https://images.unsplash.com/photo-1575995872537-3793d29d972c?auto=format&fit=crop&w=150&q=80',
    description: 'Abstract sculptural form exploring negative space',
    creator: 'Contemporary Gallery',
    sketchfabId: '27a671dd3f4a4842a0bc618461ab7914'
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
