
import { useState } from 'react';
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
import { Search, Play, Calendar } from 'lucide-react';
import { performances } from '@/data/performanceData';

const Performances = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  
  const { data: performancesFromDB, isLoading, error } = useQuery({
    queryKey: ['performances'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performances')
        .select('*');
        
      if (error) throw error;
      return data;
    },
    // Fall back to our mock data if the query fails
    onError: (err) => {
      console.error('Error fetching performances:', err);
      return performances;
    }
  });
  
  // Use our mock data if the supabase query fails or returns empty
  const allPerformances = performancesFromDB?.length ? performancesFromDB : performances;
  
  // Filter performances
  const filteredPerformances = allPerformances?.filter(performance => {
    // Filter by search
    const matchesSearch = searchQuery === '' || 
      performance.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      performance.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      performance.artist.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === 'all' || 
      performance.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];
  
  const handlePlayVideo = (videoUrl: string) => {
    setActiveVideo(videoUrl);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Performance Hub</h1>
        <p className="text-muted-foreground mb-8">
          Experience captivating music, dance, and theater performances from talented artists
        </p>
        
        {/* Active video player */}
        {activeVideo && (
          <div className="bg-black rounded-lg overflow-hidden mb-8 aspect-video shadow-xl">
            <iframe
              src={activeVideo}
              className="w-full h-full"
              title="Performance Video"
              allowFullScreen
            ></iframe>
          </div>
        )}
        
        {/* Filters */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-grow">
                <label className="text-sm font-medium block mb-2">
                  Search Performances
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search by title, artist, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="w-full md:w-48">
                <label className="text-sm font-medium block mb-2">
                  Performance Type
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Performances</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="dance">Dance</SelectItem>
                    <SelectItem value="theater">Theater</SelectItem>
                    <SelectItem value="poetry">Poetry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Performances list */}
        <Tabs defaultValue="featured">
          <TabsList className="mb-6">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured" className="animate-fade-in">
            {isLoading ? (
              <div className="text-center py-12">
                <p>Loading performances...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">Error loading performances. Please try again.</p>
              </div>
            ) : filteredPerformances.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPerformances.map((performance) => (
                  <div key={performance.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
                    <div className="relative aspect-video group cursor-pointer" onClick={() => handlePlayVideo(performance.video_url)}>
                      <img 
                        src={performance.image} 
                        alt={performance.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-artnexus-purple rounded-full p-3">
                          <Play className="h-8 w-8 text-white" fill="white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{performance.title}</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        {performance.artist}
                      </p>
                      
                      <div className="flex items-center text-xs text-muted-foreground mb-3">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{performance.date}</span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {performance.description}
                      </p>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handlePlayVideo(performance.video_url)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Watch Performance
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No performances found matching your criteria</p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recent" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPerformances.slice(0, 3).map((performance) => (
                <div key={performance.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
                  <div className="relative aspect-video group cursor-pointer" onClick={() => handlePlayVideo(performance.video_url)}>
                    <img 
                      src={performance.image} 
                      alt={performance.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-artnexus-purple rounded-full p-3">
                        <Play className="h-8 w-8 text-white" fill="white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{performance.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      {performance.artist}
                    </p>
                    
                    <div className="flex items-center text-xs text-muted-foreground mb-3">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{performance.date}</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {performance.description}
                    </p>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handlePlayVideo(performance.video_url)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Watch Performance
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="popular" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPerformances.slice(3, 6).map((performance) => (
                <div key={performance.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
                  <div className="relative aspect-video group cursor-pointer" onClick={() => handlePlayVideo(performance.video_url)}>
                    <img 
                      src={performance.image} 
                      alt={performance.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-artnexus-purple rounded-full p-3">
                        <Play className="h-8 w-8 text-white" fill="white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{performance.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      {performance.artist}
                    </p>
                    
                    <div className="flex items-center text-xs text-muted-foreground mb-3">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{performance.date}</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {performance.description}
                    </p>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handlePlayVideo(performance.video_url)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Watch Performance
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming" className="animate-fade-in">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Check back soon for upcoming events!</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Performances;
