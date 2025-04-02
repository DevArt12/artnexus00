
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Box, Cube } from 'lucide-react';

export interface ARModel {
  id: string;
  name: string;
  src: string;
  thumbnail: string;
  description: string;
  creator: string;
}

interface ARModelSelectorProps {
  models: ARModel[];
  selectedModel: ARModel;
  onModelChange: (model: ARModel) => void;
}

export const MODEL_OPTIONS: ARModel[] = [
  { 
    id: '1', 
    name: 'Modern Sculpture', 
    src: 'https://sketchfab.com/models/c362d5bf3d7d48818f64f5965bed2537/embed?autostart=1&ui_hint=0',
    thumbnail: 'https://images.unsplash.com/photo-1591123720164-de1348028a82?auto=format&fit=crop&w=150&q=80',
    description: 'Contemporary abstract sculpture with flowing forms',
    creator: 'ArtNexus Gallery'
  },
  { 
    id: '2', 
    name: 'Abstract Waves', 
    src: 'https://sketchfab.com/models/c89c508a749b4264aa28796b4ed72599/embed?autostart=1&ui_hint=0',
    thumbnail: 'https://images.unsplash.com/photo-1547333590-47fae5f58d21?auto=format&fit=crop&w=150&q=80',
    description: 'Fluid abstract art piece with dynamic movement',
    creator: 'Modern Art Studio'
  },
  { 
    id: '3', 
    name: 'Ceramic Vessel', 
    src: 'https://sketchfab.com/models/cb122aec94e24e9e8860145f9a11d4c9/embed?autostart=1&ui_hint=0',
    thumbnail: 'https://images.unsplash.com/photo-1578749471545-8c1116b13793?auto=format&fit=crop&w=150&q=80',
    description: 'Handcrafted ceramic vessel with traditional patterns',
    creator: 'Artisan Collective'
  },
  {
    id: '4',
    name: 'Digital Sculpture',
    src: 'https://sketchfab.com/models/5cd686bf47664174b3b0934709cbf0f0/embed?autostart=1&ui_hint=0',
    thumbnail: 'https://images.unsplash.com/photo-1559036540-c1b1e07244b4?auto=format&fit=crop&w=150&q=80',
    description: 'Digitally created sculpture exploring geometric forms',
    creator: 'Digital Arts Lab'
  },
  {
    id: '5',
    name: 'Glass Art',
    src: 'https://sketchfab.com/models/d6521362b37b48e3b7849c7abd6e7bf9/embed?autostart=1&ui_hint=0', 
    thumbnail: 'https://images.unsplash.com/photo-1605991644230-eff97837d12f?auto=format&fit=crop&w=150&q=80',
    description: 'Blown glass artwork with vibrant colors and textures',
    creator: 'Glass Works Studio'
  },
  {
    id: '6',
    name: 'Bronze Figure',
    src: 'https://sketchfab.com/models/660d8b93a2b84caf971b9d35c9c06cf9/embed?autostart=1&ui_hint=0',
    thumbnail: 'https://images.unsplash.com/photo-1555850224-f6a0e863f5c2?auto=format&fit=crop&w=150&q=80',
    description: 'Cast bronze figurative sculpture with patina finish',
    creator: 'Foundry Workshop'
  }
];

const ARModelSelector = ({ models, selectedModel, onModelChange }: ARModelSelectorProps) => {
  return (
    <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-medium mb-3 flex items-center">
        <Cube className="h-4 w-4 mr-2 text-primary" />
        3D Model Gallery
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {models.map(model => (
          <div 
            key={model.id}
            className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${selectedModel.id === model.id ? 'ring-2 ring-primary' : 'hover:border-primary'}`}
            onClick={() => onModelChange(model)}
          >
            <div className="aspect-square">
              <img 
                src={model.thumbnail} 
                alt={model.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2">
              <p className="text-sm font-medium">{model.name}</p>
              <p className="text-xs text-muted-foreground truncate">{model.creator}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ARModelSelector;
