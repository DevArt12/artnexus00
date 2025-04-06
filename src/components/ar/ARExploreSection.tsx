
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Box, ArrowRight, Image, ScanLine } from 'lucide-react';
import { ARModel, MODEL_OPTIONS } from './ARModelSelector';
import { Artwork, artworks, getArtistById } from '@/data/mockData';
import { marketplaceItems } from '@/data/marketplaceData';

const ARExploreSection = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'paintings' | 'sculptures'>('paintings');
  
  // Replace paintings with one item from marketplace data
  const paintings = [
    {
      id: marketplaceItems[0].id,
      title: marketplaceItems[0].title,
      description: marketplaceItems[0].description,
      image: marketplaceItems[0].image,
      artistId: marketplaceItems[0].artist.id,
      medium: marketplaceItems[0].medium,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      categories: [marketplaceItems[0].category],
      dimensions: marketplaceItems[0].dimensions || "24 x 36 inches",
      price: marketplaceItems[0].price,
      onSale: marketplaceItems[0].status === "available"
    }
  ];
  
  // Filter sculptures from artworks
  const sculptures = artworks.filter(artwork => 
    artwork.categories.some(cat => 
      ['sculpture', '3d', 'installation', 'ceramic'].includes(cat.toLowerCase())
    )
  ).slice(0, 4);
  
  // Use our new 3D models
  const featuredModels = MODEL_OPTIONS;
  
  const handleArtworkSelect = (artworkId: string) => {
    navigate(`/ar-view/${artworkId}`);
  };
  
  const handleModelSelect = (model: ARModel) => {
    // Navigate to the WebXR experience with the selected model
    navigate('/ar-webxr', { state: { selectedModel: model } });
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Explore Art in AR</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
              Experience artwork in your space with our augmented reality viewer. 
              View paintings on your walls or place sculptures on your tables.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/ar-view/' + artworks[0].id)}
            className="mt-4 md:mt-0 bg-artnexus-purple hover:bg-artnexus-purple/90"
          >
            Try AR Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 2D Artworks */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Image className="h-5 w-5 mr-2 text-artnexus-purple" />
                  <h3 className="text-xl font-semibold">2D Artworks in AR</h3>
                </div>
                
                <Tabs defaultValue="paintings" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger 
                      value="paintings" 
                      onClick={() => setSelectedTab('paintings')}
                    >
                      Paintings
                    </TabsTrigger>
                    <TabsTrigger 
                      value="sculptures"
                      onClick={() => setSelectedTab('sculptures')}
                    >
                      Other Artworks
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="paintings" className="mt-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {paintings.map((artwork) => (
                        <ArtworkARCard 
                          key={artwork.id} 
                          artwork={artwork} 
                          onClick={() => handleArtworkSelect(artwork.id)} 
                        />
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="sculptures" className="mt-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {sculptures.map((artwork) => (
                        <ArtworkARCard 
                          key={artwork.id} 
                          artwork={artwork} 
                          onClick={() => handleArtworkSelect(artwork.id)} 
                        />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* 3D Models */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Box className="h-5 w-5 mr-2 text-artnexus-purple" />
                  <h3 className="text-xl font-semibold">3D Models</h3>
                </div>
                
                <div className="space-y-4">
                  {featuredModels.map((model) => (
                    <ModelARCard 
                      key={model.id} 
                      model={model} 
                      onClick={() => handleModelSelect(model)} 
                    />
                  ))}
                </div>
                
                <div className="mt-6 border-t pt-4">
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <ScanLine className="h-4 w-4 mr-2" />
                    <p>How AR works</p>
                  </div>
                  
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start">
                      <span className="bg-artnexus-purple/10 text-artnexus-purple rounded-full h-5 w-5 flex items-center justify-center mr-2 mt-0.5 text-xs font-bold">1</span>
                      <span>Select any artwork or 3D model</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-artnexus-purple/10 text-artnexus-purple rounded-full h-5 w-5 flex items-center justify-center mr-2 mt-0.5 text-xs font-bold">2</span>
                      <span>Scan your space with your device's camera</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-artnexus-purple/10 text-artnexus-purple rounded-full h-5 w-5 flex items-center justify-center mr-2 mt-0.5 text-xs font-bold">3</span>
                      <span>Tap to place the artwork in your environment</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

const ArtworkARCard = ({ artwork, onClick }: { artwork: Artwork, onClick: () => void }) => {
  // Get the artist information
  const artist = getArtistById(artwork.artistId);
  
  return (
    <motion.div 
      className="cursor-pointer rounded-lg overflow-hidden group"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
        <img 
          src={artwork.image} 
          alt={artwork.title} 
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button size="sm" variant="secondary" className="shadow-lg">
            View in AR
          </Button>
        </div>
      </div>
      <div className="mt-2">
        <h4 className="text-sm font-medium truncate">{artwork.title}</h4>
        <p className="text-xs text-muted-foreground truncate">{artist?.name}</p>
      </div>
    </motion.div>
  );
};

const ModelARCard = ({ model, onClick }: { model: ARModel, onClick: () => void }) => {
  return (
    <motion.div 
      className="flex items-center cursor-pointer rounded-lg border p-2 hover:border-primary transition-colors"
      onClick={onClick}
      whileHover={{ scale: 1.02, borderColor: '#7c3aed' }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img 
          src={model.thumbnail} 
          alt={model.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="ml-3 flex-1">
        <h4 className="text-sm font-medium">{model.name}</h4>
        <p className="text-xs text-muted-foreground">{model.creator}</p>
      </div>
      <Box className="h-4 w-4 text-muted-foreground" />
    </motion.div>
  );
};

export default ARExploreSection;
