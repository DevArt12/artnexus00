
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Box } from 'lucide-react';

export interface ARModel {
  id: string;
  name: string;
  src: string;
  thumbnail: string;
}

interface ARModelSelectorProps {
  models: ARModel[];
  selectedModel: ARModel;
  onModelChange: (model: ARModel) => void;
}

export const MODEL_OPTIONS: ARModel[] = [
  { 
    id: '1', 
    name: 'Sculpture', 
    src: 'https://sketchfab.com/models/213f68e23e8a4807a8edc33a779fcc0c/embed',
    thumbnail: 'https://images.unsplash.com/photo-1576020799627-aeac74d58d0d?auto=format&fit=crop&w=150&q=80'
  },
  { 
    id: '2', 
    name: 'Abstract Art', 
    src: 'https://sketchfab.com/models/a23f1fe3b9714fc9a1f16e6b7cc3115d/embed',
    thumbnail: 'https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?auto=format&fit=crop&w=150&q=80'
  },
  { 
    id: '3', 
    name: 'Vase', 
    src: 'https://sketchfab.com/models/9876254ce92e48ce90292d8d1af265a7/embed',
    thumbnail: 'https://images.unsplash.com/photo-1554188572-9f21c11c0a30?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: '4',
    name: 'Modern Sculpture',
    src: 'https://sketchfab.com/models/42e02439746942e9ad1e9c22482b0f6b/embed',
    thumbnail: 'https://images.unsplash.com/photo-1535567465397-7523840f2ae4?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: '5',
    name: 'Ceramic Pot',
    src: 'https://sketchfab.com/models/e4e9a0e7bfe24ff787516a28b0a10c53/embed',
    thumbnail: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: '6',
    name: 'Art Installation',
    src: 'https://sketchfab.com/models/5c9cc5d76d3d4a6e89fd0c4ce55ba1db/embed',
    thumbnail: 'https://images.unsplash.com/photo-1561839561-b13ccb4a67e5?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: '7',
    name: 'Contemporary Art',
    src: 'https://sketchfab.com/models/1e7e663d27974c7bb1418d7fa2526da0/embed',
    thumbnail: 'https://images.unsplash.com/photo-1554188248-986adbb73be4?auto=format&fit=crop&w=150&q=80'
  }
];

const ARModelSelector = ({ models, selectedModel, onModelChange }: ARModelSelectorProps) => {
  return (
    <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-medium mb-3 flex items-center">
        <Box className="h-4 w-4 mr-2 text-primary" />
        3D Model Options
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
            <div className="p-2 text-center">
              <p className="text-sm font-medium">{model.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ARModelSelector;
