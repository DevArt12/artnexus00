import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { toast } from 'sonner';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArtCard from '@/components/ArtCard';
import CategoryFilter from '@/components/CategoryFilter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { 
  Search, 
  Sliders,
  Grid2X2,
  LayoutGrid,
  Loader2  
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Fallback to mock data if needed
import { artworks as mockArtworks, getArtistById } from '@/data/mockData';

// Number of items per page
const ITEMS_PER_PAGE = 12;

// Fetch artworks from Supabase
const fetchArtworks = async ({ 
  page = 1, 
  category = null, 
  searchQuery = '',
  sortBy = 'newest'
}) => {
  try {
    // Calculate pagination values
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;
    
    // Start query
    let query = supabase
      .from('artworks')
      .select(`
        *,
        profiles:artist_id(*)
      `, { count: 'exact' });
    
    // Apply category filter if selected
    if (category) {
      query = query.eq('category', category);
    }
    
    // Apply search filter if provided
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'popular':
        // In a real app, you'd have a likes count column
        query = query.order('created_at', { ascending: false });
        break;
      case 'discussed':
        // In a real app, you'd have a comments count column
        query = query.order('created_at', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }
    
    // Apply pagination
    query = query.range(from, to);
    
    // Execute query
    const { data, error, count } = await query;
    
    if (error) {
      throw error;
    }
    
    // Format the data to match our app's structure
    const formattedData = data.map(item => {
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        image: item.image,
        createdAt: item.created_at,
        artistId: item.artist_id,
        categories: [item.category],
        likes: 0, // Placeholder
        comments: 0, // Placeholder
        artist: {
          id: item.artist_id,
          // Since we're not sure if profiles are properly joined, fallback to mock data
          name: 'Unknown Artist',
          profileImage: 'https://via.placeholder.com/150'
        }
      };
    });
    
    return { 
      artworks: formattedData.length > 0 ? formattedData : mockArtworks, 
      count: count || mockArtworks.length,
      totalPages: Math.ceil((count || mockArtworks.length) / ITEMS_PER_PAGE)
    };
  } catch (error) {
    console.error('Error fetching artworks:', error);
    // Fall back to mock data
    return { 
      artworks: mockArtworks, 
      count: mockArtworks.length,
      totalPages: Math.ceil(mockArtworks.length / ITEMS_PER_PAGE)
    };
  }
};

const Discover = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get URL query parameters with defaults
  const pageParam = searchParams.get('page');
  const categoryParam = searchParams.get('category');
  
  // State
  const [currentPage, setCurrentPage] = useState(pageParam ? parseInt(pageParam) : 1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isGridView, setIsGridView] = useState(true);
  
  // Fetch artworks using React Query
  const {
    data,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['artworks', currentPage, selectedCategory, searchQuery, sortBy],
    queryFn: () => fetchArtworks({ 
      page: currentPage, 
      category: selectedCategory, 
      searchQuery,
      sortBy
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Destructure data with fallbacks
  const { artworks = [], count = 0, totalPages = 1 } = data || {};
  
  // Handle category selection
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
    
    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    setSearchParams(params);
  };
  
  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInputValue);
    setCurrentPage(1); // Reset to first page when search changes
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Update URL params
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    
    // Scroll to top of results
    window.scrollTo({
      top: document.getElementById('results-section')?.offsetTop - 100 || 0,
      behavior: 'smooth'
    });
  };
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when sort changes
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setSearchInputValue('');
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({});
  };
  
  // Generate pagination items
  const getPaginationItems = () => {
    // Create array of page numbers
    let items = [];
    
    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // If there are more than 5 pages and we're not close to the start,
    // show ellipsis after first page
    if (totalPages > 5 && currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      // Skip if already added (for edge cases)
      if (i === 1 || i === totalPages) continue;
      
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // If there are more than 5 pages and we're not close to the end,
    // show ellipsis before last page
    if (totalPages > 5 && currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
  
  // Show error if fetch fails
  useEffect(() => {
    if (isError) {
      toast.error("Failed to load artworks. Please try again later.");
    }
  }, [isError]);
  
  // Sync URL with state
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const pageParam = searchParams.get('page');
    
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
    
    if (pageParam) {
      const page = parseInt(pageParam);
      if (!isNaN(page) && page > 0 && page !== currentPage) {
        setCurrentPage(page);
      }
    }
  }, [searchParams]);
  
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
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search by title, artist, or keyword..."
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            
            <Button type="submit" className="bg-artnexus-purple hover:bg-artnexus-purple/90">
              Search
            </Button>
            
            <div className="flex items-center space-x-4">
              <div className="w-40">
                <Select value={sortBy} onValueChange={handleSortChange}>
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
          </form>
          
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>
        
        {/* Results section */}
        <div id="results-section">
          {/* Loading state */}
          {isLoading ? (
            <div className={`grid gap-6 ${
              isGridView 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1 md:grid-cols-2"
            }`}>
              {Array(8).fill(0).map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
                  <Skeleton className="w-full h-64" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Results count */}
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {artworks.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-
                {Math.min(currentPage * ITEMS_PER_PAGE, count)} of {count} results
                {(selectedCategory || searchQuery) && (
                  <Button 
                    variant="link" 
                    onClick={clearFilters}
                    className="ml-2 p-0 h-auto"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
              
              {/* Results grid */}
              <div className={`grid gap-6 animate-fade-in ${
                isGridView 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1 md:grid-cols-2"
              }`}>
                {artworks.length > 0 ? (
                  artworks.map((artwork) => (
                    <ArtCard 
                      key={artwork.id} 
                      artwork={artwork} 
                      artist={artwork.artist || getArtistById(artwork.artistId)!} 
                      isExpanded={!isGridView}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground mb-4">No artworks found matching your criteria</p>
                    <Button onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Pagination */}
              {artworks.length > 0 && totalPages > 1 && (
                <Pagination className="my-8">
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                      </PaginationItem>
                    )}
                    
                    {getPaginationItems()}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </>
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
