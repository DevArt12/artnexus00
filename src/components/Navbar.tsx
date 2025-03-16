
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Menu, 
  X, 
  Home,
  Compass,
  Heart,
  User,
  Bell
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-artnexus-purple to-artnexus-teal flex items-center justify-center">
                <span className="text-white font-bold text-sm">AN</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-artnexus-purple to-artnexus-teal">
                ArtNexus
              </span>
            </Link>
          </div>
          
          {/* Desktop search bar */}
          <div className="hidden md:flex relative w-1/3 mx-4">
            <Input
              type="text"
              placeholder="Search artists, artwork..."
              className="w-full pl-10 pr-4 py-2 rounded-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-artnexus-purple transition-colors">
              <Home className="h-5 w-5" />
            </Link>
            <Link to="/discover" className="text-foreground hover:text-artnexus-purple transition-colors">
              <Compass className="h-5 w-5" />
            </Link>
            <Link to="/favorites" className="text-foreground hover:text-artnexus-purple transition-colors">
              <Heart className="h-5 w-5" />
            </Link>
            <Link to="/notifications" className="text-foreground hover:text-artnexus-purple transition-colors">
              <Bell className="h-5 w-5" />
            </Link>
            <Link to="/profile" className="text-foreground hover:text-artnexus-purple transition-colors">
              <User className="h-5 w-5" />
            </Link>
            <Button size="sm" className="bg-gradient-to-r from-artnexus-purple to-artnexus-teal text-white font-medium px-4">
              Upload Art
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 py-3 animate-fade-in">
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Search artists, artwork..."
                className="w-full pl-10 pr-4 py-2 rounded-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
              
              <Link 
                to="/discover" 
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <Compass className="h-5 w-5" />
                <span>Discover</span>
              </Link>
              
              <Link 
                to="/favorites" 
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-5 w-5" />
                <span>Favorites</span>
              </Link>
              
              <Link 
                to="/notifications" 
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </Link>
              
              <Link 
                to="/profile" 
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              
              <Button size="sm" className="bg-gradient-to-r from-artnexus-purple to-artnexus-teal text-white font-medium">
                Upload Art
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
