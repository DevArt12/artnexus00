
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Filter, Search, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { marketplaceData } from '@/data/marketplaceData';

// Artwork categories
const categories = [
  'Painting',
  'Sculpture',
  'Digital Art',
  'Photography',
  'Mixed Media',
  'Drawing',
  'Printmaking',
  'Textile',
];

// Artwork types
const artTypes = [
  { value: 'original', label: 'Original' },
  { value: 'print', label: 'Print' },
  { value: 'digital', label: 'Digital' },
];

// Dummy cart items
interface CartItem {
  id: string;
  title: string;
  price: string;
  type: string;
  image: string;
}

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Fetch marketplace items from Supabase
  const { data, isLoading, isError } = useQuery({
    queryKey: ['marketplace'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select(`
          *,
          artwork:artwork_id(
            id, title, image, description, category, medium, year, artist_id,
            artist:artist_id(id, name, photo)
          )
        `)
        .eq('status', 'available');
      
      if (error) {
        console.error('Error fetching marketplace items:', error);
        throw error;
      }
      
      return data;
    }
  });
  
  // Use mock data if Supabase data is empty or there's an error
  const items = (data && data.length > 0) ? data : marketplaceData;
  
  // Handle category toggle
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  // Handle type toggle
  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };
  
  // Add item to cart
  const addToCart = (item: any) => {
    const newItem = {
      id: item.artwork.id,
      title: item.artwork.title,
      price: item.price,
      type: item.type,
      image: item.artwork.image
    };
    
    if (!cartItems.some(cartItem => cartItem.id === newItem.id)) {
      setCartItems([...cartItems, newItem]);
      toast.success(`${newItem.title} added to cart`);
    } else {
      toast.info('This item is already in your cart');
    }
  };
  
  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.info('Item removed from cart');
  };
  
  // Log view cart click
  const handleViewCartClick = () => {
    console.info('View cart clicked');
    setIsCartOpen(true);
  };
  
  // Filter marketplace items
  const filteredItems = items.filter((item: any) => {
    // Skip items with missing artwork data
    if (!item.artwork) return false;
    
    // Search query filter
    const searchMatch = searchQuery === '' || 
      item.artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artwork.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.artwork.artist?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const categoryMatch = selectedCategories.length === 0 || 
      (item.artwork.category && selectedCategories.includes(item.artwork.category));
    
    // Type filter
    const typeMatch = selectedTypes.length === 0 || 
      (item.type && selectedTypes.includes(item.type));
    
    // Price filter
    const numericPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
    const priceMatch = !isNaN(numericPrice) && 
      numericPrice >= priceRange[0] && 
      numericPrice <= priceRange[1];
    
    return searchMatch && categoryMatch && typeMatch && priceMatch;
  });
  
  // Sort filtered items
  const sortedItems = [...filteredItems].sort((a: any, b: any) => {
    if (!a.artwork || !b.artwork) return 0;
    
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price.replace(/[^0-9.-]+/g, '')) - parseFloat(b.price.replace(/[^0-9.-]+/g, ''));
      case 'price-high':
        return parseFloat(b.price.replace(/[^0-9.-]+/g, '')) - parseFloat(a.price.replace(/[^0-9.-]+/g, ''));
      case 'newest':
      default:
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    }
  });
  
  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.-]+/g, '')) || 0;
    return total + price;
  }, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Artwork Marketplace</h1>
            <p className="text-gray-500 mt-1">Discover and collect unique artworks</p>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleViewCartClick}
              className="relative"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {cartItems.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                  {cartItems.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className={`w-full md:w-64 lg:w-72 shrink-0 space-y-6 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Filters</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsFilterOpen(false)}
                  className="md:hidden h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Price Range</h4>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 5000]}
                      max={10000}
                      step={100}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="mb-6"
                    />
                    <div className="flex justify-between text-sm">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                
                {/* Categories */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className="ml-2 text-sm cursor-pointer"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Types */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Types</h4>
                  <div className="space-y-2">
                    {artTypes.map(type => (
                      <div key={type.value} className="flex items-center">
                        <Checkbox
                          id={`type-${type.value}`}
                          checked={selectedTypes.includes(type.value)}
                          onCheckedChange={() => toggleType(type.value)}
                        />
                        <label
                          htmlFor={`type-${type.value}`}
                          className="ml-2 text-sm cursor-pointer"
                        >
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Reset Filters */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedTypes([]);
                    setPriceRange([0, 5000]);
                    setSearchQuery('');
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Search artwork, artist, description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                </div>
                <div className="w-full sm:w-48">
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
            
            {/* Artwork Grid */}
            <div>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : sortedItems.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-medium">No artworks found</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your filters or search query</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedItems.map((item: any) => (
                    item.artwork && (
                      <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={item.artwork.image}
                            alt={item.artwork.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold">{item.artwork.title}</h3>
                            <Badge variant={
                              item.type === 'original' ? 'default' :
                              item.type === 'print' ? 'secondary' : 
                              'outline'
                            }>
                              {item.type}
                            </Badge>
                          </div>
                          {item.artwork.artist && (
                            <div className="flex items-center mt-1">
                              <img
                                src={item.artwork.artist.photo}
                                alt={item.artwork.artist.name}
                                className="w-6 h-6 rounded-full object-cover mr-2"
                              />
                              <span className="text-sm text-gray-500">
                                {item.artwork.artist.name}
                              </span>
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="pb-3">
                          <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                            {item.artwork.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.artwork.category && (
                              <Badge variant="outline" className="text-xs">
                                {item.artwork.category}
                              </Badge>
                            )}
                            {item.artwork.medium && (
                              <Badge variant="outline" className="text-xs">
                                {item.artwork.medium}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center border-t pt-3">
                          <div className="font-bold text-lg">{item.price}</div>
                          <Button size="sm" onClick={() => addToCart(item)}>
                            Add to Cart
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Shopping Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md h-full overflow-auto animate-in slide-in-from-right">
            <div className="p-4 border-b sticky top-0 bg-white dark:bg-gray-800 z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Your Cart</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsCartOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="text-lg font-medium mt-4">Your cart is empty</h3>
                  <p className="text-gray-500 mt-2">Add some artworks to get started</p>
                  <Button 
                    className="mt-6" 
                    onClick={() => setIsCartOpen(false)}
                  >
                    Browse Artworks
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex border rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-24 h-24 object-cover"
                        />
                        <div className="flex-1 p-3">
                          <div className="flex justify-between">
                            <h4 className="font-medium line-clamp-1">{item.title}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex justify-between items-end mt-2">
                            <Badge variant="outline">{item.type}</Badge>
                            <span className="font-bold">{item.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Shipping</span>
                      <span className="font-medium">Free</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-4">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full">Proceed to Checkout</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}
