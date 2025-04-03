
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MODEL_OPTIONS, ARModel } from '@/components/ar/ARModelSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Cube, Search, Box, ExternalLink, Filter } from 'lucide-react';

const ARModels = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedModel, setSelectedModel] = useState<ARModel | null>(null);
  
  // Categories
  const categories = [
    { id: 'all', name: 'All Models' },
    { id: 'abstract', name: 'Abstract' },
    { id: 'sculpture', name: 'Sculpture' },
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
  
  const viewInAR = () => {
    if (selectedModel) {
      navigate(`/ar-view/1`, { state: { selectedModel } });
    }
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
                  <iframe 
                    title={selectedModel.name}
                    src={selectedModel.src}
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    allowFullScreen
                  ></iframe>
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
      </div>
      
      <Footer />
    </div>
  );
};

export default ARModels;
