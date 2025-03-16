
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArtCard from '@/components/ArtCard';
import CategoryFilter from '@/components/CategoryFilter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Sliders,
  Grid2X2,
  LayoutGrid  
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  artworks, 
  getArtistById,
  categories
} from '@/data/mockData';

const Discover = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filteredArtworks, setFilteredArtworks] = useState([...artworks]);
  const [isGridView, setIsGridView] = useState(true);
  
  // Parse category from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category && categories.includes(category)) {
      setSelectedCategory(category);
    }
  }, [location.search]);
  
  // Filter and sort artworks
  useEffect(() => {
    let filtered = [...artworks];
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(artwork => 
        artwork.categories.includes(selectedCategory)
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(artwork => 
        artwork.title.toLowerCase().includes(query) || 
        artwork.description.toLowerCase().includes(query) ||
        getArtistById(artwork.artistId)?.name.toLowerCase().includes(query) ||
        artwork.categories.some(category => category.toLowerCase().includes(query))
      );
    }
    
    // Sort artworks
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'oldest':
        filtered.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'discussed':
        filtered.sort((a, b) => b.comments - a.comments);
        break;
      default:
        break;
    }
    
    setFilteredArtworks(filtered);
  }, [selectedCategory, searchQuery, sortBy]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Discover Artwork</h1>
        <p className="text-muted-foreground mb-8">
          Explore and discover amazing artwork from talented artists around the world
        </p>
        
        {/* Search and filter section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search by title, artist, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-40">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="discussed">Most Discussed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className={!isGridView ? "bg-muted" : ""}
                  onClick={() => setIsGridView(false)}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={isGridView ? "bg-muted" : ""}
                  onClick={() => setIsGridView(true)}
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
        
        {/* Results section */}
        <div className={`grid gap-6 animate-fade-in ${
          isGridView 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1 md:grid-cols-2"
        }`}>
          {filteredArtworks.map((artwork) => {
            const artist = getArtistById(artwork.artistId)!;
            return (
              <ArtCard 
                key={artwork.id} 
                artwork={artwork} 
                artist={artist} 
                isExpanded={!isGridView}
              />
            );
          })}
          
          {filteredArtworks.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground mb-4">No artworks found matching your criteria</p>
              <Button 
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                  setSortBy('newest');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Discover;
