
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, Camera3d, LogIn, ShoppingCart, View3d } from 'lucide-react';
import { toast } from 'sonner';

const Marketplace = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [user, setUser] = useState<any>(null);
  const [cartItems, setCartItems] = useState<string[]>([]);
  
  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // If user is logged in, fetch cart items from database
      if (user) {
        fetchCartItems(user.id);
      } else {
        // Get cart items from local storage
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      }
    };
    
    checkUser();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        
        // When auth state changes, update cart accordingly
        if (session?.user) {
          fetchCartItems(session.user.id);
        } else {
          // Get cart items from local storage when logged out
          const storedCart = localStorage.getItem('cart');
          if (storedCart) {
            setCartItems(JSON.parse(storedCart));
          }
        }
      }
    );
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  // Fetch cart items from database
  const fetchCartItems = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('marketplace_item_id')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      const itemIds = data.map(item => item.marketplace_item_id);
      setCartItems(itemIds);
    } catch (err) {
      console.error('Error fetching cart items:', err);
    }
  };
  
  // Fetch marketplace items
  const { data: marketplace, isLoading, error } = useQuery({
    queryKey: ['marketplace-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select(`
          *,
          artworks:artwork_id(
            id,
            title,
            description,
            image,
            medium,
            year,
            category,
            artists:artist_id(
              id,
              name,
              photo
            )
          )
        `);
        
      if (error) throw error;
      return data;
    }
  });
  
  const handleBuy = async (itemId: string) => {
    if (!user) {
      toast.error("Please sign in to add items to your cart");
      navigate('/auth');
      return;
    }
    
    try {
      // Check if item is already in cart
      if (cartItems.includes(itemId)) {
        toast.info("This item is already in your cart");
        return;
      }
      
      // Add item to database cart if logged in
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          marketplace_item_id: itemId,
          quantity: 1
        });
        
      if (error) throw error;
      
      // Update local state
      const updatedCart = [...cartItems, itemId];
      setCartItems(updatedCart);
      
      // Save to local storage as backup
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      toast({
        title: "Item Added to Cart",
        description: "The artwork has been added to your cart successfully.",
      });
    } catch (err: any) {
      console.error('Error adding to cart:', err);
      toast.error(err.message || "Failed to add item to cart");
    }
  };
  
  const handleUploadClick = () => {
    if (!user) {
      toast.error("Please sign in to upload artwork");
      navigate('/auth');
      return;
    }
    
    navigate('/upload-art');
  };
  
  const handleViewInAR = (artworkId: string) => {
    navigate(`/ar-view/${artworkId}`);
  };
  
  // Filter and sort marketplace items
  const filteredItems = marketplace?.filter(item => {
    // Filter by search
    const matchesSearch = searchQuery === '' || 
      item.artworks.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artworks.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.artworks.artists?.name && item.artworks.artists.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by category
    const matchesCategory = selectedCategory === 'all' || 
      item.artworks.category === selectedCategory;
    
    // Filter by price
    const itemPrice = parseInt(item.price.replace(/[^0-9]/g, ''));
    const matchesPrice = itemPrice >= priceRange[0] && itemPrice <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  }) || [];
  
  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, ''));
      case 'price-high':
        return parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, ''));
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Art Marketplace</h1>
            <p className="text-muted-foreground">
              Discover and collect unique artworks from talented artists worldwide
            </p>
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            {user ? (
              <>
                <Button 
                  onClick={handleUploadClick}
                  className="bg-artnexus-purple hover:bg-artnexus-purple/90"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Art
                </Button>
                
                <Button variant="outline" onClick={() => navigate('/profile')} className="relative">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Cart
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-artnexus-rose text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-artnexus-purple hover:bg-artnexus-purple/90"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search artworks..."
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
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="painting">Paintings</SelectItem>
                      <SelectItem value="sculpture">Sculptures</SelectItem>
                      <SelectItem value="digital">Digital Art</SelectItem>
                      <SelectItem value="photography">Photography</SelectItem>
                      <SelectItem value="mixed-media">Mixed Media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Price Range (${priceRange[0]} - ${priceRange[1]})
                  </label>
                  <Slider
                    defaultValue={priceRange}
                    max={5000}
                    step={50}
                    onValueChange={setPriceRange}
                    className="my-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$0</span>
                    <span>$5000+</span>
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
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Marketplace items */}
          <div className="w-full lg:w-3/4">
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="original">Original Art</TabsTrigger>
                <TabsTrigger value="print">Prints</TabsTrigger>
                <TabsTrigger value="digital">Digital</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="animate-fade-in">
                {isLoading ? (
                  <div className="text-center py-12">
                    <p>Loading marketplace items...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-red-500">Error loading items. Please try again.</p>
                  </div>
                ) : sortedItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedItems.map((item) => (
                      <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <Link to={`/artwork/${item.artwork_id}`} className="block relative aspect-square overflow-hidden">
                          <img 
                            src={item.artworks.image} 
                            alt={item.artworks.title} 
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                          />
                          {item.type !== 'original' && (
                            <span className="absolute top-2 right-2 bg-artnexus-purple text-white text-xs px-2 py-1 rounded-full">
                              {item.type}
                            </span>
                          )}
                        </Link>
                        
                        <div className="p-4">
                          <Link to={`/artwork/${item.artwork_id}`} className="block mb-1">
                            <h3 className="font-bold hover:text-artnexus-purple transition-colors">
                              {item.artworks.title}
                            </h3>
                          </Link>
                          
                          <Link to={`/artist/${item.artworks.artists.id}`} className="flex items-center mb-3">
                            <img 
                              src={item.artworks.artists.photo} 
                              alt={item.artworks.artists.name} 
                              className="w-5 h-5 rounded-full mr-2"
                            />
                            <span className="text-sm text-muted-foreground">
                              {item.artworks.artists.name}
                            </span>
                          </Link>
                          
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-lg">{item.price}</span>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewInAR(item.artwork_id)}
                                className="text-artnexus-teal"
                                title="View in AR"
                              >
                                <Camera3d className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/artwork/${item.artwork_id}`)}
                                className="text-artnexus-purple"
                                title="View Details"
                              >
                                <View3d className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full bg-artnexus-purple hover:bg-artnexus-purple/90"
                            onClick={() => handleBuy(item.id)}
                            disabled={cartItems.includes(item.id)}
                          >
                            {cartItems.includes(item.id) ? 'In Cart' : 'Add to Cart'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No items found matching your criteria</p>
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
              
              <TabsContent value="original" className="animate-fade-in">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading original artwork...</p>
                </div>
              </TabsContent>
              
              <TabsContent value="print" className="animate-fade-in">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading prints...</p>
                </div>
              </TabsContent>
              
              <TabsContent value="digital" className="animate-fade-in">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading digital items...</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

// Define the Upload icon which was missing in the imports
const Upload = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export default Marketplace;
