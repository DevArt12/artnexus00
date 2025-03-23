import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo size="medium" />
            <p className="text-sm text-muted-foreground">
              Connecting artists and art lovers in a heartfelt community dedicated to creativity and expression.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-artnexus-purple transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-artnexus-purple transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-artnexus-purple transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-artnexus-purple transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Explore</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-artnexus-purple transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/discover" className="hover:text-artnexus-purple transition-colors">Discover</Link>
              </li>
              <li>
                <Link to="/artists" className="hover:text-artnexus-purple transition-colors">Artists</Link>
              </li>
              <li>
                <Link to="/exhibitions" className="hover:text-artnexus-purple transition-colors">Exhibitions</Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-artnexus-purple transition-colors">Collections</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Join</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link to="/sign-up" className="hover:text-artnexus-purple transition-colors">Sign Up</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-artnexus-purple transition-colors">Login</Link>
              </li>
              <li>
                <Link to="/upload" className="hover:text-artnexus-purple transition-colors">Upload Artwork</Link>
              </li>
              <li>
                <Link to="/artist-resources" className="hover:text-artnexus-purple transition-colors">Artist Resources</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-artnexus-purple transition-colors">Pricing</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Information</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-artnexus-purple transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-artnexus-purple transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-artnexus-purple transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-artnexus-purple transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-artnexus-purple transition-colors">FAQ</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ArtNexus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
