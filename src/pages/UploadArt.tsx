
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { UploadCloud, Image, X, AlertTriangle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const UploadArt = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [medium, setMedium] = useState('');
  const [year, setYear] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('original');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Check if user is authenticated on component mount
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to upload artwork');
        navigate('/auth');
        return;
      }
      
      setUser(user);
    };
    
    checkUser();
  }, [navigate]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Image selection triggered");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Selected file:", file.name, "size:", file.size);
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File is too large. Maximum size is 10MB.');
        return;
      }
      
      setImageFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        console.log("Preview generated successfully");
      };
      reader.readAsDataURL(file);
    }
  };
  
  const clearImageSelection = () => {
    setImageFile(null);
    setImagePreview(null);
    console.log("Image selection cleared");
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to upload artwork');
      navigate('/auth');
      return;
    }
    
    if (!imageFile) {
      toast.error('Please select an image');
      return;
    }
    
    try {
      setLoading(true);
      
      // 1. Upload image to storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(filePath, imageFile);
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('artworks')
        .getPublicUrl(filePath);
      
      // 2. Create artwork entry in database
      const { data: artworkData, error: artworkError } = await supabase
        .from('artworks')
        .insert({
          title,
          description,
          medium,
          year,
          category,
          image: publicUrl,
          artist_id: user.id,
          aspectratio: '1:1', // Default or calculate based on image
        })
        .select('id')
        .single();
      
      if (artworkError) {
        console.error('Artwork creation error:', artworkError);
        throw artworkError;
      }
      
      // 3. Create marketplace item
      const { error: marketplaceError } = await supabase
        .from('marketplace_items')
        .insert({
          artwork_id: artworkData.id,
          price: `$${price}`,
          type: type,
          status: 'available',
        });
      
      if (marketplaceError) {
        console.error('Marketplace item creation error:', marketplaceError);
        throw marketplaceError;
      }
      
      toast.success('Artwork uploaded successfully!');
      navigate('/marketplace');
    } catch (error: any) {
      console.error('Error uploading artwork:', error);
      toast.error(error.message || 'Failed to upload artwork');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Upload Your Artwork</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Artwork Details</CardTitle>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter artwork title"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your artwork"
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Medium</label>
                      <Input
                        value={medium}
                        onChange={(e) => setMedium(e.target.value)}
                        placeholder="e.g., Oil on canvas"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Year</label>
                      <Input
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="Year created"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="painting">Painting</SelectItem>
                        <SelectItem value="sculpture">Sculpture</SelectItem>
                        <SelectItem value="digital">Digital Art</SelectItem>
                        <SelectItem value="photography">Photography</SelectItem>
                        <SelectItem value="mixed-media">Mixed Media</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price (USD)</label>
                      <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Enter price"
                        min="1"
                        step="0.01"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Type</label>
                      <Select value={type} onValueChange={setType} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="original">Original</SelectItem>
                          <SelectItem value="print">Print</SelectItem>
                          <SelectItem value="digital">Digital</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-artnexus-purple hover:bg-artnexus-purple/90"
                    disabled={loading || !imageFile}
                  >
                    {loading ? 'Uploading...' : 'Upload Artwork'}
                    <UploadCloud className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
          
          <div>
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Artwork Image</CardTitle>
              </CardHeader>
              
              <CardContent>
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Artwork preview" 
                      className="w-full h-80 object-contain rounded-md mb-4"
                    />
                    <button
                      type="button"
                      onClick={clearImageSelection}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 h-80 flex flex-col items-center justify-center text-center">
                    <Image className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-2">Drag and drop your artwork image here</p>
                    <p className="text-gray-400 text-sm mb-4">or</p>
                    <label htmlFor="artwork-image" className="cursor-pointer">
                      <span 
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 h-10 px-4 py-2"
                      >
                        Select Image
                      </span>
                      <input
                        id="artwork-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="text-gray-400 text-xs mt-4">
                      Supported formats: JPG, PNG, GIF. Max file size: 10MB
                    </p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex-col space-y-2">
                <div className="flex items-start space-x-2 text-amber-500 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    Your artwork will be displayed in the marketplace and available for AR view. High-quality images work best for AR experiences.
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default UploadArt;
