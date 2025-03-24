
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Logo = ({ size = 'medium', className = '' }: LogoProps) => {
  const sizeClasses = {
    small: 'h-14',
    medium: 'h-18',
    large: 'h-30',
  };

  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/b5ada39c-8cf1-41eb-a818-c827f82512de.png" 
        alt="ArtNexus Logo" 
        className={`${sizeClasses[size]}`}
      />
    </Link>
  );
};

export default Logo;
