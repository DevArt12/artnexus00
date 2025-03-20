
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  Search, Plus, ShoppingCart, Heart, 
  Filter, ArrowUpDown, Eye, Paintbrush
} from 'lucide-react';
import { marketplaceItems } from '@/data/marketplaceData';

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  const { data: items, isLoading, error } = useQuery({
    queryKey: ['marketplace-items'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('marketplace_items')
          .select(`
            *,
            artwork:artwork_id(
              id,
              title,
              image,
              description,
              category,
              medium,
              year,
              artist_id,
              artist:artist_id(
                id,
                name,
                photo
              )
            )
          `)
          .eq('status', 'available');
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching marketplace items:', error);
        // Fall back to mock data
        return marketplaceItems;
      }
    }
  });
  
  // Use our mock data if the query fails or supabase returns no items
  const allItems = items?.length ? items : marketplaceItems;
  
  // Filter items based on search, category, and price
  const filteredItems = allItems?.filter(item => {
    // For real supabase data, adjust this filtering logic based on the actual structure
    const title = 'artwork' in item ? item.artwork.title : item.title;
    const description = 'artwork' in item ? item.artwork.description : item.description;
    const category = 'artwork' in item ? item.artwork.category : item.category;
    const price = 'artwork' in item 
      ? parseFloat((item.price as string).replace(/[^0-9.]/g, '')) 
      : parseFloat((item.price as string).replace(/[^0-9.]/g, ''));
    
    // Filter by search
    const matchesSearch = searchQuery === '' || 
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
    
    // Filter by price
    const matchesPrice = !isNaN(price) && price >= priceRange[0] && price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  }) || [];
  
  // Sort filtered items
  const sortedItems = [...filteredItems].sort((a, b) => {
    // Get appropriate values based on item structure
    const priceA = 'artwork' in a 
      ? parseFloat((a.price as string).replace(/[^0-9.]/g, '')) 
      : parseFloat((a.price as string).replace(/[^0-9.]/g, ''));
    const priceB = 'artwork' in b 
      ? parseFloat((b.price as string).replace(/[^0-9.]/g, '')) 
      : parseFloat((b.price as string).replace(/[^0-9.]/g, ''));
    
    switch (sortBy) {
      case 'price-low':
        return priceA - priceB;
      case 'price-high':
        return priceB - priceA;
      case 'newest':
      default:
        return 0; // Default no specific sorting
    }
  });
  
  const handleAddToCart = (itemId: string) => {
    toast.success('Item added to cart', {
      description: 'Check your cart to complete your purchase.',
      action: {
        label: 'View Cart',
        onClick: () => console.log('View cart clicked')
      }
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Art Marketplace</h1>
            <p className="text-muted-foreground">
              Discover and collect unique artworks from talented artists
            </p>
          </div>
          
          <Link to="/upload-art">
            <Button className="mt-4 md:mt-0 bg-artnexus-purple hover:bg-artnexus-purple/90">
              <Plus className="mr-2 h-4 w-4" />
              Sell Your Art
            </Button>
          </Link>
        </div>
        
        {/* Filters */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-sm font-medium block mb-2">
                  Search Artworks
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search by title, artist, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">
                  Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="painting">Paintings</SelectItem>
                    <SelectItem value="sculpture">Sculptures</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="digital">Digital Art</SelectItem>
                    <SelectItem value="mixed-media">Mixed Media</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">
                  Price Range
                </label>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 5000]}
                    max={5000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Marketplace content */}
        <Tabs defaultValue="gallery">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="gallery">
                <Paintbrush className="h-4 w-4 mr-2" />
                Gallery View
              </TabsTrigger>
              <TabsTrigger value="list">
                <Filter className="h-4 w-4 mr-2" />
                List View
              </TabsTrigger>
            </TabsList>
            
            <div className="text-sm text-muted-foreground">
              {sortedItems.length} {sortedItems.length === 1 ? 'artwork' : 'artworks'} found
            </div>
          </div>
          
          <TabsContent value="gallery" className="animate-fade-in">
            {isLoading ? (
              <div className="text-center py-12">
                <p>Loading artworks...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">Error loading artworks. Please try again.</p>
              </div>
            ) : sortedItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedItems.map((item) => {
                  // Handle both mock data and real supabase data
                  const id = 'id' in item ? item.id : item.id;
                  const title = 'artwork' in item ? item.artwork.title : item.title;
                  const image = 'artwork' in item ? item.artwork.image : item.image;
                  const price = 'price' in item ? item.price : item.price;
                  const type = 'type' in item ? item.type : item.type;
                  const artistName = 'artwork' in item ? item.artwork.artist.name : item.artist.name;
                  const artistPhoto = 'artwork' in item ? item.artwork.artist.photo : item.artist.photo;
                  const medium = 'artwork' in item ? item.artwork.medium : item.medium;
                  
                  return (
                    <Card key={id} className="overflow-hidden group">
                      <div className="relative aspect-square overflow-hidden">
                        <img 
                          src={image} 
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex space-x-2">
                            <Button size="icon" variant="secondary" className="rounded-full">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="secondary" className="rounded-full">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary">
                            {type}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg truncate mb-1">{title}</h3>
                        
                        <div className="flex items-center mb-2">
                          <img 
                            src={artistPhoto} 
                            alt={artistName}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          <span className="text-sm text-muted-foreground">
                            {artistName}
                          </span>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-3">
                          {medium}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-lg">{price}</div>
                          
                          <Button 
                            size="sm" 
                            className="bg-artnexus-purple hover:bg-artnexus-purple/90"
                            onClick={() => handleAddToCart(id)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No artworks found matching your criteria</p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setPriceRange([0, 5000]);
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="list" className="animate-fade-in">
            {isLoading ? (
              <div className="text-center py-12">
                <p>Loading artworks...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">Error loading artworks. Please try again.</p>
              </div>
            ) : sortedItems.length > 0 ? (
              <div className="space-y-4">
                {sortedItems.map((item) => {
                  // Handle both mock data and real supabase data
                  const id = 'id' in item ? item.id : item.id;
                  const title = 'artwork' in item ? item.artwork.title : item.title;
                  const image = 'artwork' in item ? item.artwork.image : item.image;
                  const description = 'artwork' in item ? item.artwork.description : item.description;
                  const price = 'price' in item ? item.price : item.price;
                  const type = 'type' in item ? item.type : item.type;
                  const artistName = 'artwork' in item ? item.artwork.artist.name : item.artist.name;
                  const artistPhoto = 'artwork' in item ? item.artwork.artist.photo : item.artist.photo;
                  const medium = 'artwork' in item ? item.artwork.medium : item.medium;
                  const dimensions = 'artwork' in item && 'dimensions' in item.artwork 
                    ? item.artwork.dimensions 
                    : ('dimensions' in item ? item.dimensions : undefined);
                  
                  return (
                    <Card key={id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 mb-4 md:mb-0 md:mr-4">
                            <div className="aspect-square overflow-hidden rounded-md">
                              <img 
                                src={image} 
                                alt={title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          
                          <div className="md:w-3/4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-lg">{title}</h3>
                                <div className="flex items-center mb-2">
                                  <img 
                                    src={artistPhoto} 
                                    alt={artistName}
                                    className="w-5 h-5 rounded-full mr-2"
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    {artistName}
                                  </span>
                                </div>
                              </div>
                              <Badge variant="outline">{type}</Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="secondary" className="text-xs">
                                {medium}
                              </Badge>
                              {dimensions && (
                                <Badge variant="secondary" className="text-xs">
                                  {dimensions}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="font-bold text-lg">{price}</div>
                              
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="bg-artnexus-purple hover:bg-artnexus-purple/90"
                                  onClick={() => handleAddToCart(id)}
                                >
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No artworks found matching your criteria</p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setPriceRange([0, 5000]);
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Marketplace;
