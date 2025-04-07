
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { artClasses as mockArtClasses } from '@/data/artClassesData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { IndianRupee } from 'lucide-react';

// Helper function to convert USD to INR
const convertToINR = (price: string) => {
  // Extract numeric value from price string (e.g., "$25" -> 25)
  const numericValue = parseFloat(price.replace(/[^0-9.]/g, ''));
  // Convert to INR (approximate exchange rate: 1 USD = 83 INR)
  const inrValue = Math.round(numericValue * 83);
  // Format as Indian rupees
  return `₹${inrValue.toLocaleString('en-IN')}`;
};

// Convert all prices in mock data
const convertedMockArtClasses = mockArtClasses.map(cls => ({
  ...cls,
  price: cls.price.startsWith('₹') ? cls.price : convertToINR(cls.price)
}));

// Levels and categories for filtering
const levels = ["all", "beginner", "intermediate", "advanced"];
const categories = ["all", "painting", "digital", "sculpture", "photography", "crafts", "drawing"];

export default function ArtClasses() {
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch art classes from Supabase
  const { data, isLoading, isError } = useQuery({
    queryKey: ['artClasses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('art_classes')
        .select('*, instructor:instructor_id(id, name, photo)');
      
      if (error) {
        console.error('Error fetching art classes:', error);
        throw error;
      }
      
      // Convert prices to INR if data is from Supabase
      return data?.map(cls => ({
        ...cls,
        price: cls.price.startsWith('₹') ? cls.price : convertToINR(cls.price)
      })) || [];
    },
    meta: {
      onError: (error: any) => {
        console.error('Error in art classes query:', error);
        toast.error('Failed to load art classes. Using sample data instead.');
      }
    }
  });

  // Use converted mock data if Supabase data is empty or there's an error
  const artClasses = (data && data.length > 0) ? data : convertedMockArtClasses;

  // Filter classes based on selected level, category, and search query
  const filteredClasses = artClasses.filter(cls => {
    const levelMatch = selectedLevel === "all" || cls.level === selectedLevel;
    const categoryMatch = selectedCategory === "all" || cls.category === selectedCategory;
    const searchMatch = searchQuery === "" || 
      cls.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cls.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return levelMatch && categoryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4 flex-1">
        <h1 className="text-3xl font-bold mb-6">Art Classes</h1>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {filteredClasses.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No classes found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.map(artClass => (
                  <Card key={artClass.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={artClass.image}
                        alt={artClass.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {artClass.level}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {artClass.category}
                        </span>
                      </div>
                      <CardTitle className="text-xl">{artClass.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-gray-500 line-clamp-2">{artClass.description}</p>
                      
                      <div className="flex items-center mt-4">
                        <img
                          src={artClass.instructor.photo}
                          alt={artClass.instructor.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium">{artClass.instructor.name}</p>
                          <p className="text-xs text-gray-500">Instructor</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center border-t pt-4">
                      <div className="flex items-center">
                        <p className="text-lg font-bold text-purple-600">{artClass.price}</p>
                        <p className="text-xs text-gray-500 ml-2">{artClass.duration}</p>
                      </div>
                      <Link to={`/class/${artClass.id}`}>
                        <Button size="sm">View Details</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
