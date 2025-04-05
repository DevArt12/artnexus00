
import { useState, useEffect } from 'react';
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

// Fallback categories from mock data
import { categories as mockCategories } from '@/data/mockData';

interface CategoryFilterProps {
  onSelectCategory: (category: string | null) => void;
  selectedCategory: string | null;
}

const fetchCategories = async () => {
  try {
    // Try to get distinct categories from the database
    // Using 'any' type to bypass the TypeScript type issue temporarily
    const { data, error }: { data: any[], error: any } = await supabase
      .from('artworks')
      .select('category')
      .not('category', 'is', null)
      .order('category');
    
    if (error) {
      throw error;
    }
    
    // Extract unique categories, handle data as any to bypass type constraints
    const uniqueCategories = [...new Set(data.map(item => item.category as string))];
    return uniqueCategories.length > 0 ? uniqueCategories : mockCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fall back to mock data if there's an error
    return mockCategories;
  }
};

const CategoryFilter = ({ onSelectCategory, selectedCategory }: CategoryFilterProps) => {
  // Use React Query to fetch and cache categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2 px-2 py-2">
            <Skeleton className="h-10 w-16 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-20 rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-22 rounded-full" />
          </div>
        </ScrollArea>
      </div>
    );
  }
  
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 px-2">
          <button
            onClick={() => onSelectCategory(null)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              !selectedCategory 
                ? "bg-artnexus-purple text-white" 
                : "bg-muted hover:bg-muted/80 text-foreground"
            )}
          >
            All
          </button>
          
          {categories?.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                selectedCategory === category 
                  ? "bg-artnexus-purple text-white" 
                  : "bg-muted hover:bg-muted/80 text-foreground"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategoryFilter;
