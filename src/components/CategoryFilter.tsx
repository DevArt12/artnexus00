
import { useState } from 'react';
import { categories } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategoryFilterProps {
  onSelectCategory: (category: string | null) => void;
  selectedCategory: string | null;
}

const CategoryFilter = ({ onSelectCategory, selectedCategory }: CategoryFilterProps) => {
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
          
          {categories.map((category) => (
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
