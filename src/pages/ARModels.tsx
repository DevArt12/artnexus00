
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SketchfabEmbed from '@/components/ar/SketchfabEmbed';
import { MODEL_OPTIONS, ARModel } from '@/components/ar/ARModelSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Box, Search, ExternalLink, Filter, Star } from 'lucide-react';

const ARModels = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedModel, setSelectedModel] = useState<ARModel | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [showZeusStatue, setShowZeusStatue] = useState(false);
  
  // Categories
  const categories = [
    { id: 'all', name: 'All Models' },
    { id: 'abstract', name: 'Abstract' },
    { id: 'sculpture', name: 'Sculpture' },
    { id: 'classical', name: 'Classical' },
    { id: 'painting', name: 'Painting' },
    { id: 'architecture', name: 'Architecture' },
    { id: 'furniture', name: 'Furniture' }
  ];
  
  // Filter models based on search query and category
  const filteredModels = MODEL_OPTIONS.filter(model => {
    const matchesSearch = 
      searchQuery === '' || 
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.creator.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = 
      activeCategory === 'all' || 
      model.description.toLowerCase().includes(activeCategory.toLowerCase());
      
    return matchesSearch && matchesCategory;
  });
  
  // Featured new models
  const newModels = MODEL_OPTIONS.slice(6, 9);
  
  const viewInAR = () => {
    if (selectedModel) {
      navigate(`/ar-view/1`, { state: { selectedModel } });
    }
  };

  const handleModelLoad = () => {
    setIsModelLoading(false);
  };
  
  const handleModelError = () => {
    setIsModelLoading(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Box className="mr-2 h-8 w-8 text-artnexus-purple" /> 
              3D Models Gallery
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore our collection of 3D models that you can view in augmented reality.
              Place these virtual sculptures in your space and experience art in a new dimension.
            </p>
          </div>
        </div>
        
        {/* Zeus Statue */}
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <Star className="mr-2 h-5 w-5 text-yellow-500" />
            <h2 className="text-2xl font-semibold">Featured Model: Zeus Statue</h2>
          </div>
          
          <div className="rounded-lg overflow-hidden mb-6">
            <iframe 
              title="Zeus Statue" 
              frameBorder="0" 
              allowFullScreen 
              allow="autoplay; fullscreen; xr-spatial-tracking" 
              width="100%" 
              height="480" 
              src="https://sketchfab.com/models/19dbff643b3b466b9fcf2136ed7f8655/embed?autospin=1&preload=1&transparent=1"
            ></iframe>
            <p className="text-sm p-3 bg-white dark:bg-gray-800">
              <a 
                href="https://sketchfab.com/3d-models/zeus-statue-19dbff643b3b466b9fcf2136ed7f8655" 
                target="_blank" 
                rel="nofollow"
                className="font-bold text-primary"
              >
                Zeus Statue
              </a> by <a 
                href="https://sketchfab.com/Katalina07" 
                target="_blank" 
                rel="nofollow"
                className="font-bold text-primary"
              >
                Katalina
              </a> on <a 
                href="https://sketchfab.com" 
                target="_blank" 
                rel="nofollow"
                className="font-bold text-primary"
              >
                Sketchfab
              </a>
            </p>
          </div>
        </div>
        
        {/* New Models Showcase */}
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <Star className="mr-2 h-5 w-5 text-yellow-500" />
            <h2 className="text-2xl font-semibold">New Additions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newModels.map(model => (
              <motion.div
                key={model.id}
                className="border rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="aspect-video relative">
                  <SketchfabEmbed 
                    src={model.src} 
                    title={model.name} 
                    onLoad={handleModelLoad} 
                    onError={handleModelError}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-1">{model.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{model.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">By {model.creator}</span>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => setSelectedModel(model)}
                    >
                      Select Model
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Search and Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Filter:</span>
                <select 
                  className="text-sm border rounded px-2 py-1.5"
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Models Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredModels.length > 0 ? (
                filteredModels.map(model => (
                  <motion.div 
                    key={model.id}
                    className={`cursor-pointer rounded-lg overflow-hidden border ${selectedModel?.id === model.id ? 'ring-2 ring-artnexus-purple' : 'hover:border-artnexus-purple'}`}
                    onClick={() => setSelectedModel(model)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="aspect-square relative">
                      <img 
                        src={model.thumbnail} 
                        alt={model.name}
                        className="w-full h-full object-cover"
                      />
                      <a 
                        href={`https://sketchfab.com/3d-models/${model.sketchfabId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 p-1 rounded-full text-white"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium">{model.name}</h3>
                      <p className="text-sm text-muted-foreground">{model.creator}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <p className="text-muted-foreground">No models found matching your search criteria.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Model Preview */}
          <div>
            {selectedModel ? (
              <div className="sticky top-4 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="aspect-video w-full">
                  <SketchfabEmbed 
                    src={selectedModel.src} 
                    title={selectedModel.name}
                    onLoad={handleModelLoad}
                    onError={handleModelError}
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{selectedModel.name}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{selectedModel.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium">Creator</p>
                      <p className="text-sm text-muted-foreground">{selectedModel.creator}</p>
                    </div>
                    <a 
                      href={`https://sketchfab.com/3d-models/${selectedModel.sketchfabId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-artnexus-purple hover:underline flex items-center"
                    >
                      View on Sketchfab
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                  
                  <Button 
                    className="w-full bg-artnexus-purple hover:bg-artnexus-purple/90"
                    onClick={viewInAR}
                  >
                    View in AR
                  </Button>
                </div>
              </div>
            ) : (
              <div className="sticky top-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <Box className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a 3D Model</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose a model from the gallery to view details and experience it in AR
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Painting Collection</h2>
          <div className="rounded-lg overflow-hidden mb-6">
            <iframe 
              width="100%" 
              height="480" 
              src="https://sketchfab.com/playlists/embed?collection=b936f297790e4eee89dea3ede06ad7b5&autostart=0"
              title="Painting on canvas"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen; xr-spatial-tracking"
            ></iframe>
            <p className="text-sm p-3 bg-white dark:bg-gray-800">
              <a 
                href="https://sketchfab.com/EmanuelSterpMoga/collections/painting-on-canvas-b936f297790e4eee89dea3ede06ad7b5" 
                target="_blank" 
                rel="nofollow" 
                className="font-bold text-primary"
              >
                Painting on canvas
              </a> by <a 
                href="https://sketchfab.com/EmanuelSterpMoga" 
                target="_blank" 
                rel="nofollow"
                className="font-bold text-primary"
              >
                Emanuel Sterp Moga
              </a> on <a 
                href="https://sketchfab.com?utm_source=website&utm_medium=embed&utm_campaign=share-popup" 
                target="_blank" 
                rel="nofollow"
                className="font-bold text-primary"
              >
                Sketchfab
              </a>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ARModels;
