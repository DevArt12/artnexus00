
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Clock, UserCircle, BookOpen } from 'lucide-react';

const ArtClasses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  
  const { data: classes, isLoading, error } = useQuery({
    queryKey: ['art-classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('art_classes')
        .select(`
          *,
          instructor:instructor_id(
            id,
            name,
            photo
          )
        `);
        
      if (error) throw error;
      return data;
    }
  });
  
  // Filter classes
  const filteredClasses = classes?.filter(classItem => {
    // Filter by search
    const matchesSearch = searchQuery === '' || 
      classItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.instructor?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === 'all' || 
      classItem.category === selectedCategory;
    
    // Filter by level
    const matchesLevel = selectedLevel === 'all' || 
      classItem.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  }) || [];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Art Classes</h1>
        <p className="text-muted-foreground mb-8">
          Learn new techniques and improve your skills with expert-led video tutorials
        </p>
        
        {/* Filters */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">
                  Search Classes
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search by title, instructor, or keyword..."
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
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="painting">Painting</SelectItem>
                    <SelectItem value="drawing">Drawing</SelectItem>
                    <SelectItem value="sculpture">Sculpture</SelectItem>
                    <SelectItem value="digital">Digital Art</SelectItem>
                    <SelectItem value="mixed-media">Mixed Media</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">
                  Difficulty Level
                </label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Classes list */}
        <Tabs defaultValue="featured">
          <TabsList className="mb-6">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="new">Newest</TabsTrigger>
            <TabsTrigger value="free">Free Classes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured" className="animate-fade-in">
            {isLoading ? (
              <div className="text-center py-12">
                <p>Loading classes...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">Error loading classes. Please try again.</p>
              </div>
            ) : filteredClasses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.map((classItem) => (
                  <Link 
                    key={classItem.id} 
                    to={`/classes/${classItem.id}`}
                    className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-video">
                      <img 
                        src={classItem.image} 
                        alt={classItem.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-artnexus-purple">
                          {classItem.level}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{classItem.title}</h3>
                      
                      <div className="flex items-center mb-2">
                        <img 
                          src={classItem.instructor?.photo || "https://via.placeholder.com/150"} 
                          alt={classItem.instructor?.name || "Instructor"} 
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <span className="text-sm text-muted-foreground">
                          {classItem.instructor?.name || "Instructor"}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {classItem.description}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{classItem.duration}</span>
                        </div>
                        <div className="font-bold text-artnexus-purple">
                          {classItem.price === "0" ? "Free" : classItem.price}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No classes found matching your criteria</p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="popular" className="animate-fade-in">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading popular classes...</p>
            </div>
          </TabsContent>
          
          <TabsContent value="new" className="animate-fade-in">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading newest classes...</p>
            </div>
          </TabsContent>
          
          <TabsContent value="free" className="animate-fade-in">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading free classes...</p>
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

export default ArtClasses;
