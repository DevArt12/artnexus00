
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Menu, X } from 'lucide-react';
import Logo from '@/components/Logo';

const linkClasses = "text-sm font-medium hover:text-artnexus-purple transition-colors";

const Navbar = () => {
  const location = useLocation();
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setMounted(true);
    // Check if dark mode is active
    const isDarkMode = document.documentElement.classList.contains('dark');
    setCurrentTheme(isDarkMode ? 'dark' : 'light');
  }, []);
  
  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  }
  
  return (
    <header className="sticky top-0 z-40 bg-background border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Logo />
            <nav className="hidden md:flex items-center space-x-1 ml-10">
              <Link to="/" className={linkClasses}>Home</Link>
              <Link to="/discover" className={linkClasses}>Discover</Link>
              <Link to="/marketplace" className={linkClasses}>Marketplace</Link>
              <Link to="/ar-view/1" className={linkClasses}>AR View</Link>
              <Link to="/ar-models" className={linkClasses}>3D Models</Link>
              <Link to="/events" className={linkClasses}>Events</Link>
              <Link to="/art-classes" className={linkClasses}>Classes</Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchDialogOpen(true)}
              className="px-2"
            >
              <Search className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {mounted && (
                currentTheme === 'light' ? (
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                )
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="sm:w-64">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Explore ArtNexus
                  </SheetDescription>
                </SheetHeader>
                <nav className="grid gap-4 py-4">
                  <Link to="/" className={linkClasses}>Home</Link>
                  <Link to="/discover" className={linkClasses}>Discover</Link>
                  <Link to="/marketplace" className={linkClasses}>Marketplace</Link>
                  <Link to="/ar-view/1" className={linkClasses}>AR View</Link>
                  <Link to="/ar-models" className={linkClasses}>3D Models</Link>
                  <Link to="/events" className={linkClasses}>Events</Link>
                  <Link to="/art-classes" className={linkClasses}>Classes</Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      <Sheet open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost">Open</Button>
        </SheetTrigger>
        <SheetContent className="sm:w-full">
          <SheetHeader>
            <SheetTitle>Search</SheetTitle>
            <SheetDescription>
              Find artwork, artists, and more.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <Input placeholder="Search ArtNexus..." />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Navbar;
